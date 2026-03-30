import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ role, children }) {
  const { user } = useSelector((state) => state.auth);

  // ✅ fallback to localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = user || storedUser;

  if (!currentUser) {
    return <Navigate to="/user-login" replace />;
  }

  if (role && currentUser.role !== role) {
    return (
      <Navigate
        to={currentUser.role === "admin" ? "/admin-dashboard" : "/user-dashboard"}
        replace
      />
    );
  }

  return children;
}