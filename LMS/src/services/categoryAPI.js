// src/services/categoryAPI.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class CategoryAPIService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
      withCredentials: true, // Enable cookies for authentication
    });

    // Add request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(
          `🔧 Making ${config.method?.toUpperCase()} request to: ${config.url}`
        );

        // Support Bearer token if needed
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
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

        // Handle token expiration (401)
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("/auth/refresh-token") &&
          !originalRequest.url?.includes("/auth/login")
        ) {
          originalRequest._retry = true;

          try {
            console.log("🔄 Attempting token refresh...");
            const refreshResponse = await this.api.post("/auth/refresh-token");

            if (refreshResponse.data.success) {
              console.log("✅ Token refresh successful");
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            console.log("❌ Token refresh failed:", refreshError.message);
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");

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

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    try {
      const response = await this.api({
        url: endpoint,
        ...options,
      });

      return response.data;
    } catch (error) {
      console.error(`❌ API call failed for ${endpoint}:`, error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Request failed";

      throw new Error(errorMessage);
    }
  }

  // ========================================
  // CATEGORY MANAGEMENT APIs
  // ========================================

  // Get all categories
  async getAllCategories() {
    return this.apiCall("/category/get");
  }

  // Get category by ID
  async getCategoryById(categoryId) {
    return this.apiCall(`/category/get/${categoryId}`);
  }

  // Create new category
  async createCategory(categoryData) {
    return this.apiCall("/category/create", {
      method: "POST",
      data: categoryData,
    });
  }

  // Update category
  async updateCategory(categoryId, categoryData) {
    return this.apiCall(`/category/edit/${categoryId}`, {
      method: "PUT",
      data: categoryData,
    });
  }

  // Delete category
  async deleteCategory(categoryId) {
    return this.apiCall(`/category/delete/${categoryId}`, {
      method: "DELETE",
    });
  }

  // Search categories (if endpoint exists)
  async searchCategories(query) {
    return this.apiCall(`/category/search?q=${encodeURIComponent(query)}`);
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  // Validate category data
  validateCategoryData(categoryData) {
    const errors = {};

    if (!categoryData.name || categoryData.name.trim().length === 0) {
      errors.name = "Category name is required";
    }

    if (categoryData.name && categoryData.name.length > 100) {
      errors.name = "Category name must be less than 100 characters";
    }

    if (categoryData.description && categoryData.description.length > 500) {
      errors.description = "Description must be less than 500 characters";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // Format date
  formatDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Get category color for UI (you can customize colors based on category type)
  getCategoryColor(categoryName) {
    const colors = [
      { bg: "#eff6ff", text: "#2563eb" }, // Blue
      { bg: "#f0fdf4", text: "#16a34a" }, // Green
      { bg: "#fef7ff", text: "#a855f7" }, // Purple
      { bg: "#fffbeb", text: "#d97706" }, // Amber
      { bg: "#fef2f2", text: "#dc2626" }, // Red
      { bg: "#f0fdfa", text: "#059669" }, // Emerald
      { bg: "#fdf4ff", text: "#c026d3" }, // Fuchsia
      { bg: "#f0f9ff", text: "#0284c7" }, // Sky
    ];

    // Simple hash function to consistently assign colors
    let hash = 0;
    if (categoryName) {
      for (let i = 0; i < categoryName.length; i++) {
        hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
      }
    }

    return colors[Math.abs(hash) % colors.length];
  }

  // Generate category slug from name
  generateSlug(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Test category API connection
  async testCategoryConnection() {
    try {
      console.log("🧪 Testing category API connection...");
      const result = await this.getAllCategories();
      console.log("✅ Category API test result:", {
        success: result.success,
        categoriesCount: result.data?.length || 0,
      });
      return result;
    } catch (error) {
      console.error("❌ Category API test failed:", error);
      throw error;
    }
  }
}

// Create and export singleton instance
const categoryAPI = new CategoryAPIService();
export default categoryAPI;
