// src/services/courseService.js
// This matches your backend routes EXACTLY

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class CourseService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Add request interceptor for auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
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
      console.error(`API call failed for ${endpoint}:`, error);
      throw new Error(
        error.response?.data?.message || error.message || "Request failed"
      );
    }
  }

  // ========================================
  // PUBLIC COURSE METHODS (No Auth Required)
  // ========================================

  // Get all courses - GET /api/course/get
  async getAllCourses(filters = {}) {
    const queryParams = new URLSearchParams();

    if (filters.page) queryParams.append("page", filters.page);
    if (filters.limit) queryParams.append("limit", filters.limit);
    if (filters.category) queryParams.append("category", filters.category);

    const query = queryParams.toString();
    return this.apiCall(`/course/get${query ? `?${query}` : ""}`);
  }

  // Get course by ID - GET /api/course/get/:id
  async getCourseById(courseId) {
    return this.apiCall(`/course/get/${courseId}`);
  }

  // Search courses - GET /api/course/search (with CourseSearchSchema validation)
  async searchCourses(keyword, filters = {}) {
    const params = new URLSearchParams({ keyword }); // Your backend expects 'keyword'

    // Add any additional filters your CourseSearchSchema supports
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    return this.apiCall(`/course/search?${params.toString()}`);
  }

  // ========================================
  // AUTHENTICATED COURSE METHODS (Instructor/Admin)
  // ========================================

  // Create new course - POST /api/course/create (Auth + InstructorOrAdmin + CourseSchema)
  async createCourse(courseData) {
    return this.apiCall("/course/create", {
      method: "POST",
      data: {
        title: courseData.title,
        description: courseData.description,
        thumbnail_url: courseData.thumbnail_url || null,
        instructor_id: courseData.instructor_id, // Required by your backend
        category_id: courseData.category_id,
      },
    });
  }

  // Update course - PUT /api/course/edit/:id (Auth + InstructorOrAdmin + CourseSchema)
  async updateCourse(courseId, courseData) {
    return this.apiCall(`/course/edit/${courseId}`, {
      method: "PUT",
      data: {
        id: courseId, // Your updateCourse function expects this
        title: courseData.title,
        description: courseData.description,
        thumbnail_url: courseData.thumbnail_url,
        category_id: courseData.category_id,
      },
    });
  }

  // Delete course - DELETE /api/course/delete/:id (Auth + InstructorOrAdmin)
  async deleteCourse(courseId) {
    return this.apiCall(`/course/delete/${courseId}`, {
      method: "DELETE",
    });
  }

  // ========================================
  // ADMIN-ONLY COURSE METHODS
  // ========================================

  // Get all courses with admin details - GET /api/course/admin/all (Auth + Admin)
  async getAllCoursesAdmin(filters = {}) {
    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append("keyword", filters.search);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.instructor)
      queryParams.append("instructor", filters.instructor);
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.page) queryParams.append("page", filters.page);
    if (filters.limit) queryParams.append("limit", filters.limit);

    const query = queryParams.toString();
    return this.apiCall(`/course/admin/all${query ? `?${query}` : ""}`);
  }

  // Get pending courses - GET /api/course/pending (Auth + Admin)
  async getPendingCourses() {
    return this.apiCall("/course/pending");
  }

  // Approve course - PATCH /api/course/:id/approve (Auth + Admin)
  async approveCourse(courseId, approvalData = {}) {
    return this.apiCall(`/course/${courseId}/approve`, {
      method: "PATCH",
      data: approvalData,
    });
  }

  // Reject course - PATCH /api/course/:id/reject (Auth + Admin)
  async rejectCourse(courseId, rejectionData = {}) {
    return this.apiCall(`/course/${courseId}/reject`, {
      method: "PATCH",
      data: rejectionData,
    });
  }

  // ========================================
  // INSTRUCTOR-SPECIFIC METHODS
  // ========================================

  // Get instructor's courses (filter from getAllCourses)
  async getInstructorCourses(instructorId = null) {
    try {
      const result = await this.getAllCourses();

      if (result.success && result.data) {
        // If instructorId provided, filter for that instructor
        // Otherwise, let the component filter based on currentUser
        const filteredCourses = instructorId
          ? result.data.filter(
              (course) => course.instructor_id === instructorId
            )
          : result.data;

        return {
          ...result,
          data: filteredCourses,
        };
      }

      return result;
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
      throw error;
    }
  }

  // ========================================
  // CATEGORY METHODS (Assuming you have these)
  // ========================================

  // Get all categories
  async getCategories() {
    return this.apiCall("/category/get"); // Adjust endpoint as needed
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  // Format date
  formatDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Format duration (minutes to hours/minutes)
  formatDuration(minutes) {
    if (!minutes) return "0 min";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  }

  // Get status color for UI
  getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case "approved":
      case "published":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      case "draft":
        return "info";
      default:
        return "default";
    }
  }

  // Get difficulty color
  getDifficultyColor(difficulty) {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "success";
      case "intermediate":
        return "warning";
      case "advanced":
        return "error";
      default:
        return "default";
    }
  }

  // Format price
  formatPrice(price, currency = "USD") {
    if (price === 0 || price === null) return "Free";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(price);
  }

  // Validate course data before sending
  validateCourseData(courseData) {
    const errors = {};

    if (!courseData.title?.trim()) {
      errors.title = "Course title is required";
    } else if (courseData.title.length < 3) {
      errors.title = "Title must be at least 3 characters";
    }

    if (!courseData.description?.trim()) {
      errors.description = "Course description is required";
    } else if (courseData.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (!courseData.category_id) {
      errors.category_id = "Please select a category";
    }

    if (
      courseData.thumbnail_url &&
      !this.isValidUrl(courseData.thumbnail_url)
    ) {
      errors.thumbnail_url = "Please enter a valid URL";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // Helper method to validate URLs
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Handle API responses consistently
  handleResponse(response) {
    if (response.success) {
      return response;
    } else {
      throw new Error(response.message || "API request failed");
    }
  }

  // ========================================
  // RESPONSE STRUCTURE HELPERS
  // ========================================

  // Your backend returns data in this structure based on your controller functions:
  // {
  //   success: true/false,
  //   data: [...], // Array of courses
  //   message: "Success message"
  // }

  // Course object structure from your backend:
  // {
  //   id: number,
  //   title: string,
  //   description: string,
  //   thumbnail_url: string,
  //   instructor_id: number,
  //   category_id: number,
  //   is_published: boolean,
  //   is_approved: boolean,
  //   created_at: timestamp,
  //   updated_at: timestamp,
  //   instructor_name: string, // From JOIN
  //   category: string, // From JOIN (note: 'category' not 'category_name')
  //   approval_status: 'pending'|'approved'|'rejected', // From CASE statement
  //   enrollment_count: number // From admin endpoint
  // }
}

// Create and export singleton instance
const courseService = new CourseService();
export default courseService;
