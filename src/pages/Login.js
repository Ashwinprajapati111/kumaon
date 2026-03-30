import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFail } from "../redux/authSlice";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading, error, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ✅ AUTO REDIRECT IF ALREADY LOGGED IN */
  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const res = await axios.post("http://localhost:5000/auth/login", formData);
      const { user, token } = res.data;

      // ✅ Save to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      // ✅ Update Redux
      dispatch(loginSuccess(user));

      // ✅ wait for redux update
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin-dashboard", { replace: true });
        } else {
          navigate("/user-dashboard", { replace: true });
        }
      }, 50);

    } catch (err) {
      dispatch(loginFail(err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${loading
            ? "bg-gray-400"
            : "bg-stone-950 hover:bg-stone-700"
            }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?
          <Link
            to="/register"
            className="text-stone-950 hover:underline ml-1"
          >
            Sign up
          </Link>
        </p>

        <p className="mt-1 text-center text-sm">
          <Link
            to="/forgot-password"
            className="text-green-600 hover:underline"
          >
            Forgot password?
          </Link>
        </p>
      </form>
    </div>
  );
}