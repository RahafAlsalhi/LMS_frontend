import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Stack,
  Fade,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import adminAPI from "../../../services/adminAPI";

const PendingCoursesComponent = ({ navigate }) => {
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: "",
    courseId: null,
    courseName: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch pending courses when component mounts
  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const fetchPendingCourses = async () => {
    try {
      setLoading(true);

      // Using adminAPI to fetch pending courses
      const response = await adminAPI.apiCall("/course/pending");

      if (response.success) {
        setPendingCourses(response.data || []);
        if (response.data.length > 0) {
          showSnackbar(`Found ${response.data.length} pending courses`);
        }
      } else {
        showSnackbar("Failed to fetch pending courses", "error");
      }
    } catch (error) {
      console.error("Error fetching pending courses:", error);
      showSnackbar("Error loading pending courses", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseAction = async (courseId, action) => {
    try {
      setActionLoading(courseId);

      const response = await adminAPI.apiCall(`/course/${courseId}/${action}`, {
        method: "PATCH",
      });

      if (response.success) {
        // Remove the course from pending list
        setPendingCourses((prev) =>
          prev.filter((course) => course.id !== courseId)
        );

        const actionText = action === "approve" ? "approved" : "rejected";
        showSnackbar(`Course ${actionText} successfully`, "success");
      } else {
        showSnackbar(`Failed to ${action} course`, "error");
      }
    } catch (error) {
      console.error(`Error ${action}ing course:`, error);
      showSnackbar(`Error ${action}ing course`, "error");
    } finally {
      setActionLoading(null);
      setConfirmDialog({
        open: false,
        type: "",
        courseId: null,
        courseName: "",
      });
    }
  };

  const openConfirmDialog = (type, courseId, courseName) => {
    setConfirmDialog({
      open: true,
      type,
      courseId,
      courseName,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, type: "", courseId: null, courseName: "" });
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 80) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <>
      <Fade in timeout={1000}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            background: "white",
            border: "1px solid #f0f0f0",
            overflow: "hidden",
            mb: 3,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <Box sx={{ p: 4, borderBottom: "1px solid #f5f5f5" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={3}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    backgroundColor: "#f8faff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4f46e5",
                  }}
                >
                  <AssignmentIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    color="#1a1a1a"
                    mb={0.5}
                  >
                    Pending Course Approvals
                  </Typography>
                  <Typography variant="body2" color="#6b7280">
                    Review and approve submitted courses
                  </Typography>
                </Box>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/admin/courses/create")}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    backgroundColor: "#4f46e5",
                    "&:hover": {
                      backgroundColor: "#4338ca",
                    },
                  }}
                >
                  Create Course
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/courses")}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    borderColor: "#e5e7eb",
                    color: "#4f46e5",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#4f46e5",
                      backgroundColor: "#f8faff",
                    },
                  }}
                >
                  View All Courses
                </Button>
              </Stack>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress size={32} sx={{ color: "#4f46e5" }} />
              </Box>
            ) : pendingCourses.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: "#6b7280",
                          fontSize: "0.875rem",
                          py: 2,
                        }}
                      >
                        Course Details
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 600,
                          color: "#6b7280",
                          fontSize: "0.875rem",
                          py: 2,
                        }}
                      >
                        Instructor
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 600,
                          color: "#6b7280",
                          fontSize: "0.875rem",
                          py: 2,
                        }}
                      >
                        Category
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 600,
                          color: "#6b7280",
                          fontSize: "0.875rem",
                          py: 2,
                        }}
                      >
                        Submitted
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: 600,
                          color: "#6b7280",
                          fontSize: "0.875rem",
                          py: 2,
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingCourses.map((course) => (
                      <TableRow
                        key={course.id}
                        hover
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f9fafb",
                          },
                        }}
                      >
                        <TableCell sx={{ py: 3 }}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                              variant="rounded"
                              src={course.thumbnail_url}
                              sx={{
                                width: 56,
                                height: 56,
                                backgroundColor: "#f3f4f6",
                              }}
                            >
                              <SchoolIcon />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="body1"
                                fontWeight={600}
                                mb={0.5}
                                color="#1a1a1a"
                              >
                                {course.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="#6b7280"
                                sx={{ mb: 1 }}
                              >
                                {truncateText(course.description)}
                              </Typography>
                              <Chip
                                label="Pending Review"
                                size="small"
                                sx={{
                                  backgroundColor: "#fef3c7",
                                  color: "#d97706",
                                  fontWeight: 500,
                                  fontSize: "0.75rem",
                                  height: 24,
                                }}
                              />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box textAlign="center">
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              color="#374151"
                            >
                              {course.instructor_name || "Unknown"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={course.category_name || "No Category"}
                            size="small"
                            sx={{
                              backgroundColor: "#f3f4f6",
                              color: "#374151",
                              borderRadius: 1.5,
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="#6b7280">
                            {formatDate(course.created_at)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            <IconButton
                              size="small"
                              disabled={actionLoading === course.id}
                              onClick={() =>
                                openConfirmDialog(
                                  "approve",
                                  course.id,
                                  course.title
                                )
                              }
                              sx={{
                                backgroundColor: "#f0fdf4",
                                color: "#16a34a",
                                width: 32,
                                height: 32,
                                "&:hover": {
                                  backgroundColor: "#dcfce7",
                                  transform: "scale(1.05)",
                                },
                                "&:disabled": {
                                  backgroundColor: "#f9fafb",
                                  color: "#9ca3af",
                                },
                              }}
                            >
                              {actionLoading === course.id ? (
                                <CircularProgress size={16} />
                              ) : (
                                <CheckIcon fontSize="small" />
                              )}
                            </IconButton>
                            <IconButton
                              size="small"
                              disabled={actionLoading === course.id}
                              onClick={() =>
                                openConfirmDialog(
                                  "reject",
                                  course.id,
                                  course.title
                                )
                              }
                              sx={{
                                backgroundColor: "#fef2f2",
                                color: "#dc2626",
                                width: 32,
                                height: 32,
                                "&:hover": {
                                  backgroundColor: "#fee2e2",
                                  transform: "scale(1.05)",
                                },
                                "&:disabled": {
                                  backgroundColor: "#f9fafb",
                                  color: "#9ca3af",
                                },
                              }}
                            >
                              {actionLoading === course.id ? (
                                <CircularProgress size={16} />
                              ) : (
                                <CancelIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box textAlign="center" py={8}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 3,
                    backgroundColor: "#f9fafb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <AssignmentIcon sx={{ fontSize: 32, color: "#9ca3af" }} />
                </Box>
                <Typography
                  variant="h6"
                  color="#374151"
                  mb={1}
                  fontWeight={600}
                >
                  No pending approvals
                </Typography>
                <Typography variant="body2" color="#6b7280" mb={3}>
                  All courses have been reviewed and approved
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/admin/courses/create")}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    borderColor: "#e5e7eb",
                    color: "#4f46e5",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#4f46e5",
                      backgroundColor: "#f8faff",
                    },
                  }}
                >
                  Create First Course
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Fade>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {confirmDialog.type === "approve"
            ? "Approve Course"
            : "Reject Course"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {confirmDialog.type} the course "
            {confirmDialog.courseName}"?
            {confirmDialog.type === "approve"
              ? " This will make it visible to students."
              : " This will prevent it from being published."}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={closeConfirmDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleCourseAction(confirmDialog.courseId, confirmDialog.type)
            }
            variant="contained"
            color={confirmDialog.type === "approve" ? "success" : "error"}
            disabled={actionLoading === confirmDialog.courseId}
          >
            {actionLoading === confirmDialog.courseId ? (
              <CircularProgress size={20} />
            ) : confirmDialog.type === "approve" ? (
              "Approve"
            ) : (
              "Reject"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
    </>
  );
};

export default PendingCoursesComponent;
