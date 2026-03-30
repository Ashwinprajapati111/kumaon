import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/auth";

// ================= REGISTER =================
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/register`, userData);
      toast.success("Registered successfully!", { duration: 3000 });
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Registration failed";
      toast.error(message, { duration: 3000 });
      return rejectWithValue({ message });
    }
  }
);

// ================= LOGIN =================
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/login`, credentials);

      // ✅ Save token and user to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!", { duration: 3000 });

      return { user: res.data.user, token: res.data.token };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      toast.error(message, { duration: 3000 });
      return rejectWithValue({ message });
    }
  }
);

// ================= OTP =================
export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async ({ emailOrMobile }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/send-otp`, { emailOrMobile });
      toast.success(res.data.message || "OTP sent successfully!", { duration: 3000 });
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to send OTP";
      toast.error(message, { duration: 3000 });
      return rejectWithValue({ message });
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ emailOrMobile, otp, newPassword }, { rejectWithValue }) => {
    try {
      const payload = emailOrMobile.includes("@")
        ? { email: emailOrMobile, otp, newPassword }
        : { mobile: emailOrMobile, otp, newPassword };

      const res = await axios.post(`${API_URL}/verify-otp`, payload);
      toast.success(res.data.message || "Password reset successful!", { duration: 3000 });
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "OTP verification failed";
      toast.error(message, { duration: 3000 });
      return rejectWithValue({ message });
    }
  }
);

// ================= INITIAL STATE =================
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

// ================= SLICE =================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      toast.success("Logged out successfully!", { duration: 3000 });
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // OTP
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;