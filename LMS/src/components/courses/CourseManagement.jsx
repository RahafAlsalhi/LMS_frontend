// src/components/courses/CourseManagement.jsx
// This replaces ALL your course components - use this one file only

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Chip,
  Avatar,
  IconButton,
  Alert,
  Snackbar,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  Pagination,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Schedule as PendingIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  School as CourseIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";

import CourseFormDialog from "./CourseFormDialog";
import adminAPI from "../../services/adminAPI";

const CourseManagement = ({
  userRole = "instructor", // 'admin', 'instructor', 'student'
  currentUser = null,
  mode = "full", // 'full', 'dashboard', 'pending-only'
}) => {
  // State management
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Dialog states
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    mode === "pending-only" ? "pending" : "all"
  );
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [tabValue, setTabValue] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = mode === "dashboard" ? 6 : 12;

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
  }, [courses, searchTerm, statusFilter, categoryFilter, tabValue]);

  // Fetch courses based on user role
  const fetchCourses = async () => {
    try {
      setLoading(true);
      let result;

      if (userRole === "admin") {
        result = await adminAPI.getAllCoursesAdmin();
      } else if (userRole === "instructor") {
        result = await adminAPI.getInstructorCourses();
      } else {
        result = await adminAPI.getAllCourses();
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
      const result = await adminAPI.getCategories();
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

  // Filter courses
  const filterCourses = () => {
    let filtered = [...courses];

    // Role-based filtering
    if (userRole === "instructor" && currentUser) {
      filtered = filtered.filter(
        (course) => course.instructor_id === currentUser.id
      );
    }

    // Mode-based filtering
    if (mode === "pending-only") {
      filtered = filtered.filter(
        (course) =>
          !course.approval_status || course.approval_status === "pending"
      );
    }

    // Tab-based filtering (for admin)
    if (userRole === "admin" && mode === "full") {
      switch (tabValue) {
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
        // case 0: All - no additional filtering
      }
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

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(term) ||
          course.description?.toLowerCase().includes(term) ||
          course.instructor_name?.toLowerCase().includes(term) ||
          course.category?.toLowerCase().includes(term) // ← Use 'category' not 'category_name'
      );
    }
    setFilteredCourses(filtered);
    setCurrentPage(1);
  };

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
        result = await adminAPI.createCourse(formData);
        showSnackbar("Course created successfully!");
      } else if (formMode === "edit") {
        result = await adminAPI.updateCourse(selectedCourse.id, formData);
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

  // Confirmation dialog
  const handleOpenConfirm = (action, course) => {
    setConfirmAction(action);
    setSelectedCourse(course);
    setOpenConfirm(true);
  };

  const handleConfirmAction = async () => {
    try {
      setActionLoading(true);
      let result;
      let message;

      switch (confirmAction.type) {
        case "delete":
          result = await adminAPI.deleteCourse(selectedCourse.id);
          message = "Course deleted successfully!";
          break;
        case "approve":
          result = await adminAPI.approveCourse(selectedCourse.id);
          message = "Course approved successfully!";
          break;
        case "reject":
          result = await adminAPI.rejectCourse(selectedCourse.id);
          message = "Course rejected successfully!";
          break;
      }

      if (result.success) {
        showSnackbar(message);
        fetchCourses();
      } else {
        showSnackbar(result.message || "Operation failed", "error");
      }
    } catch (error) {
      console.error("Error performing action:", error);
      showSnackbar("Error performing action", "error");
    } finally {
      setActionLoading(false);
      setOpenConfirm(false);
      setConfirmAction(null);
      setSelectedCourse(null);
    }
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return { color: "success", icon: <ApproveIcon />, label: "APPROVED" };
      case "rejected":
        return { color: "error", icon: <RejectIcon />, label: "REJECTED" };
      default:
        return { color: "warning", icon: <PendingIcon />, label: "PENDING" };
    }
  };

  // Permission checks
  const canEdit = (course) => {
    return (
      userRole === "admin" ||
      (userRole === "instructor" && course.instructor_id === currentUser?.id)
    );
  };

  const canModerate = (course) => {
    return (
      userRole === "admin" &&
      (!course.approval_status || course.approval_status === "pending")
    );
  };

  // Get paginated courses
  const getPaginatedCourses = () => {
    if (mode === "dashboard") {
      return filteredCourses.slice(0, coursesPerPage);
    }
    const startIndex = (currentPage - 1) * coursesPerPage;
    return filteredCourses.slice(startIndex, startIndex + coursesPerPage);
  };

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Render components
  const renderHeader = () => {
    if (mode === "dashboard") {
      return (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6" fontWeight={600}>
            {mode === "pending-only" ? "Pending Course Approvals" : "Courses"}
          </Typography>
          {(userRole === "admin" || userRole === "instructor") && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenForm("create")}
              size="small"
            >
              Add Course
            </Button>
          )}
        </Box>
      );
    }

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

          {(userRole === "admin" || userRole === "instructor") && (
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
    if (mode === "dashboard") return null;

    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* Admin tabs */}
        {userRole === "admin" && mode === "full" && (
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

          <Grid item xs={12} md={3}>
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

          {userRole !== "admin" && (
            <Grid item xs={12} md={3}>
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
              {filteredCourses.length !== 1 ? "s" : ""}
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

    const coursesToShow = getPaginatedCourses();

    if (coursesToShow.length === 0) {
      return (
        <Box textAlign="center" py={8}>
          <CourseIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={2}>
            No courses found
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {searchTerm
              ? "Try adjusting your search criteria"
              : "No courses match your current filters"}
          </Typography>
          {(userRole === "admin" || userRole === "instructor") && (
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
        {coursesToShow.map((course) => {
          const statusConfig = getStatusConfig(course.approval_status);

          return (
            <Grid
              item
              xs={12}
              sm={mode === "dashboard" ? 12 : 6}
              md={mode === "dashboard" ? 6 : 4}
              key={course.id}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="div"
                  sx={{
                    height: 160,
                    backgroundColor: "grey.200",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: course.thumbnail_url
                      ? `url(${course.thumbnail_url})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
                  {!course.thumbnail_url && (
                    <CourseIcon sx={{ fontSize: 48, color: "grey.400" }} />
                  )}

                  <Box position="absolute" top={8} right={8}>
                    <Chip
                      {...statusConfig}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </CardMedia>

                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={1}
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {course.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {course.description || "No description available"}
                  </Typography>

                  {userRole === "admin" && (
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {course.instructor_name || "Unknown"}
                      </Typography>
                    </Box>
                  )}

                  {course.category_name && (
                    <Chip
                      label={course.category_name}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  )}

                  <Typography variant="caption" color="text.secondary">
                    Created {adminAPI.formatDate(course.created_at)}
                  </Typography>
                </CardContent>

                <CardActions
                  sx={{ p: 2, pt: 0, justifyContent: "space-between" }}
                >
                  <Box>
                    {canEdit(course) && (
                      <>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenForm("edit", course)}
                          disabled={actionLoading}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleOpenConfirm({ type: "delete" }, course)
                          }
                          disabled={actionLoading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>

                  {canModerate(course) && (
                    <Box>
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() =>
                          handleOpenConfirm({ type: "approve" }, course)
                        }
                        disabled={actionLoading}
                      >
                        <ApproveIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          handleOpenConfirm({ type: "reject" }, course)
                        }
                        disabled={actionLoading}
                      >
                        <RejectIcon />
                      </IconButton>
                    </Box>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderPagination = () => {
    if (mode === "dashboard" || totalPages <= 1) return null;

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
    <Container
      maxWidth={mode === "dashboard" ? "lg" : "xl"}
      sx={{ py: mode === "dashboard" ? 2 : 4 }}
    >
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

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirm{" "}
          {confirmAction?.type?.charAt(0).toUpperCase() +
            confirmAction?.type?.slice(1)}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {confirmAction?.type} the course "
            {selectedCourse?.title}"?
            {confirmAction?.type === "approve" &&
              " This will make it visible to students."}
            {confirmAction?.type === "reject" &&
              " This will prevent it from being published."}
            {confirmAction?.type === "delete" &&
              " This action cannot be undone."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirm(false)}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color={
              confirmAction?.type === "approve"
                ? "success"
                : confirmAction?.type === "reject"
                ? "error"
                : "primary"
            }
            disabled={actionLoading}
          >
            {actionLoading ? (
              <CircularProgress size={20} />
            ) : (
              confirmAction?.type?.charAt(0).toUpperCase() +
              confirmAction?.type?.slice(1)
            )}
          </Button>
        </DialogActions>
      </Dialog>

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

export default CourseManagement;
