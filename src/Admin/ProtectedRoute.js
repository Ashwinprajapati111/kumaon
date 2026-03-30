// src/Admin/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  try {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" replace />;
    return children;
  } catch (err) {
    console.error("ProtectedRoute error:", err);
    return <Navigate to="/login" replace />;
  }
}