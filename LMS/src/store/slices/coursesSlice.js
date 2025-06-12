import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (params = {}, { rejectWithValue }) => {
    try {
      // This will be replaced with actual API call
      const mockCourses = [
        {
          id: 1,
          title: "Business Sustainability",
          description: "Learn sustainable business practices",
          category_id: 1,
          instructor_id: 1,
          thumbnail_url: "/api/placeholder/300/200",
          is_published: true,
          is_approved: true,
          created_at: new Date().toISOString(),
        },
        // Add more mock courses as needed
      ];
      return { courses: mockCourses, total: mockCourses.length };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch courses"
      );
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (courseId, { rejectWithValue }) => {
    try {
      // This will be replaced with actual API call
      const mockCourse = {
        id: courseId,
        title: "Business Sustainability",
        description: "Learn sustainable business practices",
        category_id: 1,
        instructor_id: 1,
        thumbnail_url: "/api/placeholder/300/200",
        is_published: true,
        is_approved: true,
        created_at: new Date().toISOString(),
      };
      return mockCourse;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch course"
      );
    }
  }
);

const initialState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
  filters: {
    category: "all",
    search: "",
    sort: "newest",
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.pagination.total = action.payload.total;
        state.pagination.totalPages = Math.ceil(
          action.payload.total / state.pagination.limit
        );
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Course by ID
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearCurrentCourse, clearError } =
  coursesSlice.actions;
export default coursesSlice.reducer;
