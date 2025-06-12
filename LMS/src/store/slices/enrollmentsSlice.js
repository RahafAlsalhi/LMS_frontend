// src/store/slices/enrollmentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUserEnrollments = createAsyncThunk(
  'enrollments/fetchUserEnrollments',
  async (userId, { rejectWithValue }) => {
    try {
      // Mock data - replace with actual API call
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch enrollments');
    }
  }
);

const enrollmentsSlice = createSlice({
  name: 'enrollments',
  initialState: {
    enrollments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload;
      })
      .addCase(fetchUserEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;

