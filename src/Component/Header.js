'use client'
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaTrash, FaBell, FaUserCircle } from "react-icons/fa";
import Logo from '../Images/Logo.png';
import { Link } from "react-router-dom";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react';

import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

/* ================= NAV ================= */
const navigation = {
  pages: [
    { name: 'About Us', href: '/aboutus' },
    { name: 'Events', href: '/events-photo' },
    { name: 'Blogs', href: '/blog' },
    { name: 'Contact Us', href: '/contact' }
  ],
};

export default function Header() {

  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  /* ================= AUTH ================= */
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) return;

      const res = await fetch(`http://localhost:5000/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setUser(data);

    } catch (err) {
      console.error("Header user fetch error:", err);
    }
  };

  fetchUser();
}, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    toast.success("Logged out successfully");

    window.location.href = "/user-login";
  };

  /* ================= CART ================= */
  const removeFromCart = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);

    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);

    const total = updated.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);

    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Item removed 🗑️");
  };

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

    setCartCount(total);
    setCartItems(cart);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  return (
    <div className="bg-gray-50">
      <Toaster position="top-right" />

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b">
        <nav className="max-w-7xl mx-auto px-4 flex items-center h-16">

          {/* MOBILE MENU */}
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 text-gray-500">
            <Bars3Icon className="w-6 h-6" />
          </button>

          {/* LOGO */}
          <Link to="/" className="ml-3">
            <img src={Logo} className="h-10" alt="logo" />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex ml-10 gap-6">
            {navigation.pages.map((page) => (
              <Link key={page.name} to={page.href} className="text-sm text-gray-600 hover:text-black">
                {page.name}
              </Link>
            ))}
          </div>

          {/* RIGHT */}
          <div className="ml-auto flex items-center gap-4">

            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 cursor-pointer hover:text-black" />



            {/* 👤 AUTH */}
            {!user ? (
              <>
                <Link to="/user-login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            ) : (
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                {/* PROFILE */}
                <div className="cursor-pointer">
                  {user?.avatar ? (
                    <img src={user.avatar} className="w-8 h-8 rounded-full" />
                  ) : (
<div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold uppercase">
  {(user?.name || user?.name || "").charAt(0)}
  {(user?.lastName || "").charAt(0)}
</div>
                  )}
                </div>

                {/* DROPDOWN */}
                <div
                  className={`absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg transition-all duration-200 z-50
                  ${dropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
                >
                  <Link to="/user-dashboard" className="block px-4 py-2 hover:bg-gray-100">
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* 🛒 CART */}
            <div onClick={() => setCartOpen(true)} className="relative cursor-pointer">
              <ShoppingBagIcon className="w-6 h-6" />
              {cartCount
                > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 rounded-full">
                    {cartCount}
                  </span>
                )}
            </div>

          </div>
        </nav>
      </header>

      {/* ================= MOBILE MENU ================= */}
      <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="w-72 bg-white p-5">
            <div className="flex justify-between mb-5">
              <h2>Menu</h2>
              <button onClick={() => setOpen(false)}>✖</button>
            </div>

            <div className="flex flex-col gap-4">
              {navigation.pages.map((page) => (
                <Link key={page.name} to={page.href} onClick={() => setOpen(false)}>
                  {page.name}
                </Link>
              ))}

              <hr />

              {!user ? (
                <>
                  <Link to="/user-login" onClick={() => setOpen(false)}>Login</Link>
                  <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
                </>
              ) : (
                <>
                  <Link to="/user-dashboard" onClick={() => setOpen(false)}>Profile</Link>
                  <button onClick={handleLogout} className="text-left text-red-600">
                    Logout
                  </button>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* ================= CART ================= */}
      <Dialog open={cartOpen} onClose={setCartOpen} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/40" />

        <div className="fixed inset-0 flex justify-end">
          <DialogPanel className="w-full max-w-md bg-white flex flex-col">

            <div className="flex justify-between p-5 border-b">
              <h2>Shopping Cart</h2>
              <button onClick={() => setCartOpen(false)}>✖</button>
            </div>

            <div className="flex-1 p-5 space-y-4 overflow-y-auto">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-400">Cart empty</p>
              ) : (
                cartItems.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <img src={item.image} className="w-16 h-16 rounded" />
                    <div className="flex-1">
                      <p>{item.name}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>₹{item.price}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)}>
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-5 border-t">
                <Link
                  to="/Product/cart"
                  onClick={() => setCartOpen(false)}
                  className="block text-center bg-black text-white py-2 rounded"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}

          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}