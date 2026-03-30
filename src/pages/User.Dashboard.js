'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Component/Header.js";

// 👉 COMPONENTS
import Orders from "../pages/User.History.js";
import Cart from "../pages/User.Cart.js";
import Profile from "../pages/User.Profile.js";

import {
  UserIcon,
  ShoppingBagIcon,
  ArrowRightOnRectangleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);  // ← user fetched from API

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/Userlogin";
  };

  /* ================= FETCH USER INFO ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/order/myorders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Assuming the API returns an array of orders, each having a `user` object
        if (res.data.length > 0) {
          const orderUser = res.data[0].user; // get user info from first order
          setUser(orderUser);
        }

      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchUser();
  }, []);
console.log(user)
  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">

        {/* ================= TOP BAR ================= */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col sm:flex-row justify-between items-center gap-4">

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {user?.firstName || "User"} 👋
              </h1>
              <p className="text-gray-500 text-sm">
                Manage your account, orders & cart
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>

          </div>
        </div>

        {/* ================= TAB NAV ================= */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex gap-3 flex-wrap">

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === "dashboard"
                  ? "bg-indigo-600 text-white"
                  : "bg-white shadow hover:bg-gray-100"
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === "orders"
                  ? "bg-indigo-600 text-white"
                  : "bg-white shadow hover:bg-gray-100"
              }`}
            >
              <ShoppingBagIcon className="w-5 h-5" />
              Orders
            </button>

            <button
              onClick={() => setActiveTab("cart")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === "cart"
                  ? "bg-green-600 text-white"
                  : "bg-white shadow hover:bg-gray-100"
              }`}
            >
              <ShoppingCartIcon className="w-5 h-5" />
              Cart
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === "profile"
                  ? "bg-purple-600 text-white"
                  : "bg-white shadow hover:bg-gray-100"
              }`}
            >
              <UserIcon className="w-5 h-5" />
              Profile
            </button>

          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="max-w-7xl mx-auto">

          {/* DASHBOARD HOME */}
          {activeTab === "dashboard" && (
            <div className="grid sm:grid-cols-3 gap-6">

              <div
                onClick={() => setActiveTab("orders")}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl cursor-pointer transition"
              >
                <ShoppingBagIcon className="w-10 h-10 text-indigo-600 mb-3" />
                <h3 className="font-semibold text-lg">My Orders</h3>
                <p className="text-sm text-gray-500">
                  Track & manage orders
                </p>
              </div>

              <div
                onClick={() => setActiveTab("cart")}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl cursor-pointer transition"
              >
                <ShoppingCartIcon className="w-10 h-10 text-green-600 mb-3" />
                <h3 className="font-semibold text-lg">My Cart</h3>
                <p className="text-sm text-gray-500">
                  View your cart items
                </p>
              </div>

              <div
                onClick={() => setActiveTab("profile")}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl cursor-pointer transition"
              >
                <UserIcon className="w-10 h-10 text-purple-600 mb-3" />
                <h3 className="font-semibold text-lg">Profile</h3>
                <p className="text-sm text-gray-500">
                  Manage your profile
                </p>
              </div>

            </div>
          )}

          {/* COMPONENTS */}
          {activeTab === "orders" && <Orders />}
          {activeTab === "cart" && <Cart />}
          {activeTab === "profile" && <Profile user={user} />} {/* pass user as prop */}

        </div>

      </div>
    </>
  );
}