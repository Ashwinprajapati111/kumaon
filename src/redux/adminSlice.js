import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin/users";

// Get all users (Admin)
export const fetchAllUsers = createAsyncThunk("admin/fetchAllUsers", async (_, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const token = auth.user.token;
    const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState: { users: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(fetchAllUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default adminSlice.reducer;