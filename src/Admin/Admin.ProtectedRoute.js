import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Example: get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Check if user exists and has admin role
  if (!user || user.role !== "admin") {
    // Redirect to login if not admin
    return <Navigate to="/Admin/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;