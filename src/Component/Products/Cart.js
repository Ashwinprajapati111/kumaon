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
  const [selectedAddressId, setSelectedAddressId] = useState(null);

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

  const [newAddress, setNewAddress] = useState({
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
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [countryStateMap, setCountryStateMap] = useState({
    India: [],
  });
  const [priceData, setPriceData] = useState(null);
  const navigate = useNavigate();

  const fetchStates = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/price`);

      const data = res.data?.data?.[0];

      if (!data) return;

      // ✅ store full backend data (IMPORTANT)
      setPriceData(data);

      // ✅ extract states
      const states = data.stateCharges.map(item => item.state);

      setCountryStateMap({
        India: states,
      });

    } catch (error) {
      console.error("Failed to fetch states:", error);
      toast.error("Failed to load states");
    }
  };

  const getShippingCharge = () => {
    if (!priceData || !formData.state) return 0;

    const stateData = priceData.stateCharges?.find(
      s => s.state === formData.state
    );

    return stateData?.charge || 0;
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    fetchUserAndAddresses();
    fetchStates();
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
      const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userRes.data);

      setFormData(prev => ({
        ...prev,
        email: userRes.data.email || prev.email
      }));

      const addrRes = await axios.get(`${process.env.REACT_APP_API_URL}/user/address`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const addressList = addrRes.data || [];
      setAddresses(addressList);

      if (!selectedAddressId && addressList.length > 0) {
        const defaultAddr =
          addressList.find(a => a.isDefault) || addressList[0];

        setSelectedAddressId(defaultAddr._id);

        setFormData(prev => ({
          ...prev,
          ...defaultAddr
        }));
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
    if (!validatePincode(newAddress.pincode)) {
      toast.error("Invalid PIN");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      await axios.post(
        `${process.env.REACT_APP_API_URL}/user/address`,
        newAddress,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ IMPORTANT: Re-fetch full updated address list
      await fetchUserAndAddresses();

      // ✅ reset form
      setNewAddress({
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

      setAddModalOpen(false);
      toast.success("Address added");

    } catch (err) {
      console.error(err.response || err.message);
      toast.error("Failed to add address");
    } finally {
      setLoading(false);
    }
  };
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ Free shipping above ₹1000
  const shippingCharge =
    subtotal > 1000 ? 0 : getShippingCharge();

  // ✅ GST from backend
 const taxRate = priceData?.gst ? Number(priceData.gst) / 100 : 0;

  const taxAmount = subtotal * taxRate;

  const total = Math.round(subtotal + shippingCharge + taxAmount);

  const updateCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const increaseQty = (id) =>
    updateCart(cart.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));

  const decreaseQty = (id) =>
    updateCart(cart.map(i => i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i));

  const removeItem = (id) =>
    updateCart(cart.filter(i => i.id !== id));

  const handlePayment = async (e) => {
    e.preventDefault();

    if (cart.length === 0) return toast.error("Cart is empty");

    if (!selectedAddressId) {
      return toast.error("Please select address");
    }

    const token = localStorage.getItem("token");
    if (!token) return toast.error("You must login first");

    try {
      setLoading(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      await new Promise(resolve => {
        script.onload = resolve;
      });

      const { data: order } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payment/create-order`,
        { amount: total * 100 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "My Shop",
        handler: async function (response) {
          await axios.post(
            `${process.env.REACT_APP_API_URL}/api/payment/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cart,
              customer: formData,
              total,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          toast.success("Payment Successful");
          localStorage.removeItem("cart");
          setCart([]);
          navigate(`/order-success/${response.razorpay_order_id}`);
        },
      };

      new window.Razorpay(options).open();

    } catch (err) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };
  const handleSendOTP = async () => {
    if (!formData.email) return toast.error("Enter email first");

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/send-otp`, {
        email: formData.email,
      });

      setOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error("Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return toast.error("Enter OTP first");

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/verify-otp`, {
        email: formData.email.trim().toLowerCase(),
        otp: otp.toString().trim(),
      });

      if (res.data.success) {
        setEmailVerified(true);
        toast.success("Email verified");
      }
    } catch (err) {
      toast.error("Verification failed");
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

            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border p-3 rounded"
                required
              />

              {/* VERIFY BUTTON */}
              <button
                type="button"
                onClick={handleSendOTP}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Send OTP
              </button>

              {/* OTP INPUT */}
              {otpSent && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full border p-3 rounded mb-2"
                  />

                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Verify OTP
                  </button>
                </div>
              )}

              {/* VERIFIED MESSAGE */}
              {emailVerified && (
                <p className="text-green-600 mt-2">✅ Email Verified</p>
              )}
            </div>

            <h3 className="text-lg font-medium mb-2">Select Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {addresses.length ? addresses.map(addr => (
                <div key={addr._id} className={`border p-4 rounded-lg cursor-pointer hover:shadow-md transition relative
                  ${selectedAddressId === addr._id ? "border-indigo-600 bg-indigo-50" : "border-gray-200 bg-white"}`}
                  onClick={() => {
                    setSelectedAddressId(addr._id);

                    setFormData(prev => ({
                      ...prev,
                      firstName: addr.firstName || "",
                      lastName: addr.lastName || "",
                      phone: addr.phone || "",
                      address: addr.address || "",
                      city: addr.city || "",
                      state: addr.state || "",
                      country: addr.country || "",
                      pincode: addr.pincode || "",
                      type: addr.type || "Home",
                    }));
                  }}
                >
                  {addr.isDefault && <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">Default</span>}
                  <p className="font-medium">{addr.firstName} {addr.lastName}</p>
                  <p>{addr.address}</p>
                  <p>
                    {[addr.city, addr.state, addr.country]
                      .filter(Boolean)
                      .join(", ")}
                    {addr.pincode && ` - ${addr.pincode}`}
                  </p>
                  <p>{addr.phone}</p>
                  <p className="text-sm text-gray-500">Type: {addr.type}</p>
                </div>
              )) : <p className="text-gray-500">No saved addresses</p>}
            </div>

            <button type="button" onClick={() => setAddModalOpen(true)}
              className="mb-6 bg-indigo-600 text-white px-4 py-2 rounded">+ Add New Address</button>

            {/* PAY BUTTON */}
            <button
              type="submit"
              disabled={!emailVerified}
              className={`w-full mt-6 py-3 rounded-lg text-lg
                ${emailVerified
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-400 cursor-not-allowed"}
              `}
            >
              {emailVerified
                ? `Proceed to Pay ₹${total}`
                : "Verify Email to Continue"}
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

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax ({priceData?.gst ?? 0}%)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping <p>(free Shipping above ₹1000)</p></span>
                <span>{shippingCharge === 0 ? "Free" : `₹${shippingCharge}`}</span>
              </div>



              <div className="flex justify-between font-bold mt-2 text-lg border-t pt-2">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
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
              <input name="firstName" value={newAddress.firstName} onChange={(e) =>
                setNewAddress({ ...newAddress, firstName: e.target.value })
              } placeholder="First Name" className="border p-2" />
              <input name="lastName" value={newAddress.lastName} onChange={(e) =>
                setNewAddress({ ...newAddress, lastName: e.target.value })
              } placeholder="Last Name" className="border p-2" />
              <input name="phone" value={newAddress.phone} onChange={(e) =>
                setNewAddress({ ...newAddress, phone: e.target.value })
              } placeholder="Phone" className="border p-2" />
              <textarea name="address" value={newAddress.address} onChange={(e) =>
                setNewAddress({ ...newAddress, address: e.target.value })
              } placeholder="Address" className="border p-2" />
              <input name="city" value={newAddress.city} onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              } placeholder="City" className="border p-2" />
              <select name="country" value={newAddress.country} onChange={(e) =>
                setNewAddress({ ...newAddress, country: e.target.value })
              } className="border p-2">
                <option value="">Select Country</option>
                {Object.keys(countryStateMap).map(c => <option key={c}>{c}</option>)}
              </select>
              <select
                name="state"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
                className="border p-2"
              >
                <option value="">Select State</option>
                {countryStateMap[newAddress.country]?.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <input name="pincode" value={newAddress.pincode} onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              } placeholder="Pincode" className="border p-2" />
              <select name="type" value={newAddress.type} onChange={(e) =>
                setNewAddress({ ...newAddress, type: e.target.value })
              } className="border p-2">
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