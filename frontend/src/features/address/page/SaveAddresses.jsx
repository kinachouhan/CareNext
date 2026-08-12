import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { MapPin, Plus, Trash2, Edit2, Home, Briefcase, Building, X, CheckCircle2, Loader2 } from "lucide-react";
import { getAddressesThunk, addAddressThunk, updateAddressThunk, deleteAddressThunk } from "../../../slice/address/addressThunk";
import toast from "react-hot-toast";

const SavedAddresses = () => {
  const dispatch = useDispatch();
  const { addresses, loading } = useSelector((state) => state.address);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      addressType: "Home",
      isDefault: false,
    },
  });

  const currentAddressType = watch("addressType");

  useEffect(() => {
    dispatch(getAddressesThunk());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setEditingId(null);
    reset({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      addressType: "Home",
      isDefault: false,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (addr) => {
    setEditingId(addr._id);
    reset({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      addressType: addr.addressType || "Home",
      isDefault: addr.isDefault || false,
    });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingId) {
        await dispatch(updateAddressThunk({ id: editingId, formData: data })).unwrap();
        toast.success("Address updated successfully!");
      } else {
        await dispatch(addAddressThunk(data)).unwrap();
        toast.success("Address added successfully!");
      }
      setShowModal(false);
      setEditingId(null);
    } catch (error) {
      toast.error(error || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAddressThunk(id)).unwrap();
      toast.success("Address removed");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const getIcon = (type) => {
    if (type === "Work") return <Briefcase size={16} />;
    if (type === "Other") return <Building size={16} />;
    return <Home size={16} />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 mt-16 md:mt-20">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        
        {/* Header section */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saved Addresses</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your delivery locations for swift checkout</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-[#06A1B7] hover:bg-[#058a9d] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>Add New Address</span>
          </button>
        </div>

        {/* Loading / Empty / List State */}
        {loading && addresses.length === 0 ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#06A1B7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-cyan-50 text-[#06A1B7] rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No saved addresses found</h3>
            <p className="text-sm text-gray-500 mt-1">Add an address to speed up your future orders.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {addresses.map((addr) => (
              <div 
                key={addr._id} 
                className={`relative p-5 rounded-2xl border transition-all ${
                  addr.isDefault ? "border-[#06A1B7] bg-cyan-50/20" : "border-gray-100 bg-gray-50/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#06A1B7] bg-cyan-50 px-3 py-1 rounded-full">
                    {getIcon(addr.addressType)}
                    {addr.addressType}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(addr)}
                      className="text-gray-400 hover:text-[#06A1B7] p-1.5 rounded-lg hover:bg-cyan-50 transition-colors"
                      title="Edit Address"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(addr._id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Address"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900">{addr.fullName}</h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {addr.street}, {addr.city}, {addr.state} - <span className="font-semibold">{addr.pincode}</span>
                </p>
                <p className="text-xs font-medium text-gray-500 mt-2">Phone: {addr.phone}</p>

                {addr.isDefault && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 size={12} />
                    Default Address
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD / EDIT ADDRESS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? "Edit Delivery Address" : "Add Delivery Address"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    {...register("fullName", { required: "Name is required" })}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none text-sm ${
                      errors.fullName ? "border-red-500" : "border-gray-200 focus:border-[#06A1B7]"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <span className="text-[10px] text-red-500 mt-1 block">{errors.fullName.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    {...register("phone", { 
                      required: "Phone is required",
                      pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" }
                    })}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none text-sm ${
                      errors.phone ? "border-red-500" : "border-gray-200 focus:border-[#06A1B7]"
                    }`}
                    placeholder="9876543210"
                  />
                  {errors.phone && <span className="text-[10px] text-red-500 mt-1 block">{errors.phone.message}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  {...register("street", { required: "Street address is required" })}
                  className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none text-sm ${
                    errors.street ? "border-red-500" : "border-gray-200 focus:border-[#06A1B7]"
                  }`}
                  placeholder="House / Flat No., Apartment, Street"
                />
                {errors.street && <span className="text-[10px] text-red-500 mt-1 block">{errors.street.message}</span>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">City</label>
                  <input
                    type="text"
                    {...register("city", { required: "City is required" })}
                    className={`w-full px-3 py-2.5 rounded-xl border focus:outline-none text-sm ${
                      errors.city ? "border-red-500" : "border-gray-200 focus:border-[#06A1B7]"
                    }`}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">State</label>
                  <input
                    type="text"
                    {...register("state", { required: "State is required" })}
                    className={`w-full px-3 py-2.5 rounded-xl border focus:outline-none text-sm ${
                      errors.state ? "border-red-500" : "border-gray-200 focus:border-[#06A1B7]"
                    }`}
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Pincode</label>
                  <input
                    type="text"
                    {...register("pincode", { 
                      required: "Pincode required",
                      pattern: { value: /^[0-9]{6}$/, message: "Invalid PIN" }
                    })}
                    className={`w-full px-3 py-2.5 rounded-xl border focus:outline-none text-sm ${
                      errors.pincode ? "border-red-500" : "border-gray-200 focus:border-[#06A1B7]"
                    }`}
                    placeholder="PIN Code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Address Type</label>
                <div className="flex gap-3">
                  {["Home", "Work", "Other"].map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setValue("addressType", type)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        currentAddressType === type
                          ? "bg-[#06A1B7] text-white border-[#06A1B7]"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  {...register("isDefault")}
                  className="w-4 h-4 text-[#06A1B7] rounded border-gray-300 focus:ring-[#06A1B7]"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 select-none">
                  Make this my default address
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#06A1B7] hover:bg-[#058a9d] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  <span>{editingId ? "Update Address" : "Save Address"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedAddresses;