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

  // Check authentication and fetch data
  useEffect(() => {
    if (!adminAPI.isAdminAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchCourses();
  }, [navigate]);

  // Filter courses based on tab and search
  useEffect(() => {
    let filtered = [...courses];

    // Tab filter
    switch (tabValue) {
      case 0: // Pending
        filtered = filtered.filter(
          (course) =>
            course.approval_status === "pending" ||
            !course.approval_status ||
            !course.is_approved
        );
        break;
      case 1: // Approved
        filtered = filtered.filter(
          (course) =>
            course.approval_status === "approved" || course.is_approved === true
        );
        break;
      case 2: // Rejected
        filtered = filtered.filter(
          (course) =>
            course.approval_status === "rejected" ||
            (course.is_approved === false && course.is_published === false)
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

    setFilteredCourses(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [courses, tabValue, searchTerm]);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const result = await adminAPI.getAllCourses();

      if (result.success) {
        setCourses(result.data);
        calculateStats(result.data);
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

  const calculateStats = (coursesData) => {
    const stats = {
      pending: coursesData.filter(
        (course) =>
          course.approval_status === "pending" ||
          !course.approval_status ||
          !course.is_approved // Handle both approval_status and is_approved
      ).length,
      approved: coursesData.filter(
        (course) =>
          course.approval_status === "approved" || course.is_approved === true
      ).length,
      rejected: coursesData.filter(
        (course) =>
          course.approval_status === "rejected" ||
          (course.is_approved === false && course.is_published === false)
      ).length,
      total: coursesData.length,
    };
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

      if (action === "approve") {
        await adminAPI.approveCourse(courseId);
      } else {
        await adminAPI.rejectCourse(courseId);
      }

      showSnackbar(`Course ${actionText}d successfully!`);
      fetchCourses();
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

  const getStatusColor = (status) => {
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

  const getStatusIcon = (status) => {
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

  const getStatusText = (status) => {
    if (!status || status === "pending") return "PENDING";
    return status.toUpperCase();
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
                        icon={getStatusIcon(course.approval_status)}
                        label={getStatusText(course.approval_status)}
                        color={getStatusColor(course.approval_status)}
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
                        {(!course.approval_status ||
                          course.approval_status === "pending") && (
                          <>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() =>
                                handleCourseAction(course.id, "approve")
                              }
                              disabled={actionLoading}
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
                            >
                              <RejectIcon />
                            </IconButton>
                          </>
                        )}
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
                    icon={getStatusIcon(selectedCourse.approval_status)}
                    label={getStatusText(selectedCourse.approval_status)}
                    color={getStatusColor(selectedCourse.approval_status)}
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
                    {selectedCourse.approved_at && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Approved Date
                        </Typography>
                        <Typography variant="body1">
                          {adminAPI.formatDate(selectedCourse.approved_at)}
                        </Typography>
                      </Box>
                    )}
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
                {selectedCourse.learning_objectives && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Learning Objectives
                    </Typography>
                    <Typography variant="body1">
                      {selectedCourse.learning_objectives}
                    </Typography>
                  </Grid>
                )}
                {selectedCourse.prerequisites && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Prerequisites
                    </Typography>
                    <Typography variant="body1">
                      {selectedCourse.prerequisites}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} disabled={actionLoading}>
                Close
              </Button>
              {(!selectedCourse.approval_status ||
                selectedCourse.approval_status === "pending") && (
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
