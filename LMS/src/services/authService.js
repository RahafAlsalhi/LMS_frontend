import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true, // CRITICAL: Enable cookies for all requests
});

// Request interceptor to add auth header if needed
api.interceptors.request.use(
  (config) => {
    console.log(
      ` Making ${config.method?.toUpperCase()} request to: ${config.url}`
    );
    console.log(` WithCredentials: ${config.withCredentials}`);

    // The backend uses cookies, but we can also support Bearer token if needed
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}: ${response.status}`);
    return response;
  },
  async (error) => {
    console.log(
      `Response error from ${error.config?.url}: ${error.response?.status}`
    );

    const originalRequest = error.config;

    // Handle token expiration (401) but ONLY for protected routes
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token") &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register") &&
      !originalRequest.url?.includes("/auth/google") // Don't retry OAuth endpoints
    ) {
      originalRequest._retry = true;

      try {
        console.log(" Attempting token refresh...");

        // Try to refresh token - this should work with cookies
        const refreshResponse = await api.post("/auth/refresh-token");

        if (refreshResponse.data.success) {
          console.log(" Token refresh successful");
          // Retry original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.log(" Token refresh failed:", refreshError.message);

        // Refresh failed, clear local state and redirect to login
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");

        // Don't redirect if we're already on login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const authService = {
  // Login with email and password
  login: async (credentials) => {
    try {
      console.log(" Attempting login with credentials:", {
        email: credentials.email,
        password: credentials.password ? "***masked***" : "undefined",
        passwordLength: credentials.password?.length,
      });

      const response = await api.post("/auth/login", credentials);

      console.log(" Login response:", response.data);

      if (response.data.success) {
        return {
          success: true,
          data: {
            user: response.data.user,
          },
          message: response.data.message,
        };
      }

      throw new Error(response.data.message || "Login failed");
    } catch (error) {
      console.error(" Login error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed";
      throw new Error(errorMessage);
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      console.log(" Attempting registration for:", userData.email);

      const response = await api.post("/auth/register", userData);

      console.log(" Registration response:", response.data);

      if (response.data.success) {
        return {
          success: true,
          data: {
            user: response.data.user,
          },
          message: response.data.message,
        };
      }

      throw new Error(response.data.message || "Registration failed");
    } catch (error) {
      console.error("Registration error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed";
      throw new Error(errorMessage);
    }
  },

  // Google OAuth login - redirect to backend
  googleLogin: async () => {
    try {
      console.log(" Redirecting to Google OAuth...");

      // Redirect to your backend's Google OAuth endpoint
      window.location.href = `${API_URL}/auth/google`;

      return { success: true };
    } catch (error) {
      console.error("🔍 Google login error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Google login failed";
      throw new Error(errorMessage);
    }
  },

  // Logout user
  logout: async () => {
    try {
      console.log("Attempting logout...");

      const response = await api.get("/auth/logout");

      console.log(" Logout response:", response.data);

      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.warn(" Logout API call failed:", error.message);
      // Still return success since we'll clear local state anyway
      return { success: true, message: "Logged out locally" };
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      console.log("Getting current user...");

      const response = await api.get("/auth/me");

      console.log(" Current user response:", response.data);

      if (response.data.success) {
        return {
          success: true,
          data: {
            user: response.data.user,
          },
        };
      }

      throw new Error(response.data.message || "Failed to get user");
    } catch (error) {
      console.error(" Get current user error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to get user information";
      throw new Error(errorMessage);
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      console.log(" Refreshing token...");

      const response = await api.post("/auth/refresh-token");

      console.log(" Refresh token response:", response.data);

      if (response.data.success) {
        return {
          success: true,
          data: {
            accessToken: response.data.data?.accessToken,
            user: response.data.data?.user, // Include user if returned
          },
        };
      }

      throw new Error("Token refresh failed");
    } catch (error) {
      console.error(" Refresh token error:", error);
      throw new Error(error.response?.data?.message || "Token refresh failed");
    }
  },

  // Test endpoint to check if cookies are working
  testCookies: async () => {
    try {
      console.log(" Testing cookie configuration...");

      const response = await api.get("/auth/me");

      console.log(" Cookie test result:", {
        status: response.status,
        success: response.data.success,
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error(" Cookie test failed:", error);
      throw error;
    }
  },
};

export default authService;
