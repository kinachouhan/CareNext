import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Upload, CheckCircle2, ShieldCheck, Loader2, Copy, ArrowLeft } from "lucide-react";
import { placeOrderThunk } from "../../../slice/order/orderThunk";
import { clearCart } from "../../../slice/cart/cartSlice";
import toast from "react-hot-toast";

const UpiPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Passed from CheckoutPage via route state
  const { orderPayload } = location.state || {};

  const [screenshot, setScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const upiId = import.meta.env.VITE_UPI_ID; 

  if (!orderPayload) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-gray-800">No Order Data Found</h2>
        <button onClick={() => navigate("/checkout")} className="mt-4 bg-[#06A1B7] text-white px-5 py-2.5 rounded-xl font-bold text-sm">
          Return to Checkout
        </button>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    toast.success("UPI ID Copied to clipboard!");
  };

  const handleFinalSubmit = async () => {
    if (!screenshot) {
      toast.error("Please upload the payment confirmation screenshot!");
      return;
    }

    setIsSubmitting(true);
    try {
      // If you are uploading files to Cloudinary/S3, upload 'screenshot' file first 
      // and get the secure URL. For demonstration, we simulate or pass a mockup string/URL.
      // e.g., const formData = new FormData(); formData.append("image", screenshot);
      // const uploadRes = await api.post("/upload", formData);
      
      const mockScreenshotUrl = previewUrl; // Replace with actual uploaded image URL from server

      const finalPayload = {
        ...orderPayload,
        paymentProof: mockScreenshotUrl,
        paymentStatus: "Verification Required",
      };

      await dispatch(placeOrderThunk(finalPayload)).unwrap();
      dispatch(clearCart());
      toast.success("Payment proof submitted successfully!");
      navigate("/order");
    } catch (error) {
      toast.error(error || "Failed to submit order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 mt-16 md:mt-20">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        
        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Scan & Pay via UPI</h1>
            <p className="text-xs text-gray-500">Total Payable: <span className="font-bold text-gray-900">₹{orderPayload.totalAmount}</span></p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col items-center my-6">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-inner">
            <img 
              src="/Scanner.jpeg" 
              alt="UPI QR Code" 
              className="w-48 h-48 object-contain rounded-xl"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Scan using GPay, PhonePe, Paytm, or BHIM</p>

          <div className="flex items-center gap-2 mt-4 bg-cyan-50 px-4 py-2 rounded-xl border border-cyan-100">
            <span className="text-xs font-semibold text-gray-600">UPI ID: <strong className="text-[#06A1B7]">{upiId}</strong></span>
            <button onClick={handleCopyUpi} className="text-[#06A1B7] hover:text-[#058a9d]" title="Copy UPI ID">
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Screenshot Upload Section */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            Upload Payment Screenshot Confirmation *
          </label>

          {!previewUrl ? (
            <label className="border-2 border-dashed border-gray-200 hover:border-[#06A1B7] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 transition-all group">
              <div className="w-12 h-12 bg-cyan-50 text-[#06A1B7] rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload size={20} />
              </div>
              <span className="text-xs font-bold text-gray-700">Click to upload screenshot</span>
              <span className="text-[10px] text-gray-400 mt-0.5">Supports PNG, JPG, JPEG</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 p-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={previewUrl} alt="Preview" className="w-14 h-14 object-cover rounded-xl" />
                <div>
                  <p className="text-xs font-bold text-gray-800">Screenshot Attached</p>
                  <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Ready to submit
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setScreenshot(null); setPreviewUrl(""); }} 
                className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Change
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting || !screenshot}
            className="w-full bg-[#06A1B7] hover:bg-[#058a9d] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <span>Submit Payment & Confirm Order</span>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-4">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Manual verification takes up to 30 mins</span>
        </div>

      </div>
    </div>
  );
};

export default UpiPaymentPage;
