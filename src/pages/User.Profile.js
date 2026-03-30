'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Dialog } from "@headlessui/react";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null); // ✅ NEW
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    type: "Home",
    isDefault: false,
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const authHeader = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  const validatePincode = (pin) => /^[1-9][0-9]{5}$/.test(pin);

  // ================= FETCH =================
  useEffect(() => {
    const init = async () => {
      if (!token) {
        toast.error("Please login");
        setLoadingUser(false);
        return;
      }
      await fetchUser();
      await fetchAddresses();
    };
    init();
  }, []);

  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      const res = await axios.get("http://localhost:5000/user/me", authHeader);
      setUser(res.data);
    } catch (err) {
      toast.error("Failed to fetch user");
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/address", authHeader);
      setAddresses(res.data);

      // ✅ Load selected or default
      const saved = localStorage.getItem("selectedAddressId");

      if (saved) {
        setSelectedAddressId(saved);
      } else {
        const defaultAddr = res.data.find(a => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
          localStorage.setItem("selectedAddressId", defaultAddr._id);
        }
      }

    } catch (err) {
      toast.error("Failed to load addresses");
    }
  };

  // ================= SELECT ADDRESS =================
  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr._id);
    localStorage.setItem("selectedAddressId", addr._id);
    localStorage.setItem("selectedAddress", JSON.stringify(addr));

    toast.success("Address selected ✅");
  };

  // ================= ADD ADDRESS =================
  const handleAddAddress = async () => {
    if (!validatePincode(formData.pincode)) {
      toast.error("Invalid PIN ❌");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/user/address", formData, authHeader);
      toast.success("Address added ✅");

      setOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        type: "Home",
        isDefault: false,
      });

      fetchAddresses();

    } catch (err) {
      toast.error("Failed to add address ❌");
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/user/address/${id}`, authHeader);
      toast.success("Deleted");
      fetchAddresses();
    } catch {
      toast.error("Delete failed");
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      await axios.put(`http://localhost:5000/user/address/default/${id}`, {}, authHeader);
      toast.success("Default updated");
      fetchAddresses();
    } catch {
      toast.error("Failed");
    }
  };

  if (loadingUser) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Toaster />

      {/* PROFILE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">My Profile</h2>
          <button
            onClick={() => setOpen(true)}
            className="bg-indigo-600 text-white px-3 py-1 rounded"
          >
            + Add Address
          </button>
        </div>

        <p><b>Name:</b> {user?.name}</p>
        <p><b>Email:</b> {user?.email}</p>

        <hr className="my-4" />

        {/* ================= ADDRESS LIST ================= */}
        <h3 className="font-semibold mb-3">Select Address</h3>

        <div className="grid md:grid-cols-2 gap-4">

          {addresses.map((addr) => {

            const isSelected = selectedAddressId === addr._id;

            return (
              <div
                key={addr._id}
                onClick={() => handleSelectAddress(addr)}
                className={`cursor-pointer border rounded-xl p-4 transition-all
                ${isSelected ? "border-blue-600 bg-blue-50 shadow-md" : "border-gray-200"}
                ${addr.isDefault ? "ring-2 ring-green-400" : ""}
                `}
              >

                {/* TOP */}
                <div className="flex justify-between">
                  <p className="font-semibold">
                    {addr.firstName} {addr.lastName}
                  </p>

                  {addr.isDefault && (
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>

                <p className="text-sm mt-1">{addr.address}</p>
                <p className="text-sm">
                  {addr.city}, {addr.state}, {addr.country} - {addr.pincode}
                </p>
                <p className="text-sm">{addr.phone}</p>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-3 text-sm">
                  {!addr.isDefault && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDefaultAddress(addr._id);
                      }}
                      className="text-blue-600"
                    >
                      Make Default
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAddress(addr._id);
                    }}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="fixed inset-0 flex justify-center items-center bg-black/40">
          <div className="bg-white p-6 rounded w-full max-w-lg">

            <h2 className="text-lg font-bold mb-4">Add Address</h2>

            <div className="grid gap-3">
              <input name="firstName" value={formData.firstName} onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})} placeholder="First Name" className="border p-2" />
              <input name="lastName" value={formData.lastName} onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})} placeholder="Last Name" className="border p-2" />
              <input name="phone" value={formData.phone} onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})} placeholder="Phone" className="border p-2" />
              <textarea name="address" value={formData.address} onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})} placeholder="Address" className="border p-2" />
              <input name="city" value={formData.city} onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})} placeholder="City" className="border p-2" />
              <input name="state" value={formData.state} onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})} placeholder="State" className="border p-2" />
              <input name="country" value={formData.country} onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})} placeholder="Country" className="border p-2" />
              <input name="pincode" value={formData.pincode} onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})} placeholder="Pincode" className="border p-2" />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                />
                Set as default
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button
                onClick={handleAddAddress}
                className="bg-indigo-600 text-white px-3 py-1"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>

          </div>
        </div>
      </Dialog>
    </div>
  );
}