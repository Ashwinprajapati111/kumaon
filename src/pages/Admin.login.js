// src/Admin/AdminLogin.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import Logo from "../assetes/Logo.png";
import { Link } from "react-router-dom"

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser({ email, password }));

    if (result.meta.requestStatus === "fulfilled") {
      const role = result?.payload?.user?.role;

      if (role !== "admin") {
        alert("You are not an admin!");

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        navigate("/user-login", { replace: true }); // ✅ fixed
        return;
      }

      navigate("/admin/dashboard", { replace: true }); // ✅ fixed
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Title */}
        <div className="flex justify-center mb-4">
          <Link to="/">
            <img
              src={Logo}
              alt="Logo"
              className="w-50 h-16 object-contain"

            />
          </Link>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold transition duration-300 shadow-md bg-yellow-600 hover:bg-yellow-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}