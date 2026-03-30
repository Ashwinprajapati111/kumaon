'use client'

import { useState, useEffect } from 'react'
import axios from "axios"
import { FaTrash } from "react-icons/fa";
import { generateInvoice } from "../utils/generateInvoice";
import toast, { Toaster } from "react-hot-toast";

import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
} from '@headlessui/react'

import {
    XMarkIcon,
} from '@heroicons/react/24/outline'

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function OrdersPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    /* ================= FETCH MY ORDERS ================= */
    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const token = localStorage.getItem("token")
                const res = await axios.get(
                    "http://localhost:5000/api/orders/my",
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                setOrders(res.data || [])
            } catch (err) {
                console.log("ORDER ERROR", err)
            } finally {
                setLoading(false)
            }
        }
        fetchMyOrders()
    }, [])

    /* ================= DELETE ORDER ================= */
    const handleDeleteOrder = (orderId) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">Delete this order permanently?</p>
                <div className="flex gap-2 justify-end flex-wrap">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 text-sm bg-gray-200 rounded"
                    >Cancel</button>
                    <button
                        onClick={async () => {
                            try {
                                const token = localStorage.getItem("token");
                                const res = await axios.delete(
                                    `http://localhost:5000/api/orders/delete/${orderId}`,
                                    { headers: { Authorization: `Bearer ${token}` } }
                                );
                                toast.success(res.data.message || "Order deleted");
                                setOrders(prev => prev.filter(o => o._id !== orderId));
                            } catch (err) {
                                console.log(err);
                                toast.error(err.response?.data?.message || "Delete failed");
                            }
                            toast.dismiss(t.id);
                        }}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                    >Delete</button>
                </div>
            </div>
        ), { duration: 5000 });
    };

    /* ================= STEP LOGIC ================= */
    const getStep = (status) => {
        switch (status) {
            case "Pending": return 0;
            case "Confirmed": return 1;
            case "Shipped": return 2;
            case "Out for Delivery": return 3;
            case "Delivered": return 4;
            default: return 0;
        }
    }

    return (
        <>
            <Toaster position="top-right" />
            <div className="bg-gray-50 min-h-screen">

                {/* MOBILE MENU */}
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="relative z-40 lg:hidden">
                    <DialogBackdrop className="fixed inset-0 bg-black/25" />
                    <div className="fixed inset-0 z-40 flex">
                        <DialogPanel className="relative flex w-full max-w-xs flex-col bg-white pb-12 shadow-xl">
                            <div className="flex px-4 pt-5 pb-2 justify-end">
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400">
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                {/* ================= ORDERS ================= */}
                <main className="mx-auto max-w-7xl px-4 py-10">
                    <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

                    {loading && <p>Loading...</p>}
                    {!loading && orders.length === 0 && <p>No orders found</p>}

                    {orders.map((order) => {
                        const totalAmount = order.cart?.reduce(
                            (acc, item) => acc + item.price * item.quantity,
                            0
                        )
                        const step = getStep(order.orderStatus)
                        const isCancelled = order.orderStatus === "Cancelled"

                        return (
                            <div key={order._id} className="mb-10">

                                {/* HEADER */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                                    <h2 className="text-lg font-semibold">Order #{order._id}</h2>
                                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toDateString()}</p>
                                </div>

                                {/* PRODUCTS */}
                                <div className="space-y-6">
                                    {order.cart?.map((product, index) => (
                                        <div key={index} className="border bg-white rounded-xl shadow-sm overflow-hidden">
                                            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">

                                                {/* LEFT */}
                                                <div className="md:col-span-7 flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                                                    <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-lg" />
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-lg">{product.name}</h3>
                                                        <p className="text-gray-600 text-sm mt-1">Qty: {product.quantity}</p>
                                                        <p className="text-gray-900 font-medium mt-2">₹ {product.price}</p>
                                                        <p className="text-sm text-gray-500 mt-2">Total: ₹ {product.price * product.quantity}</p>
                                                    </div>
                                                </div>

                                                {/* RIGHT */}
                                                <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="font-medium">Delivery address</p>
                                                        <p className="text-gray-500 mt-2">
                                                            {order.customer?.firstName} {order.customer?.lastName}<br />
                                                            {order.customer?.address}<br />
                                                            {order.customer?.city}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Contact</p>
                                                        <p className="text-gray-500 mt-2">
                                                            {order.customer?.email}<br />
                                                            {order.customer?.phone}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>

                                            {/* STATUS */}
                                            <div className="border-t p-6">
                                                <p className={`font-medium ${isCancelled ? "text-red-600" : ""}`}>{order.orderStatus}</p>

                                                <div className="mt-4">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        {isCancelled ? (
                                                            <div className="bg-red-600 h-2 rounded-full w-full" />
                                                        ) : (
                                                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(step / 4) * 100}%` }} />
                                                        )}
                                                    </div>
                                                    <div className="grid grid-cols-5 text-xs mt-2 text-gray-600">
                                                        <span className={classNames(step >= 0 && !isCancelled && "text-indigo-600")}>Placed</span>
                                                        <span className={classNames(step >= 1 && !isCancelled && "text-indigo-600 text-center")}>Confirmed</span>
                                                        <span className={classNames(step >= 2 && !isCancelled && "text-indigo-600 text-center")}>Shipped</span>
                                                        <span className={classNames(step >= 3 && !isCancelled && "text-indigo-600 text-center")}>Out</span>
                                                        <span className={classNames(step >= 4 && !isCancelled && "text-indigo-600 text-right")}>Delivered</span>
                                                    </div>
                                                </div>

                                                {/* TOTAL */}
                                                <div className="mt-6 flex flex-col sm:flex-row justify-between font-semibold text-lg gap-2">
                                                    <span>Total</span>
                                                    <span>₹ {totalAmount}</span>
                                                </div>

                                                {/* ACTION BUTTONS */}
                                                <div className="flex gap-3 mt-4 flex-wrap">
                                                    <button
                                                        onClick={() => generateInvoice(order)}
                                                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                                                    >
                                                        📄 Download Invoice
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteOrder(order._id)}
                                                        className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200"
                                                    >
                                                        <FaTrash />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        )
                    })}
                </main>
            </div>
        </>
    )
}