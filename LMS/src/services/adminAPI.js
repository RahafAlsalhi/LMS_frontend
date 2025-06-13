// src/services/adminAPI.js - Cookie-based with axios
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class AdminAPIService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
      withCredentials: true, // CRITICAL: Enable cookies for all requests
    });

    // Add request interceptor (same as your authService)
    this.api.interceptors.request.use(
      (config) => {
        console.log(
          `🔧 Making ${config.method?.toUpperCase()} request to: ${config.url}`
        );
        console.log(`🍪 WithCredentials: ${config.withCredentials}`);

        // Support Bearer token if needed (same as your authService)
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling (same as your authService)
    this.api.interceptors.response.use(
      (response) => {
        console.log(
          `✅ Response from ${response.config.url}: ${response.status}`
        );
        return response;
      },
      async (error) => {
        console.log(
          `❌ Response error from ${error.config?.url}: ${error.response?.status}`
        );

        const originalRequest = error.config;

        // Handle token expiration (401) - same logic as your authService
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("/auth/refresh-token") &&
          !originalRequest.url?.includes("/auth/login") &&
          !originalRequest.url?.includes("/auth/register") &&
          !originalRequest.url?.includes("/auth/google")
        ) {
          originalRequest._retry = true;

          try {
            console.log("🔄 Attempting token refresh...");

            // Try to refresh token - this should work with cookies
            const refreshResponse = await this.api.post("/auth/refresh-token");

            if (refreshResponse.data.success) {
              console.log("✅ Token refresh successful");
              // Retry original request
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            console.log("❌ Token refresh failed:", refreshError.message);

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
  }

  // Generic API call method using axios
  async apiCall(endpoint, options = {}) {
    try {
      const response = await this.api({
        url: endpoint,
        ...options,
      });

      // Return the response data (axios wraps it in .data)
      return response.data;
    } catch (error) {
      console.error(`❌ API call failed for ${endpoint}:`, error);

      // Extract error message from axios error
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Request failed";

      throw new Error(errorMessage);
    }
  }

  // ========================================
  // USER MANAGEMENT APIs
  // ========================================

  async getAllUsers() {
    return this.apiCall("/users/get");
  }

  async createUser(userData) {
    return this.apiCall("/users/create", {
      method: "POST",
      data: userData,
    });
  }

  async updateUser(userId, userData) {
    return this.apiCall(`/users/edit/${userId}`, {
      method: "PUT",
      data: userData,
    });
  }

  async deleteUser(userId) {
    return this.apiCall(`/users/delete/${userId}`, {
      method: "DELETE",
    });
  }

  async getUserByEmail(email) {
    return this.apiCall(
      `/users/search/by-email?email=${encodeURIComponent(email)}`
    );
  }

  async getUserById(userId) {
    return this.apiCall(`/users/get/${userId}`);
  }

  // Note: This endpoint requires users to change their own password only
  // For admin password resets, use adminResetUserPassword instead
  async changeUserPassword(userId, passwordData) {
    return this.apiCall(`/users/edit/${userId}/password`, {
      method: "PUT",
      data: passwordData,
    });
  }

  // Admin can reset user password (requires backend endpoint: /users/admin/reset-password/:id)
  async adminResetUserPassword(userId, newPassword) {
    return this.apiCall(`/users/admin/reset-password/${userId}`, {
      method: "PUT",
      data: { newPassword },
    });
  }

  // ========================================
  // COURSE MANAGEMENT APIs
  // ========================================

  async getAllCourses() {
    return this.apiCall("/course/get");
  }

  async getCourseById(courseId) {
    return this.apiCall(`/course/get/${courseId}`);
  }

  async createCourse(courseData) {
    return this.apiCall("/courses/create", {
      method: "POST",
      data: courseData,
    });
  }

  async updateCourse(courseId, courseData) {
    return this.apiCall(`/courses/edit/${courseId}`, {
      method: "PUT",
      data: courseData,
    });
  }

  async deleteCourse(courseId) {
    return this.apiCall(`/courses/delete/${courseId}`, {
      method: "DELETE",
    });
  }

  async searchCourses(query) {
    return this.apiCall(`/courses/search?q=${encodeURIComponent(query)}`);
  }

  // ========================================
  // ADMIN-SPECIFIC COURSE ACTIONS
  // ========================================

  async approveCourse(courseId) {
    return this.updateCourse(courseId, {
      approval_status: "approved",
      approved_at: new Date().toISOString(),
    });
  }

  async rejectCourse(courseId) {
    return this.updateCourse(courseId, {
      approval_status: "rejected",
      approved_at: null,
    });
  }

  // ========================================
  // DASHBOARD DATA
  // ========================================

  async getDashboardData() {
    try {
      const [usersResult, coursesResult] = await Promise.all([
        this.getAllUsers(),
        this.getAllCourses(),
        this.apiCall("/category/get"),
      ]);

      if (usersResult.success && coursesResult.success) {
        const users = usersResult.data;
        const courses = coursesResult.data;
        const categories = categoriesResult.data;

        // Calculate statistics
        const stats = {
          totalUsers: users.length,
          students: users.filter((user) => user.role === "student").length,
          instructors: users.filter((user) => user.role === "instructor")
            .length,
          admins: users.filter((user) => user.role === "admin").length,
          totalCourses: courses.length,
          activeCourses: courses.filter(
            (course) =>
              course.approval_status === "approved" ||
              course.status === "active"
          ).length,
          pendingApprovals: courses.filter(
            (course) =>
              course.approval_status === "pending" || !course.approval_status
          ).length,
          totalCategories: categories.length,
        };

        return {
          success: true,
          data: {
            users: users.slice(0, 5), // Recent 5 users
            courses: courses
              .filter(
                (course) =>
                  course.approval_status === "pending" ||
                  !course.approval_status
              )
              .slice(0, 5), // Recent 5 pending courses
            stats,
            categories: categories.slice(0, 8),
            allUsers: users,
            allCategories: categories,
            allCourses: courses,
          },
        };
      } else {
        throw new Error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("💥 Dashboard data fetch error:", error);
      throw error;
    }
  }

  // ========================================
  // AUTHENTICATION & USER INFO
  // ========================================

  // Get current user from your auth API
  async getCurrentUser() {
    try {
      console.log("👤 Getting current user...");
      const response = await this.api.get("/auth/me");

      if (response.data.success) {
        return {
          success: true,
          user: response.data.user,
        };
      }

      throw new Error("Failed to get current user");
    } catch (error) {
      console.error("❌ Get current user error:", error);
      throw error;
    }
  }

  // Check if user is authenticated and is admin
  async isAdminAuthenticated() {
    try {
      // First check if we have user data in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.role === "admin") {
          return true;
        }
      }

      // If no stored user or not admin, check with server
      const result = await this.getCurrentUser();
      if (result.success && result.user && result.user.role === "admin") {
        // Store user data for future checks
        localStorage.setItem("user", JSON.stringify(result.user));
        return true;
      }

      return false;
    } catch (error) {
      console.error("❌ Admin auth check failed:", error);
      return false;
    }
  }

  // Logout user (using your auth service pattern)
  async logout() {
    try {
      console.log("🚪 Attempting logout...");

      const response = await this.api.get("/auth/logout");
      console.log("✅ Logout response:", response.data);

      // Clear local storage
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.warn("⚠️ Logout API call failed:", error.message);

      // Still clear local state
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      return { success: true, message: "Logged out locally" };
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  }

  // Format date
  formatDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Get role color for UI
  getRoleColor(role) {
    switch (role) {
      case "admin":
        return "error";
      case "instructor":
        return "primary";
      case "student":
      default:
        return "success";
    }
  }

  // Get status color for courses
  getStatusColor(status) {
    switch (status) {
      case "approved":
      case "active":
        return "success";
      case "rejected":
      case "inactive":
        return "error";
      case "pending":
      default:
        return "warning";
    }
  }

  // Test admin API connection
  async testAdminConnection() {
    try {
      console.log("🧪 Testing admin API connection...");

      const result = await this.getCurrentUser();

      console.log("✅ Admin API test result:", {
        success: result.success,
        userRole: result.user?.role,
        withCredentials: true,
      });

      return result;
    } catch (error) {
      console.error("❌ Admin API test failed:", error);
      throw error;
    }
  }
}

// Create and export singleton instance
const adminAPI = new AdminAPIService();
export default adminAPI;
