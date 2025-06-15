// src/services/adminAPI.js - Fixed version
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
      withCredentials: true,
    });

    // Add request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(
          `Making ${config.method?.toUpperCase()} request to: ${config.url}`
        );
        console.log(` WithCredentials: ${config.withCredentials}`);

        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => {
        console.log(
          `✅ Response from ${response.config.url}: ${response.status}`
        );
        return response;
      },
      async (error) => {
        console.log(
          ` Response error from ${error.config?.url}: ${error.response?.status}`
        );

        const originalRequest = error.config;

        // Handle token expiration (401)
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
            console.log("Attempting token refresh...");

            // Try to refresh token - this should work with cookies
            const refreshResponse = await this.api.post("/auth/refresh-token");

            if (refreshResponse.data.success) {
              console.log(" Token refresh successful");
              // Retry original request
              return this.api(originalRequest);
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
      console.error(` API call failed for ${endpoint}:`, error);

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
  // USER APIs
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

  // ========================================
  // COURSE APIs - FIXED
  // ========================================

  // ❌ OLD: Get all courses (public) - only published courses
  async getAllCoursesPublic(filters = {}) {
    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append("keyword", filters.search);
    if (filters.page) queryParams.append("page", filters.page);
    if (filters.limit) queryParams.append("limit", filters.limit);

    const query = queryParams.toString();
    return this.apiCall(`/course/get${query ? `?${query}` : ""}`);
  }

  // ✅ FIXED: Get all courses for admin - includes ALL courses (pending + approved)
  async getAllCourses(filters = {}) {
    console.log("🔍 AdminAPI: Getting ALL courses for admin...");

    const queryParams = new URLSearchParams();
    if (filters.search) queryParams.append("keyword", filters.search);
    if (filters.page) queryParams.append("page", filters.page);
    if (filters.limit) queryParams.append("limit", filters.limit);

    const query = queryParams.toString();
    const result = await this.apiCall(
      `/course/admin/all${query ? `?${query}` : ""}`
    );

    console.log("🔍 AdminAPI: Received courses:", result.data?.length);
    console.log("🔍 AdminAPI: Status breakdown:", {
      pending: result.data?.filter((c) => c.is_approved === false).length,
      approved: result.data?.filter((c) => c.is_approved === true).length,
    });

    return result;
  }

  // Keep the old method name for backward compatibility
  async getAllCoursesAdmin(filters = {}) {
    return this.getAllCourses(filters);
  }

  // Get instructor's courses
  async getInstructorCourses(instructorId = null) {
    // For now, use getAllCourses and filter on frontend
    // Later you can add GET /api/course/instructor/my to your backend
    return this.getAllCourses();
  }

  // Create course - matches POST /api/course/create
  async createCourse(courseData) {
    console.log("🔍 AdminAPI: Creating course:", courseData);

    const result = await this.apiCall("/course/create", {
      method: "POST",
      data: {
        title: courseData.title,
        description: courseData.description,
        thumbnail_url: courseData.thumbnail_url || null,
        instructor_id: courseData.instructor_id,
        category_id: courseData.category_id,
      },
    });

    console.log("🔍 AdminAPI: Course created:", result);
    return result;
  }

  // Update course - matches PUT /api/course/edit/:id
  async updateCourse(courseId, courseData) {
    return this.apiCall(`/course/edit/${courseId}`, {
      method: "PUT",
      data: {
        id: courseId,
        title: courseData.title,
        description: courseData.description,
        thumbnail_url: courseData.thumbnail_url,
        category_id: courseData.category_id,
      },
    });
  }

  // Delete course - matches DELETE /api/course/delete/:id
  async deleteCourse(courseId) {
    return this.apiCall(`/course/delete/${courseId}`, {
      method: "DELETE",
    });
  }

  // Get pending courses - matches GET /api/course/pending
  async getPendingCourses() {
    console.log("🔍 AdminAPI: Getting pending courses...");

    const result = await this.apiCall("/course/pending");

    console.log("🔍 AdminAPI: Pending courses:", result.data?.length);
    return result;
  }

  // Approve course - matches PATCH /api/course/:id/approve
  async approveCourse(courseId) {
    console.log("🔍 AdminAPI: Approving course:", courseId);

    const result = await this.apiCall(`/course/${courseId}/approve`, {
      method: "PATCH",
    });

    console.log("🔍 AdminAPI: Approval result:", result);
    return result;
  }

  // Reject course - matches PATCH /api/course/:id/reject
  async rejectCourse(courseId) {
    console.log("🔍 AdminAPI: Rejecting course:", courseId);

    const result = await this.apiCall(`/course/${courseId}/reject`, {
      method: "PATCH",
    });

    console.log("🔍 AdminAPI: Rejection result:", result);
    return result;
  }

  // Search courses - matches GET /api/course/search
  async searchCourses(query, filters = {}) {
    const params = new URLSearchParams({ keyword: query });
    return this.apiCall(`/course/search?${params.toString()}`);
  }

  // Get course by ID - matches GET /api/course/get/:id
  async getCourseById(courseId) {
    return this.apiCall(`/course/get/${courseId}`);
  }

  // ========================================
  // MODULE APIs
  // ========================================

  async getModulesByCourse(courseId) {
    return this.apiCall(`/module/course/${courseId}`);
  }

  async createModule(moduleData) {
    return this.apiCall("/module/create", {
      method: "POST",
      data: moduleData,
    });
  }

  // ========================================
  // DASHBOARD DATA - UPDATED
  // ========================================

  async getDashboardData() {
    try {
      console.log("📊 Fetching dashboard data...");

      // ✅ FIXED: Use getAllCourses (admin endpoint) instead of getAllCoursesPublic
      const [
        usersResult,
        coursesResult,
        categoriesResult,
        pendingCoursesResult,
      ] = await Promise.all([
        this.getAllUsers(),
        this.getAllCourses(), // ✅ Now gets ALL courses, not just published
        this.apiCall("/category/get"),
        this.getPendingCourses(),
      ]);

      console.log("Raw API Results:", {
        usersResult,
        coursesResult,
        categoriesResult,
        pendingCoursesResult,
      });

      if (
        usersResult.success &&
        coursesResult.success &&
        categoriesResult.success &&
        pendingCoursesResult.success
      ) {
        const users = Array.isArray(usersResult.data) ? usersResult.data : [];
        const courses = Array.isArray(coursesResult.data)
          ? coursesResult.data
          : [];
        const categories = Array.isArray(categoriesResult.data)
          ? categoriesResult.data
          : [];
        const pendingCourses = Array.isArray(pendingCoursesResult.data)
          ? pendingCoursesResult.data
          : [];

        // ✅ FIXED: Calculate statistics using is_approved field
        const stats = {
          // User statistics
          totalUsers: users.length,
          students: users.filter(
            (user) => user.role === "student" || user.role === "STUDENT"
          ).length,
          instructors: users.filter(
            (user) => user.role === "instructor" || user.role === "INSTRUCTOR"
          ).length,
          admins: users.filter(
            (user) => user.role === "admin" || user.role === "ADMIN"
          ).length,

          // Course statistics - FIXED
          totalCourses: courses.length,
          activeCourses: courses.filter((course) => course.is_approved === true)
            .length,
          pendingApprovals: courses.filter(
            (course) => course.is_approved === false
          ).length,
          rejectedCourses: courses.filter(
            (course) =>
              course.is_approved === false && course.is_published === false
          ).length,

          // Category statistics
          totalCategories: categories.length,
          activeCategories: categories.filter(
            (cat) => cat.is_active !== false && cat.status !== "inactive"
          ).length,

          // Additional useful stats
          recentUsers: users.filter((user) => {
            const userDate = new Date(
              user.created_at || user.createdAt || user.registration_date
            );
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return userDate >= weekAgo;
          }).length,

          recentCourses: courses.filter((course) => {
            const courseDate = new Date(course.created_at || course.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return courseDate >= weekAgo;
          }).length,
        };

        console.log("📈 Calculated stats:", stats);

        // Get recent users (last 10, sorted by creation date)
        const recentUsers = users
          .sort((a, b) => {
            const dateA = new Date(
              a.created_at || a.createdAt || a.registration_date
            );
            const dateB = new Date(
              b.created_at || b.createdAt || b.registration_date
            );
            return dateB - dateA;
          })
          .slice(0, 10);

        // Get recent courses (last 10, sorted by creation date)
        const recentCourses = courses
          .sort((a, b) => {
            const dateA = new Date(a.created_at || a.createdAt);
            const dateB = new Date(b.created_at || b.createdAt);
            return dateB - dateA;
          })
          .slice(0, 10);

        // Get recent categories (last 8, sorted by creation date)
        const recentCategories = categories
          .sort((a, b) => {
            const dateA = new Date(
              a.created_at || a.createdAt || a.creation_date
            );
            const dateB = new Date(
              b.created_at || b.createdAt || b.creation_date
            );
            return dateB - dateA;
          })
          .slice(0, 8);

        return {
          success: true,
          data: {
            stats,
            users: recentUsers,
            courses: pendingCourses.slice(0, 5), // Show pending courses on dashboard
            categories: recentCategories,

            // Keep full data for other components
            allUsers: users,
            allCourses: courses,
            allCategories: categories,
            allPendingCourses: pendingCourses,
          },
          message: "Dashboard data fetched successfully",
        };
      } else {
        throw new Error("One or more API calls failed");
      }
    } catch (error) {
      console.error("❌ Dashboard data fetch error:", error);

      // Return default structure on error
      return {
        success: false,
        data: {
          stats: {
            totalUsers: 0,
            students: 0,
            instructors: 0,
            admins: 0,
            totalCourses: 0,
            activeCourses: 0,
            pendingApprovals: 0,
            totalCategories: 0,
            recentUsers: 0,
            recentCourses: 0,
          },
          users: [],
          courses: [],
          categories: [],
          allUsers: [],
          allCourses: [],
          allCategories: [],
        },
        error: error.message,
      };
    }
  }

  // ========================================
  // AUTHENTICATION & USER INFO
  // ========================================

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
      console.error("Get current user error:", error);
      throw error;
    }
  }

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
      console.error("Admin auth check failed:", error);
      return false;
    }
  }

  async logout() {
    try {
      console.log("Attempting logout...");

      const response = await this.api.get("/auth/logout");
      console.log("Logout response:", response.data);

      // Clear local storage
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      console.warn(" Logout API call failed:", error.message);

      // Still clear local state
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      return { success: true, message: "Logged out locally" };
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  }

  formatDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

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

  async testAdminConnection() {
    try {
      console.log(" Testing admin API connection...");

      const result = await this.getCurrentUser();

      console.log(" Admin API test result:", {
        success: result.success,
        userRole: result.user?.role,
        withCredentials: true,
      });

      return result;
    } catch (error) {
      console.error(" Admin API test failed:", error);
      throw error;
    }
  }
}

// Create and export singleton instance
const adminAPI = new AdminAPIService();
export default adminAPI;
