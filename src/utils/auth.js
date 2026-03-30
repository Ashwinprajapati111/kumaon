import { jwtDecode } from "jwt-decode";

// ✅ check login safely
export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) return false;

    const decoded = jwtDecode(token);

    // ✅ check expiry
    if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
      logout();
      return false;
    }

    return true;

  } catch (error) {
    console.error("Auth error:", error);
    logout(); // invalid token
    return false;
  }
};

// ✅ get role safely
export const getRole = () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) return null;

    const decoded = jwtDecode(token);

    return decoded.role || null;

  } catch (error) {
    console.error("Role error:", error);
    return null;
  }
};

// ✅ logout (FIXED)
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // 🔥 IMPORTANT

  window.location.href = "/Login"; // ✅ match your route
};