import React, { useState, useCallback, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { loginThunk } from "../../../slice/auth/authThunk";
import { getCartThunk } from "../../../slice/cart/cartThunk";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  // Watch the user state directly from Redux
  const { user, isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // 🚀 REACTIVE ROUTING: Automatically triggers the exact millisecond Redux gets the user
  useEffect(() => {
    if (user) {
      const userEmail = user.email?.toLowerCase().trim() || "";
      const masterAdminEmail = "darpan@gmail.com";

      if (userEmail === masterAdminEmail) {
        localStorage.setItem("isMasterAdmin", "true");
        navigate("/admin", { replace: true });
      } else {
        localStorage.removeItem("isMasterAdmin");
        navigate(redirectTo, { replace: true });
      }
    }
  }, [user, navigate, redirectTo]);

  const onSubmit = async (formData) => {
    try {
      const inputEmail = formData.email?.toLowerCase().trim();
      const masterAdminEmail = "darpan@gmail.com";

      if (inputEmail === masterAdminEmail) {
        localStorage.setItem("isMasterAdmin", "true");
      }

      // Just dispatch the login thunk. The useEffect above handles the navigation seamlessly!
      await dispatch(loginThunk(formData)).unwrap();

      toast.success("Welcome Back!");
      dispatch(getCartThunk());
    } catch (error) {
      console.error("LOGIN THUNK ERROR:", error);
      localStorage.removeItem("isMasterAdmin");
      toast.error(error || "Login Failed. Please check your credentials.");
    }
  };

  const onError = (errors) => {
    console.log("Form Validation Errors:", errors);
  };

  const isButtonDisabled = isLoading || isSubmitting;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-2">
          Enter your credentials to access your account & continue shopping.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5" noValidate>
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
              autoComplete="current-password"
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
              <span>Logging in...</span>
            </div>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Footer Register Link */}
      <p className="text-center text-sm text-gray-500 mt-8">
        Don't have an account yet?{" "}
        <Link
          to="/auth/register"
          className="text-[#06A1B7] font-bold hover:underline inline-flex items-center gap-1"
        >
          Create account
        </Link>
      </p>
    </div>
  );
};

export default Login;