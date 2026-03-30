'use client'

import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function UserCart() {
  const [cartItems, setCartItems] = useState([]);

  /* ================= LOAD CART ================= */
  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  };

  useEffect(() => {
    loadCart();

    // 🔁 Sync with Header
    window.addEventListener("cartUpdated", loadCart);
    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  /* ================= REMOVE ITEM ================= */
  const removeFromCart = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  /* ================= TOTAL ================= */
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-4 sm:p-6">

        <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">My Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4">

              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border-b pb-4"
                >
                  <img
                    src={item.image}
                    className="w-full sm:w-24 h-24 object-cover rounded"
                  />

                  <div className="flex-1 w-full sm:w-auto">
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    <p className="text-sm mt-1">₹ {item.price}</p>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0">
                    <p className="font-semibold">₹ {item.price * item.quantity}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 mt-2 sm:mt-2 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}

            </div>

            {/* TOTAL */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
              <h2 className="text-lg font-semibold">Total</h2>
              <h2 className="text-xl font-bold">₹ {totalAmount}</h2>
            </div>

            {/* CHECKOUT */}
            <Link to="/Product/cart">
              <button className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
                Proceed to Checkout
              </button>
            </Link>
          </>
        )}

      </div>
    </div>
  );
}