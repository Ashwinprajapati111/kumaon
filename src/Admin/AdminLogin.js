import React, { useState } from "react";
import axios from "axios";
import logo from "../assetes/Logo.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post(
        "http://localhost:5000/admin_api/login", // 🔥 change to live URL when deploy
        { email, password }
      );

      const token = res.data.token;

      // ✅ Save token
      localStorage.setItem("token", token);

      setMsg("Login success ✅");

      // ✅ Redirect to admin dashboard
      setTimeout(() => {
        navigate("/admin");
      }, 1000);

    } catch (err) {
      console.error(err);

      // ✅ Better error handling
      if (err.response && err.response.data.message) {
        setMsg(err.response.data.message);
      } else {
        setMsg("Login failed ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.box}>
        
        {/* Logo */}
        <div style={styles.logoContainer}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to your admin panel</p>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {msg && (
          <p style={msg.includes("success") ? styles.success : styles.error}>
            {msg}
          </p>
        )}
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  box: {
    background: "#fff",
    padding: 40,
    borderRadius: 15,
    width: 350,
    display: "flex",
    flexDirection: "column",
    gap: 15,
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 5,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: "contain",
  },
  title: {
    margin: 0,
    fontSize: 26,
    fontWeight: 600,
    color: "#222",
  },
  subtitle: {
    margin: 0,
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  input: {
    padding: 12,
    fontSize: 15,
    borderRadius: 8,
    border: "1px solid #ddd",
    outline: "none",
    width: "100%",
  },
  btn: {
    padding: 12,
    background: "#bc8412",
    color: "#fff",
    fontWeight: 600,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    width: "100%",
  },
  success: {
    color: "green",
    textAlign: "center",
    marginTop: 10,
    fontWeight: 500,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    fontWeight: 500,
  },
};