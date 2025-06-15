import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Button,
  Chip,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  useTheme,
  Tabs,
  Tab,
  Avatar,
  TextField,
  InputAdornment,
  Pagination,
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Schedule as PendingIcon,
  School as CourseIcon,
  Person as InstructorIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import adminAPI from "../../services/adminAPI";
import { FullScreenLoader, InlineLoader } from "../common/LoadingSpinner";

const AdminCourseApproval = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // State management
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [tabValue, setTabValue] = useState(0); // 0: Pending, 1: Approved, 2: Rejected, 3: All

  // Search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(10);

  // Statistics
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  const getCourseStatus = (course) => {
    console.log("🔍 Getting status for course:", {
      id: course.id,
      title: course.title,
      is_approved: course.is_approved,
      is_published: course.is_published,
      created_at: course.created_at,
      updated_at: course.updated_at,
    });

    // Check if course has been  approved
    if (course.is_approved === true || course.is_approved === 1) {
      return "approved";
    }

    // Check if course has been  rejected
    else if (course.is_approved === false || course.is_approved === 0) {
      // Strategy 1: Check if updated_at is significantly different from created_at
      // This suggests the course has been reviewed
      const createdTime = new Date(course.created_at).getTime();
      const updatedTime = new Date(course.updated_at).getTime();
      const timeDifference = updatedTime - createdTime;

      // If updated more than 10 seconds after creation, likely it was reviewed and rejected
      if (timeDifference > 10000) {
        return "rejected";
      }

      // Strategy 2: Check if other courses have been approved/rejected
      // If this is the only course with false, it might be newly created
      // (This is not perfect but a temporary workaround)

      // For now, default to pending for recently created courses
      return "pending";
    }

    // null, undefined, or any other value - consider pending
    else {
      return "pending";
    }
  };

  // Check authentication and fetch data
  useEffect(() => {
    if (!adminAPI.isAdminAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchCourses();
  }, [navigate]);

  // ✅ SIMPLIFIED: Filter courses based on tab and search
  useEffect(() => {
    console.log("🔍 Filtering courses:", {
      totalCourses: courses.length,
      tabValue,
      searchTerm,
    });

    let filtered = [...courses];

    // Tab filter
    switch (tabValue) {
      case 0: // Pending
        filtered = filtered.filter(
          (course) => getCourseStatus(course) === "pending"
        );
        break;
      case 1: // Approved
        filtered = filtered.filter(
          (course) => getCourseStatus(course) === "approved"
        );
        break;
      case 2: // Rejected
        filtered = filtered.filter(
          (course) => getCourseStatus(course) === "rejected"
        );
        break;
      case 3: // All
      default:
        // No filter, show all
        break;
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    console.log("🔍 Filtered courses:", filtered.length);
    setFilteredCourses(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [courses, tabValue, searchTerm]);

  // ✅ SIMPLIFIED: Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching courses...");

      const result = await adminAPI.getAllCoursesAdmin();
      console.log("🔍 API Response:", result);

      if (result && result.success && Array.isArray(result.data)) {
        console.log("🔍 Setting courses:", result.data.length);

        // Log each course for debugging
        result.data.forEach((course) => {
          console.log("Course:", {
            id: course.id,
            title: course.title,
            is_approved: course.is_approved,
            status: getCourseStatus(course),
          });
        });

        setCourses(result.data);
        calculateStats(result.data);
      } else {
        console.error("🔍 Invalid response:", result);
        showSnackbar("Failed to fetch courses", "error");
        setCourses([]); // Set empty array on error
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      showSnackbar("Error fetching courses", "error");
      setCourses([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // ✅ SIMPLIFIED: Calculate stats
  const calculateStats = (coursesData) => {
    const pendingCount = coursesData.filter(
      (course) => getCourseStatus(course) === "pending"
    ).length;
    const approvedCount = coursesData.filter(
      (course) => getCourseStatus(course) === "approved"
    ).length;
    const rejectedCount = coursesData.filter(
      (course) => getCourseStatus(course) === "rejected"
    ).length;

    const stats = {
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      total: coursesData.length,
    };

    console.log("🔍 Calculated stats:", stats);
    setStats(stats);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Course approval/rejection
  const handleCourseAction = async (courseId, action) => {
    const actionText = action === "approve" ? "approve" : "reject";

    if (
      !window.confirm(`Are you sure you want to ${actionText} this course?`)
    ) {
      return;
    }

    try {
      setActionLoading(true);
      console.log(`🔍 ${actionText}ing course:`, courseId);

      if (action === "approve") {
        const result = await adminAPI.approveCourse(courseId);
        console.log("🔍 Approval result:", result);
      } else {
        const result = await adminAPI.rejectCourse(courseId);
        console.log("🔍 Rejection result:", result);
      }

      showSnackbar(`Course ${actionText}d successfully!`);
      await fetchCourses(); // Refresh courses list
    } catch (error) {
      console.error(`Error ${actionText}ing course:`, error);
      showSnackbar(`Error ${actionText}ing course`, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourse(null);
  };

  // Get pagination data
  const getPaginatedCourses = () => {
    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    return filteredCourses.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Status functions
  const getStatusColor = (course) => {
    const status = getCourseStatus(course);
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
      default:
        return "warning";
    }
  };

  const getStatusIcon = (course) => {
    const status = getCourseStatus(course);
    switch (status) {
      case "approved":
        return <ApproveIcon />;
      case "rejected":
        return <RejectIcon />;
      case "pending":
      default:
        return <PendingIcon />;
    }
  };

  const getStatusText = (course) => {
    const status = getCourseStatus(course);
    return status.toUpperCase();
  };

  // Check if course can be acted upon
  const canActOnCourse = (course) => {
    const status = getCourseStatus(course);
    return status === "pending";
  };

  if (loading) {
    return <FullScreenLoader message="Loading courses..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Typography variant="h3" fontWeight={700} mb={1}>
              Course Management
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Review and approve course submissions.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchCourses}
            disabled={actionLoading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Debug Info - Remove this in production */}
      {/* <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.100" }}>
        <Typography variant="subtitle2" gutterBottom>
          Debug Info:
        </Typography>
        <Typography variant="body2">
          Total Courses: {courses.length} | Filtered Courses:{" "}
          {filteredCourses.length} | Current Tab: {tabValue} | Search: "
          {searchTerm}"
        </Typography>
        {courses.length > 0 && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Sample Course Status: {courses[0]?.title} -{" "}
            {getCourseStatus(courses[0])}
          </Typography>
        )}
      </Paper> */}

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h4" fontWeight={700} color="warning.main">
              {stats.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Review
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h4" fontWeight={700} color="success.main">
              {stats.approved}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Approved
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h4" fontWeight={700} color="error.main">
              {stats.rejected}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rejected
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h4" fontWeight={700} color="primary.main">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Courses
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
        >
          <Tab label={`Pending (${stats.pending})`} />
          <Tab label={`Approved (${stats.approved})`} />
          <Tab label={`Rejected (${stats.rejected})`} />
          <Tab label={`All (${stats.total})`} />
        </Tabs>
      </Paper>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search courses by title, description, category, or instructor..."
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
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Showing {getPaginatedCourses().length} of {filteredCourses.length}{" "}
              courses
              {searchTerm && ` for "${searchTerm}"`}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Courses Table */}
      <Paper sx={{ overflow: "hidden" }}>
        {actionLoading ? (
          <InlineLoader message="Processing..." height="300px" />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course Details</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell align="center">Category</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Submitted</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getPaginatedCourses().map((course) => (
                  <TableRow key={course.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight={600} mb={0.5}>
                          {course.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {course.description?.substring(0, 100)}...
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <InstructorIcon />
                        </Avatar>
                        <Typography variant="body2">
                          {course.instructor_name || "Unknown"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={course.category || "Uncategorized"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={getStatusIcon(course)}
                        label={getStatusText(course)}
                        color={getStatusColor(course)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {adminAPI.formatDate(course.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        {canActOnCourse(course) && (
                          <>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() =>
                                handleCourseAction(course.id, "approve")
                              }
                              disabled={actionLoading}
                              title="Approve Course"
                            >
                              <ApproveIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleCourseAction(course.id, "reject")
                              }
                              disabled={actionLoading}
                              title="Reject Course"
                            >
                              <RejectIcon />
                            </IconButton>
                          </>
                        )}
                        {/* <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewCourse(course)}
                          title="View Details"
                        >
                          <ViewIcon />
                        </IconButton> */}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" p={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
            />
          </Box>
        )}

        {filteredCourses.length === 0 && !actionLoading && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              No courses found for the selected filter.
            </Typography>
            {courses.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                No courses have been submitted yet.
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      {/* Course Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedCourse && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <CourseIcon color="primary" />
                <Box>
                  <Typography variant="h6">{selectedCourse.title}</Typography>
                  <Chip
                    icon={getStatusIcon(selectedCourse)}
                    label={getStatusText(selectedCourse)}
                    color={getStatusColor(selectedCourse)}
                    size="small"
                  />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Course Information
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Description
                      </Typography>
                      <Typography variant="body1">
                        {selectedCourse.description ||
                          "No description provided"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Category
                      </Typography>
                      <Typography variant="body1">
                        {selectedCourse.category || "Uncategorized"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Duration
                      </Typography>
                      <Typography variant="body1">
                        {selectedCourse.duration || "Not specified"}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Instructor & Timeline
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Instructor
                      </Typography>
                      <Typography variant="body1">
                        {selectedCourse.instructor_name || "Unknown"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Submitted Date
                      </Typography>
                      <Typography variant="body1">
                        {adminAPI.formatDate(selectedCourse.created_at)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {adminAPI.formatDate(selectedCourse.updated_at)}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} disabled={actionLoading}>
                Close
              </Button>
              {canActOnCourse(selectedCourse) && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={
                      actionLoading ? (
                        <InlineLoader size={16} />
                      ) : (
                        <ApproveIcon />
                      )
                    }
                    onClick={() => {
                      handleCourseAction(selectedCourse.id, "approve");
                      handleCloseDialog();
                    }}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : "Approve Course"}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={
                      actionLoading ? (
                        <InlineLoader size={16} />
                      ) : (
                        <RejectIcon />
                      )
                    }
                    onClick={() => {
                      handleCourseAction(selectedCourse.id, "reject");
                      handleCloseDialog();
                    }}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : "Reject Course"}
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Back to Dashboard Button */}
      <Box mt={4} display="flex" justifyContent="flex-start">
        <Button
          variant="outlined"
          onClick={() => navigate("/admin/dashboard")}
          sx={{ minWidth: 150 }}
        >
          ← Back to Dashboard
        </Button>
      </Box>

      {/* Snackbar for notifications */}
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

export default AdminCourseApproval;
