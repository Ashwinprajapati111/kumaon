import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Checkout() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submitOrder = (e) => {
    e.preventDefault();

    localStorage.setItem("customer", JSON.stringify(form));

    navigate("/payment");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">Customer Information</h1>

      <form onSubmit={submitOrder} className="space-y-4">

        <input
          name="name"
          placeholder="Full Name"
          className="w-full border p-3"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full border p-3"
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          className="w-full border p-3"
          onChange={handleChange}
          required
        />

        <textarea
          name="address"
          placeholder="Address"
          className="w-full border p-3"
          onChange={handleChange}
        />

        <input
          name="city"
          placeholder="City"
          className="w-full border p-3"
          onChange={handleChange}
        />

        <input
          name="pincode"
          placeholder="Pincode"
          className="w-full border p-3"
          onChange={handleChange}
        />

        <button
          className="bg-indigo-600 text-white px-6 py-3 rounded"
        >
          Continue to Payment
        </button>

      </form>

    </div>
  );
}