// src/pages/Forgot.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sendOTP } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

export default function ForgotPassword() {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();

    // ✅ normalize input (important fix)
    const email = emailOrMobile.trim().toLowerCase();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      const result = await dispatch(sendOTP({ email }));

      if (result.meta.requestStatus === "fulfilled") {
        toast.success(result.payload.message || "OTP sent successfully!");

        // ✅ send correct key forward
        navigate("/reset-password", {
          state: { email: emailOrMobile.trim().toLowerCase() },
        });

      } else {
        toast.error(result.payload?.message || "Failed to send OTP");
      }

    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-emerald-400 to-emerald-600 p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 relative overflow-hidden">
          {/* Optional decorative circles */}
          <div className="absolute -top-16 -left-16 w-40 h-40 bg-yellow-400 rounded-full opacity-30"></div>
          <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-pink-400 rounded-full opacity-30"></div>

          <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
            Forgot Password
          </h2>

          <p className="text-center text-gray-500 mb-8">
            Enter your email or mobile number to receive an OTP
          </p>

          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Email"
                value={emailOrMobile}
                onChange={(e) => setEmailOrMobile(e.target.value)}
                required
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 shadow-lg transition"
            >
              Send OTP
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