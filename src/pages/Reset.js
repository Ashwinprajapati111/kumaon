// src/pages/Reset.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { verifyOTP } from "../redux/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

export default function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { emailOrMobile } = location.state || {};

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const result = await dispatch(
        verifyOTP({ emailOrMobile, otp, newPassword })
      );

      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(result.payload?.message || "Failed to reset password");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-emerald-400 to-emerald-600 p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 relative overflow-hidden">
          
          

          <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
            Reset Password
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Enter the OTP sent to your email or mobile and set a new password
          </p>

          <form onSubmit={handleReset} className="space-y-6">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
            />

            <button
              type="submit"
              className="w-full py-3 bg-yellow-600 text-white font-semibold rounded-xl hover:bg-yellow-700 shadow-lg transition"
            >
              Reset Password
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Remembered your password?{" "}
            <span
              className="text-emerald-500 font-medium hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </>
  );
}