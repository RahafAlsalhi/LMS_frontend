// src/components/courses/CourseList.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  Alert,
  Snackbar,
  Pagination,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  ViewModule as GridIcon,
  ViewList as ListIcon,
} from "@mui/icons-material";

import CourseCard from "./CourseCard";
import CourseFormDialog from "./CourseFormDialog";
import CourseDetailsDialog from "./CourseDetailsDialog";
import courseService from "../../services/courseService";

const CourseList = ({
  userRole = "student", // 'student', 'instructor', 'admin'
  currentUser = null,
  viewMode = "page", // 'page', 'dashboard', 'widget'
  maxItems = null, // null for unlimited, number for limited display
  showHeader = true,
  showFilters = true,
  showActions = true,
  onCourseSelect = null, // Callback when course is selected
}) => {
  // State management
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Dialog states
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [formMode, setFormMode] = useState("create"); // 'create', 'edit'
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [tabValue, setTabValue] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(viewMode === "dashboard" ? 6 : 12);

  // View settings
  const [cardView, setCardView] = useState(true);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Statistics
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  // Load data on mount
  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [userRole, currentUser]);

  // Filter courses whenever filters change
  useEffect(() => {
    filterCourses();
  }, [
    courses,
    searchTerm,
    statusFilter,
    categoryFilter,
    difficultyFilter,
    tabValue,
  ]);

  // Fetch courses based on user role
  const fetchCourses = async () => {
    try {
      setLoading(true);
      let result;

      switch (userRole) {
        case "admin":
          result = await courseService.getAllCoursesAdmin();
          break;
        case "instructor":
          result = await courseService.getInstructorCourses();
          break;
        case "student":
        default:
          result = await courseService.getAllCourses();
          break;
      }

      if (result.success) {
        setCourses(result.data || []);
        calculateStats(result.data || []);
      } else {
        showSnackbar("Failed to fetch courses", "error");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      showSnackbar("Error fetching courses", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const result = await courseService.getCategories();
      if (result.success) {
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Calculate statistics
  const calculateStats = (coursesData) => {
    const newStats = {
      pending: coursesData.filter(
        (course) =>
          !course.approval_status || course.approval_status === "pending"
      ).length,
      approved: coursesData.filter(
        (course) => course.approval_status === "approved"
      ).length,
      rejected: coursesData.filter(
        (course) => course.approval_status === "rejected"
      ).length,
      total: coursesData.length,
    };
    setStats(newStats);
  };

  // Filter courses based on current filters
  const filterCourses = () => {
    let filtered = [...courses];

    // Role-based filtering
    if (userRole === "instructor" && currentUser) {
      filtered = filtered.filter(
        (course) => course.instructor_id === currentUser.id
      );
    }

    // Tab-based filtering (for admin)
    if (userRole === "admin") {
      switch (tabValue) {
        case 0: // All
          break;
        case 1: // Pending
          filtered = filtered.filter(
            (course) =>
              !course.approval_status || course.approval_status === "pending"
          );
          break;
        case 2: // Approved
          filtered = filtered.filter(
            (course) => course.approval_status === "approved"
          );
          break;
        case 3: // Rejected
          filtered = filtered.filter(
            (course) => course.approval_status === "rejected"
          );
          break;
      }
    } else if (userRole === "student") {
      // Students only see approved courses
      filtered = filtered.filter(
        (course) => course.approval_status === "approved"
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (course) => course.approval_status === statusFilter
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (course) => course.category_id === parseInt(categoryFilter)
      );
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(
        (course) => course.difficulty_level === difficultyFilter
      );
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(term) ||
          course.description?.toLowerCase().includes(term) ||
          course.instructor_name?.toLowerCase().includes(term) ||
          course.category_name?.toLowerCase().includes(term)
      );
    }

    // Apply maxItems limit if specified
    if (maxItems && maxItems > 0) {
      filtered = filtered.slice(0, maxItems);
    }

    setFilteredCourses(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Get paginated courses
  const getPaginatedCourses = () => {
    if (viewMode === "dashboard" || maxItems) {
      return filteredCourses; // No pagination for dashboard/widget view
    }

    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    return filteredCourses.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Event handlers
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Form handlers
  const handleOpenForm = (mode, course = null) => {
    setFormMode(mode);
    setSelectedCourse(course);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedCourse(null);
  };

  const handleSubmitCourse = async (formData) => {
    try {
      setActionLoading(true);
      let result;

      if (formMode === "create") {
        result = await courseService.createCourse(formData);
        showSnackbar("Course created successfully!");
      } else if (formMode === "edit") {
        result = await courseService.updateCourse(selectedCourse.id, formData);
        showSnackbar("Course updated successfully!");
      }

      if (result.success) {
        fetchCourses();
        handleCloseForm();
      } else {
        showSnackbar(result.message || "Operation failed", "error");
      }
    } catch (error) {
      console.error(`Error ${formMode}ing course:`, error);
      showSnackbar(`Error ${formMode}ing course`, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Course action handlers
  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setOpenDetails(true);
    if (onCourseSelect) {
      onCourseSelect(course);
    }
  };

  const handleEditCourse = (course) => {
    handleOpenForm("edit", course);
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const result = await courseService.deleteCourse(courseId);

      if (result.success) {
        showSnackbar("Course deleted successfully!");
        fetchCourses();
      } else {
        showSnackbar(result.message || "Failed to delete course", "error");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      showSnackbar("Error deleting course", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to approve "${courseTitle}"?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const result = await courseService.approveCourse(courseId);

      if (result.success) {
        showSnackbar("Course approved successfully!");
        fetchCourses();
      } else {
        showSnackbar(result.message || "Failed to approve course", "error");
      }
    } catch (error) {
      console.error("Error approving course:", error);
      showSnackbar("Error approving course", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to reject "${courseTitle}"?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const result = await courseService.rejectCourse(courseId);

      if (result.success) {
        showSnackbar("Course rejected successfully!");
        fetchCourses();
      } else {
        showSnackbar(result.message || "Failed to reject course", "error");
      }
    } catch (error) {
      console.error("Error rejecting course:", error);
      showSnackbar("Error rejecting course", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Render methods
  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <Box mb={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} mb={1}>
              {userRole === "admin" && "Course Management"}
              {userRole === "instructor" && "My Courses"}
              {userRole === "student" && "Available Courses"}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {userRole === "admin" && "Review and approve course submissions"}
              {userRole === "instructor" && "Create and manage your courses"}
              {userRole === "student" && "Discover and enroll in courses"}
            </Typography>
          </Box>

          {showActions &&
            (userRole === "admin" || userRole === "instructor") && (
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={fetchCourses}
                  disabled={loading || actionLoading}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenForm("create")}
                  size="large"
                >
                  Add Course
                </Button>
              </Stack>
            )}
        </Box>

        {/* Statistics for admin */}
        {userRole === "admin" && (
          <Grid container spacing={3} mb={3}>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" fontWeight={700} color="warning.main">
                  {stats.pending}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Review
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" fontWeight={700} color="success.main">
                  {stats.approved}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Approved
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" fontWeight={700} color="error.main">
                  {stats.rejected}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rejected
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h4" fontWeight={700} color="primary.main">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Courses
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    );
  };

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* Admin tabs */}
        {userRole === "admin" && (
          <Box mb={3}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              variant="fullWidth"
            >
              <Tab label={`All (${stats.total})`} />
              <Tab label={`Pending (${stats.pending})`} />
              <Tab label={`Approved (${stats.approved})`} />
              <Tab label={`Rejected (${stats.rejected})`} />
            </Tabs>
          </Box>
        )}

        {/* Search and filter controls */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                label="Difficulty"
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {userRole !== "admin" && (
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              {filteredCourses.length} course
              {filteredCourses.length !== 1 ? "s" : ""} found
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const renderCourses = () => {
    if (loading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress size={48} />
        </Box>
      );
    }

    if (actionLoading) {
      return (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      );
    }

    const coursesToShow = getPaginatedCourses();

    if (coursesToShow.length === 0) {
      return (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            No courses found
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {searchTerm
              ? "Try adjusting your search criteria"
              : "No courses match your current filters"}
          </Typography>
          {showActions &&
            (userRole === "admin" || userRole === "instructor") && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenForm("create")}
              >
                Create Your First Course
              </Button>
            )}
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {coursesToShow.map((course) => (
          <Grid
            item
            xs={12}
            sm={viewMode === "dashboard" ? 12 : 6}
            md={viewMode === "dashboard" ? 6 : 4}
            key={course.id}
          >
            <CourseCard
              course={course}
              userRole={userRole}
              currentUser={currentUser}
              showActions={showActions}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              onApprove={handleApproveCourse}
              onReject={handleRejectCourse}
              onView={handleViewCourse}
              onClick={handleViewCourse}
              variant={viewMode === "dashboard" ? "compact" : "default"}
              loading={actionLoading}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderPagination = () => {
    if (viewMode === "dashboard" || maxItems || totalPages <= 1) {
      return null;
    }

    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="primary"
          size="large"
        />
      </Box>
    );
  };

  // Main render
  return (
    <Container maxWidth={viewMode === "dashboard" ? "lg" : "xl"} sx={{ py: 4 }}>
      {renderHeader()}
      {renderFilters()}
      {renderCourses()}
      {renderPagination()}

      {/* Course Form Dialog */}
      <CourseFormDialog
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitCourse}
        mode={formMode}
        course={selectedCourse}
        categories={categories}
        loading={actionLoading}
        userRole={userRole}
      />

      {/* Course Details Dialog */}
      <CourseDetailsDialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        course={selectedCourse}
        userRole={userRole}
        currentUser={currentUser}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
        onApprove={handleApproveCourse}
        onReject={handleRejectCourse}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CourseList;
