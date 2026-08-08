import React, { useState, useCallback } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { registerThunk } from "../../../slice/auth/authThunk";
import { getCartThunk } from "../../../slice/cart/cartThunk";

const Register = () => {
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = async (data) => {
    try {
      await dispatch(registerThunk(data)).unwrap();

      toast.success("Account created successfully!");
      dispatch(getCartThunk());
      
      // Hard reload guarantees the fresh cookie is picked up by the app immediately
      window.location.href = "/";
    } catch (error) {
      toast.error(error || "Registration Failed");
    }
  };

  const isButtonDisabled = isLoading || isSubmitting;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Create Account
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-2">
          Join CareNXT to access professional dental supplies & track orders.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Full Name Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <User size={18} />
            </span>
            <input
              type="text"
              autoComplete="name"
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              placeholder="Dr. John Doe"
              className={`w-full bg-gray-50/50 border ${
                errors.fullName ? "border-red-500" : "border-gray-200"
              } rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#06A1B7]/20 focus:border-[#06A1B7] outline-none transition-all duration-200`}
            />
          </div>
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1.5 font-medium" role="alert">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Mail size={18} />
            </span>
            <input
              type="email"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="name@example.com"
              className={`w-full bg-gray-50/50 border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#06A1B7]/20 focus:border-[#06A1B7] outline-none transition-all duration-200`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1.5 font-medium" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="••••••••"
              className={`w-full bg-gray-50/50 border ${
                errors.password ? "border-red-500" : "border-gray-200"
              } rounded-2xl pl-11 pr-12 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#06A1B7]/20 focus:border-[#06A1B7] outline-none transition-all duration-200`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1.5 font-medium" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isButtonDisabled}
          className="w-full mt-2 bg-[#06A1B7] hover:bg-[#058a9d] text-white rounded-2xl py-3.5 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.99] transition-all duration-200"
        >
          {isButtonDisabled ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating account...</span>
            </div>
          ) : (
            <>
              <span>Sign Up</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Footer Login Link */}
      <p className="text-center text-sm text-gray-500 mt-8">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="text-[#06A1B7] font-bold hover:underline inline-flex items-center gap-1"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;