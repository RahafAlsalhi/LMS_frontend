// src/components/courses/CourseDetailsDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Avatar,
  Stack,
  Divider,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  School as CourseIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  AccessTime as TimeIcon,
  CalendarToday as DateIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Language as WebIcon,
  Star as StarIcon,
  Group as StudentsIcon,
} from "@mui/icons-material";
import courseService from "../../services/courseService";

const CourseDetailsDialog = ({
  open,
  onClose,
  course,
  userRole = "student",
  currentUser = null,
  onEdit = null,
  onDelete = null,
  onApprove = null,
  onReject = null,
  loading = false,
}) => {
  if (!course) return null;

  // Permission checks
  const canEdit =
    userRole === "admin" ||
    (userRole === "instructor" && course.instructor_id === currentUser?.id);

  const canModerate =
    userRole === "admin" &&
    (!course.approval_status || course.approval_status === "pending");

  // Get status configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
      case "published":
        return {
          color: "success",
          icon: <ApproveIcon />,
          label: "APPROVED",
        };
      case "rejected":
        return {
          color: "error",
          icon: <RejectIcon />,
          label: "REJECTED",
        };
      case "pending":
      default:
        return {
          color: "warning",
          icon: <CourseIcon />,
          label: "PENDING REVIEW",
        };
    }
  };

  const statusConfig = getStatusConfig(course.approval_status);

  const handleAction = (action) => {
    switch (action) {
      case "edit":
        onEdit && onEdit(course);
        break;
      case "delete":
        onDelete && onDelete(course.id, course.title);
        break;
      case "approve":
        onApprove && onApprove(course.id, course.title);
        break;
      case "reject":
        onReject && onReject(course.id, course.title);
        break;
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "70vh" },
      }}
    >
      {/* Header */}
      <DialogTitle>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box display="flex" alignItems="center" gap={2} flex={1}>
            <Avatar
              src={course.thumbnail_url}
              sx={{
                width: 56,
                height: 56,
                backgroundColor: "primary.light",
              }}
            >
              <CourseIcon />
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5" fontWeight={600} mb={1}>
                {course.title}
              </Typography>
              <Chip {...statusConfig} size="small" sx={{ fontWeight: 600 }} />
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Course Image */}
          {course.thumbnail_url && (
            <Grid item xs={12}>
              <Card>
                <Box
                  component="img"
                  src={course.thumbnail_url}
                  alt={course.title}
                  sx={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                  }}
                />
              </Card>
            </Grid>
          )}

          {/* Course Description */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {course.description || "No description provided"}
            </Typography>
          </Grid>

          {/* Course Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Course Information
            </Typography>
            <Stack spacing={2}>
              {/* Category */}
              <Box display="flex" alignItems="center" gap={2}>
                <CategoryIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1">
                    {course.category || "Uncategorized"}
                  </Typography>
                </Box>
              </Box>

              {/* Difficulty Level */}
              {course.difficulty_level && (
                <Box display="flex" alignItems="center" gap={2}>
                  <StarIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Difficulty Level
                    </Typography>
                    <Chip
                      label={course.difficulty_level.toUpperCase()}
                      size="small"
                      color={courseService.getDifficultyColor(
                        course.difficulty_level
                      )}
                    />
                  </Box>
                </Box>
              )}

              {/* Duration */}
              {course.estimated_duration && (
                <Box display="flex" alignItems="center" gap={2}>
                  <TimeIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Estimated Duration
                    </Typography>
                    <Typography variant="body1">
                      {courseService.formatDuration(course.estimated_duration)}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Price */}
              {course.price !== undefined && (
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h6" color="primary.main">
                    💰
                  </Typography>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Price
                    </Typography>
                    <Typography
                      variant="h6"
                      color="primary.main"
                      fontWeight={600}
                    >
                      {courseService.formatPrice(course.price)}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Enrollment Count */}
              {course.total_enrollments !== undefined && (
                <Box display="flex" alignItems="center" gap={2}>
                  <StudentsIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Students Enrolled
                    </Typography>
                    <Typography variant="body1">
                      {course.total_enrollments} students
                    </Typography>
                  </Box>
                </Box>
              )}
            </Stack>
          </Grid>

          {/* Instructor & Timeline */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Instructor & Timeline
            </Typography>
            <Stack spacing={2}>
              {/* Instructor */}
              <Box display="flex" alignItems="center" gap={2}>
                <PersonIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Instructor
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {course.instructor_name || "Unknown"}
                  </Typography>
                </Box>
              </Box>

              {/* Created Date */}
              <Box display="flex" alignItems="center" gap={2}>
                <DateIcon color="action" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Created Date
                  </Typography>
                  <Typography variant="body1">
                    {courseService.formatDate(course.created_at)}
                  </Typography>
                </Box>
              </Box>

              {/* Last Updated */}
              {course.updated_at && course.updated_at !== course.created_at && (
                <Box display="flex" alignItems="center" gap={2}>
                  <DateIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">
                      {courseService.formatDate(course.updated_at)}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Approval Date */}
              {course.approved_at && (
                <Box display="flex" alignItems="center" gap={2}>
                  <ApproveIcon color="success" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Approved Date
                    </Typography>
                    <Typography variant="body1">
                      {courseService.formatDate(course.approved_at)}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Approved By */}
              {course.approved_by_name && (
                <Box display="flex" alignItems="center" gap={2}>
                  <PersonIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Approved By
                    </Typography>
                    <Typography variant="body1">
                      {course.approved_by_name}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Stack>
          </Grid>

          {/* Additional Details */}
          {(course.learning_objectives ||
            course.prerequisites ||
            course.rejection_reason) && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* Learning Objectives */}
              {course.learning_objectives && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Learning Objectives
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {course.learning_objectives}
                  </Typography>
                </Grid>
              )}

              {/* Prerequisites */}
              {course.prerequisites && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Prerequisites
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {course.prerequisites}
                  </Typography>
                </Grid>
              )}

              {/* Rejection Reason (for admin/instructor) */}
              {course.rejection_reason && (userRole === "admin" || canEdit) && (
                <Grid item xs={12}>
                  <Card
                    sx={{
                      backgroundColor: "error.light",
                      color: "error.contrastText",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Rejection Reason
                      </Typography>
                      <Typography variant="body1">
                        {course.rejection_reason}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </>
          )}

          {/* Course Statistics (for instructor/admin) */}
          {(userRole === "admin" || canEdit) && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Course Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: "center", py: 2 }}>
                        <Typography
                          variant="h4"
                          color="primary.main"
                          fontWeight={700}
                        >
                          {course.total_modules || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Modules
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: "center", py: 2 }}>
                        <Typography
                          variant="h4"
                          color="success.main"
                          fontWeight={700}
                        >
                          {course.total_lessons || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Lessons
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: "center", py: 2 }}>
                        <Typography
                          variant="h4"
                          color="info.main"
                          fontWeight={700}
                        >
                          {course.total_enrollments || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Students
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: "center", py: 2 }}>
                        <Typography
                          variant="h4"
                          color="warning.main"
                          fontWeight={700}
                        >
                          {course.avg_completion_rate
                            ? `${Math.round(course.avg_completion_rate)}%`
                            : "0%"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Completion
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box>
            <Button onClick={onClose} disabled={loading}>
              Close
            </Button>
          </Box>

          <Stack direction="row" spacing={1}>
            {/* Edit Button */}
            {canEdit && onEdit && (
              <Tooltip title="Edit Course">
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleAction("edit")}
                  disabled={loading}
                >
                  Edit
                </Button>
              </Tooltip>
            )}

            {/* Delete Button */}
            {canEdit && onDelete && (
              <Tooltip title="Delete Course">
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleAction("delete")}
                  disabled={loading}
                >
                  Delete
                </Button>
              </Tooltip>
            )}

            {/* Admin Actions */}
            {canModerate && (
              <>
                {onApprove && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<ApproveIcon />}
                    onClick={() => handleAction("approve")}
                    disabled={loading}
                  >
                    Approve Course
                  </Button>
                )}

                {onReject && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<RejectIcon />}
                    onClick={() => handleAction("reject")}
                    disabled={loading}
                  >
                    Reject Course
                  </Button>
                )}
              </>
            )}

            {/* Student Action */}
            {userRole === "student" &&
              course.approval_status === "approved" && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CourseIcon />}
                  disabled={loading}
                >
                  Enroll Now
                </Button>
              )}
          </Stack>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CourseDetailsDialog;
