import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// Get user info
export const fetchUser = createAsyncThunk("user/fetchUser", async (id, { rejectWithValue, getState }) => {
  try {
    const { auth } = getState();
    const token = auth.user.token;
    const res = await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => { state.loading = true; })
      .addCase(fetchUser.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default userSlice.reducer;