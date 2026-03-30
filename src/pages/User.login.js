import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import Logo from "../assetes/Logo.png";
import Header from "../Component/Header.js";
import Footer from "../Component/Footer.js";
import Test from "../Component/Test.js";

export default function Userlogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const result = await dispatch(loginUser(formData));

  if (result.meta.requestStatus === "fulfilled") {
    const { token, user } = result.payload;

    // ✅ STORE THESE (THIS IS MISSING IN YOUR CODE)
    localStorage.setItem("token", token);
    localStorage.setItem("userId", user._id);

    const role = user.role || "user";

    navigate(
      role === "admin" ? "/adminDashboard" : "/userDashboard",
      { replace: true }
    );
  }
};

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    if (user && user.email) {
      const role = user.role || "user";

      navigate(
        role === "admin" ? "/adminDashboard" : "/userDashboard",
        { replace: true }
      );
    }
  }, [user, navigate]);

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-950 from-blue-100 via-white to-blue-200 px-4">

        <div className="w-full max-w-md bg-white backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-gray-200">

          {/* Title */}
          <div className="flex justify-center mb-4">
            <img
              src={Logo}
              alt="Logo"
              className="w-50 h-16 object-contain"
            />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Login to continue
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold transition duration-300 shadow-md ${loading
                ? "bg-gray-400"
                : "bg-yellow-600 hover:bg-yellow-700"
                }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Register */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-semibold"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
      <Test />
      <Footer />
    </>
  );
}