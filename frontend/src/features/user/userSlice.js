import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ================== Async Thunks ==================

// Register User
export const register = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/v1/register", formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// Login User
export const login = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/v1/login", credentials, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Load User
export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/profile", {
        withCredentials: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Load user failed");
    }
  }
);

// Logout User
export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/v1/logout", {}, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put("/api/v1/profile/update", formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }); 
       return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Profile update failed" });
    }
  }
);

// ================== Slice ==================
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: true,
    error: null,
    success: false,
    isAuthenticated: false,
    message: null,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== Register =====
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
        state.success = false;
      })

      // ===== Login =====
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.success = false;
      })

      // ===== Load User =====
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.isAuthenticated = Boolean(action.payload?.user);
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Load user failed";
        state.isAuthenticated = false;
        state.user = null;
      })

      // ===== Logout =====
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });

      // ===== Update Profile =====
      builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload?.user || null;
        state.success = action.payload?.success ;
        state.message = action.payload?.message ;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Profile update failed";
        state.success = false;
      });
  },
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;
