import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  LogOut, 
  ShieldCheck, 
  ChevronRight, 
  Mail, 
  Phone,
  Edit2,
  X,
  Loader2,
  Check
} from "lucide-react";

import toast from "react-hot-toast";
import { logoutThunk, getMeThunk, updateProfileThunk } from "../../../slice/auth/authThunk"; // Ensure updateProfileThunk is exported from your auth slice

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isLoading } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch current user on mount/refresh
  useEffect(() => {
    if (!user) {
      dispatch(getMeThunk());
    } else {
      reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [dispatch, user, reset]);

  const handleLogout = async () => {
    dispatch(logoutThunk());
  };

  const handleUpdateProfile = async (data) => {
    setIsSubmitting(true);
    try {
      // Dispatch your update profile thunk here
      await dispatch(updateProfileThunk(data)).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#06A1B7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && !isLoading) {
    navigate("/auth/login", { replace: true });
    return null;
  }

  const initials = user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 mt-16 md:mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="md:col-span-1 bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-fit">
          <div className="flex items-center gap-3.5 pb-5 border-b border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#06A1B7] flex items-center justify-center font-extrabold text-xl shadow-inner">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-gray-400 font-medium">Hello,</p>
              <h2 className="font-bold text-gray-900 truncate">{user?.fullName || "User"}</h2>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-4">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === "profile" 
                  ? "bg-cyan-50/80 text-[#06A1B7]" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <User size={18} />
                <span>Personal Info</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            <button
              onClick={() => navigate("/orders")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              <div className="flex items-center gap-3">
                <Package size={18} />
                <span>My Orders</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            <button
              onClick={() => navigate("/wishlist")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              <div className="flex items-center gap-3">
                <Heart size={18} />
                <span>Wishlist</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            <button
              onClick={() => navigate("/addresses")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              <div className="flex items-center gap-3">
                <MapPin size={18} />
                <span>Saved Addresses</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            <div className="pt-3 mt-3 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="md:col-span-3 space-y-6">
          {activeTab === "profile" && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Account Details</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Manage your personal information and security</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 bg-cyan-50 hover:bg-cyan-100 text-[#06A1B7] px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    >
                      <Edit2 size={15} />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    >
                      <X size={15} />
                      <span>Cancel</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold w-fit">
                    <ShieldCheck size={16} />
                    <span>Verified</span>
                  </div>
                </div>
              </div>

              {!isEditing ? (
                /* VIEW MODE */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      <User size={14} />
                      <span>Full Name</span>
                    </div>
                    <p className="text-base font-bold text-gray-800">{user?.fullName || "Not Provided"}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      <Mail size={14} />
                      <span>Email Address</span>
                    </div>
                    <p className="text-base font-bold text-gray-800">{user?.email || "Not Provided"}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      <Phone size={14} />
                      <span>Phone Number</span>
                    </div>
                    <p className="text-base font-bold text-gray-800">{user?.phone || "Not Provided"}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      <ShieldCheck size={14} />
                      <span>Membership Status</span>
                    </div>
                    <p className="text-base font-bold text-[#06A1B7]">Standard Customer</p>
                  </div>
                </div>
              ) : (
                /* EDIT MODE FORM */
                <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        {...register("fullName", { required: "Name is required" })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#06A1B7] focus:outline-none text-sm"
                        placeholder="Full Name"
                      />
                      {errors.fullName && <span className="text-[10px] text-red-500 mt-1 block">{errors.fullName.message}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#06A1B7] focus:outline-none text-sm"
                        placeholder="Email Address"
                      />
                      {errors.email && <span className="text-[10px] text-red-500 mt-1 block">{errors.email.message}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Phone Number</label>
                      <input
                        type="tel"
                        {...register("phone", { 
                          pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" }
                        })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#06A1B7] focus:outline-none text-sm"
                        placeholder="10-digit phone number"
                      />
                      {errors.phone && <span className="text-[10px] text-red-500 mt-1 block">{errors.phone.message}</span>}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#06A1B7] hover:bg-[#058a9d] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;