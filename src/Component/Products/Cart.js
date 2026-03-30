'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrashIcon } from "@heroicons/react/20/solid";
import { Dialog } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";
import Header from "../Header.js";
import Footer from "../Footer.js";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    type: "Home",
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const countryStateMap = {
    India: ["Gujarat", "Maharashtra", "Delhi"],
    USA: ["California", "Texas", "Florida"],
  };

  // Load cart
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Fetch user and addresses
  useEffect(() => {
    fetchUserAndAddresses();
  }, []);

  const fetchUserAndAddresses = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      toast.error("You must login first!");
      navigate("/login");
      return;
    }

    try {
      const userRes = await axios.get(`http://localhost:5000/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);
      setFormData(prev => ({ ...prev, email: userRes.data.email }));

      const addrRes = await axios.get("http://localhost:5000/user/address", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAddresses(addrRes.data);
      const defaultAddr = addrRes.data.find(a => a.isDefault) || addrRes.data[0];
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
        setFormData(prev => ({ ...prev, ...defaultAddr }));
      }

    } catch (err) {
      console.error("Fetch Error:", err.response || err.message);
      toast.error("Failed to fetch user or addresses");
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validatePincode = (pin) => /^[1-9][0-9]{5}$/.test(pin);

  const handleAddAddress = async () => {
    if (!validatePincode(formData.pincode)) {
      toast.error("Invalid PIN");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return toast.error("You must login first");

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/user/address", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Address added!");
      setAddModalOpen(false);
      fetchUserAndAddresses();
    } catch (err) {
      console.error(err.response || err.message);
      toast.error("Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  // CART LOGIC
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const updateCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };
  const increaseQty = (id) => updateCart(cart.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const decreaseQty = (id) => updateCart(cart.map(i => i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i));
  const removeItem = (id) => updateCart(cart.filter(i => i.id !== id));

  const handlePayment = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("Cart is empty");

    const token = localStorage.getItem("token");
    if (!token) return toast.error("You must login first");

    try {
      setLoading(true);

      const loadRazorpay = () =>
        new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });

      const isLoaded = await loadRazorpay();
      if (!isLoaded) return toast.error("Razorpay SDK failed to load");

      // Create order on backend
      const { data: order } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: total * 100 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "My Shop",
        description: "Order Payment",
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cart,
                customer: formData,
                subtotal,
                shipping: 0,
                tax: 0,
                total,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              toast.success("Payment Successful");
              localStorage.removeItem("cart");
              setCart([]);
              navigate(`/order-success/${response.razorpay_order_id}`);
            }

          } catch (err) {
            console.error(err.response || err.message);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: formData.firstName + " " + formData.lastName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error.response || error.message);
      toast.error("Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Toaster />
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-3 gap-10">

          {/* Checkout Form */}
          <form onSubmit={handlePayment} className="bg-white p-6 rounded-xl shadow lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Shipping Details</h2>

            <input type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="Email" className="w-full border p-3 rounded mb-4" required />

            <h3 className="text-lg font-medium mb-2">Select Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {addresses.length ? addresses.map(addr => (
                <div key={addr._id} className={`border p-4 rounded-lg cursor-pointer hover:shadow-md transition relative
                  ${selectedAddress?._id === addr._id ? "border-indigo-600 bg-indigo-50" : "border-gray-200 bg-white"}`}
                  onClick={() => { setSelectedAddress(addr); setFormData(prev => ({ ...prev, ...addr })) }}
                >
                  {addr.isDefault && <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">Default</span>}
                  <p className="font-medium">{addr.firstName} {addr.lastName}</p>
                  <p>{addr.address}</p>
                  <p>{addr.city}, {addr.state}, {addr.country} - {addr.pincode}</p>
                  <p>{addr.phone}</p>
                  <p className="text-sm text-gray-500">Type: {addr.type}</p>
                </div>
              )) : <p className="text-gray-500">No saved addresses</p>}
            </div>

            <button type="button" onClick={() => setAddModalOpen(true)}
              className="mb-6 bg-indigo-600 text-white px-4 py-2 rounded">+ Add New Address</button>

            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg text-lg font-medium">
              Pay ₹{total}
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <ul className="divide-y">
              {cart.map(item => (
                <li key={item.id} className="flex items-center py-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover" />
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-gray-500">₹{item.price}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button type="button" onClick={() => decreaseQty(item.id)} className="px-2 bg-gray-200 rounded">-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => increaseQty(item.id)} className="px-2 bg-gray-200 rounded">+</button>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeItem(item.id)} className="text-red-500 ml-2">
                    <TrashIcon className="w-5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between font-bold mt-2 text-lg"><span>Total</span><span>₹{total}</span></div>
            </div>
          </div>

        </div>
      </div>

      {/* Add Address Modal */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <div className="fixed inset-0 flex justify-center items-center bg-black/40">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Add New Address</h2>
            <div className="grid gap-3">
              <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="border p-2" />
              <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2" />
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="border p-2" />
              <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="border p-2" />
              <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="border p-2" />
              <select name="country" value={formData.country} onChange={handleChange} className="border p-2">
                <option value="">Select Country</option>
                {Object.keys(countryStateMap).map(c => <option key={c}>{c}</option>)}
              </select>
              <select name="state" value={formData.state} onChange={handleChange} className="border p-2">
                <option value="">Select State</option>
                {countryStateMap[formData.country]?.map(s => <option key={s}>{s}</option>)}
              </select>
              <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" className="border p-2" />
              <select name="type" value={formData.type} onChange={handleChange} className="border p-2">
                <option value="Home">Home</option>
                <option value="Work">Work</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setAddModalOpen(false)}>Cancel</button>
              <button onClick={handleAddAddress} className="bg-indigo-600 text-white px-3 py-1">{loading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      </Dialog>

      <Footer />
    </>
  );
}