import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
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
  Edit3
} from "lucide-react";

import api from "../../../api/axios";
import toast from "react-hot-toast";
import { logoutThunk } from "../../../slice/auth/authThunk";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const handleLogout = async () => {
      dispatch(logoutThunk())
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#06A1B7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 mt-16 md:mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* SIDEBAR NAVIGATION (Flipkart/Swiggy Style) */}
        <div className="md:col-span-1 bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-fit">
          {/* User Quick Mini Card */}
          <div className="flex items-center gap-3.5 pb-5 border-b border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#06A1B7] flex items-center justify-center font-extrabold text-xl shadow-inner">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-gray-400 font-medium">Hello,</p>
              <h2 className="font-bold text-gray-900 truncate">{user?.fullName || "User"}</h2>
            </div>
          </div>

          {/* Menu Items */}
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
              onClick={() => navigate("/order")}
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
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Account Details</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Manage your personal information and security</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold w-fit">
                  <ShieldCheck size={16} />
                  <span>Verified Account</span>
                </div>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                
                {/* Full Name */}
                <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    <User size={14} />
                    <span>Full Name</span>
                  </div>
                  <p className="text-base font-bold text-gray-800">{user?.fullName || "Not Provided"}</p>
                </div>

                {/* Email Address */}
                <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    <Mail size={14} />
                    <span>Email Address</span>
                  </div>
                  <p className="text-base font-bold text-gray-800">{user?.email || "Not Provided"}</p>
                </div>

                {/* Phone Number */}
                <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    <Phone size={14} />
                    <span>Phone Number</span>
                  </div>
                  <p className="text-base font-bold text-gray-800">{user?.phone || "+91 XXXXX XXXXX"}</p>
                </div>

                {/* Account Type / Role */}
                <div className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    <ShieldCheck size={14} />
                    <span>Membership Status</span>
                  </div>
                  <p className="text-base font-bold text-[#06A1B7]">Standard Customer</p>
                </div>

              </div>

              {/* Action Banner */}
              <div className="mt-8 p-5 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-cyan-100/50">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Need to update your details?</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Contact customer support to make structural edits to your profile.</p>
                </div>
                <button 
                  onClick={() => toast.success("Support chat coming soon!")}
                  className="bg-[#06A1B7] hover:bg-[#058a9d] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 shrink-0"
                >
                  Contact Support
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;