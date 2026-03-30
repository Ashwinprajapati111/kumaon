import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminDashboard() {
    const [data, setData] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
    });

    const [loading, setLoading] = useState(true);

useEffect(() => {
  let isMounted = true;

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (isMounted) setData(res.data);
    } catch (error) {
      if (!isMounted) return;

      // ❌ REMOVE toast here OR keep minimal
      console.error("Dashboard error:", error);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchData();

  return () => {
    isMounted = false;
  };
}, []);

    /* ================= UI ================= */
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-lg font-semibold">
                Loading Dashboard...
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* TOTAL ORDERS */}
                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <h2 className="text-gray-500 text-sm">Total Orders</h2>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                        {data.totalOrders}
                    </p>
                </div>

                {/* TOTAL REVENUE */}
                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <h2 className="text-gray-500 text-sm">Revenue</h2>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                        ₹{data.totalRevenue}
                    </p>
                </div>

                {/* TOTAL USERS */}
                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <h2 className="text-gray-500 text-sm">Users</h2>
                    <p className="text-3xl font-bold text-purple-600 mt-2">
                        {data.totalUsers}
                    </p>
                </div>

            </div>
        </div>
    );
}