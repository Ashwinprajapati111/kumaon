import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../utils/auth";

export default function AdminRoute({ children }) {

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (getRole() !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}