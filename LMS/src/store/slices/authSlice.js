import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("user"),
  loading: false,
  error: null,
};

// Login User with proper authService integration
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);

      if (response.success) {
        return response.data; // Returns { user }
      }
      throw new Error(response.message || "Login failed");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Register User with proper authService integration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);

      if (response.success) {
        return response.data; // Returns { user }
      }
      throw new Error(response.message || "Registration failed");
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

// Google Login - Updated to handle redirect-based flow
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (_, { rejectWithValue }) => {
    try {
      // This will redirect to Google OAuth, so we don't get an immediate response
      const response = await authService.googleLogin();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Google authentication error");
    }
  }
);

// Handle Google OAuth callback (for when user returns from Google)
export const handleGoogleCallback = createAsyncThunk(
  "auth/handleGoogleCallback",
  async (_, { rejectWithValue }) => {
    try {
      // Get user info after successful OAuth
      const response = await authService.getCurrentUser();

      if (response.success) {
        return response.data; // Returns { user }
      }
      throw new Error("Failed to get user after Google login");
    } catch (error) {
      return rejectWithValue(error.message || "Google callback error");
    }
  }
);

// Get Current User with proper authService integration
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();

      if (response.success) {
        return response.data; // Returns { user }
      }
      throw new Error(response.message || "Failed to get user");
    } catch (error) {
      return rejectWithValue(error.message || "Failed to get user");
    }
  }
);

// Logout User with proper authService integration
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      await authService.logout(); // This calls the backend and clears cookies
      dispatch(logout()); // Clear local state
      return { success: true };
    } catch (error) {
      console.log("Logout API call failed, but clearing local state");
      dispatch(logout()); // Still clear local state even if API fails
      return { success: true };
    }
  }
);

// Refresh Token thunk
export const refreshAuthToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();

      if (response.success) {
        return response.data; // Returns new { accessToken }
      }
      throw new Error("Token refresh failed");
    } catch (error) {
      return rejectWithValue(error.message || "Token refresh failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      sessionStorage.clear();
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        // Store user info in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("user");
      })

      // Register User cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("user");
      })

      // Google Login cases (redirect-based)
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state) => {
        // For redirect-based OAuth, we don't get user data immediately
        state.loading = false;
        // User data will be set when they return from Google
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle Google OAuth callback
      .addCase(handleGoogleCallback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleGoogleCallback.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(handleGoogleCallback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("user");
      })

      // Get Current User cases
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        localStorage.removeItem("user");
      })

      // Logout User cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        sessionStorage.clear();
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails, clear local state
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        sessionStorage.clear();
      })

      // Refresh Token cases
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        // Token is handled by HTTP-only cookies, just confirm it worked
        state.error = null;
        // Store new access token if provided
        if (action.payload.accessToken) {
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
      })
      .addCase(refreshAuthToken.rejected, (state) => {
        // If refresh fails, user needs to login again
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      });
  },
});

export const { clearError, logout, setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
