// src/components/courses/CourseCard.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
  IconButton,
  Stack,
  Tooltip,
  Rating,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Schedule as PendingIcon,
  School as CourseIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  PlayArrow as PlayIcon,
} from "@mui/icons-material";
import courseService from "../../services/courseService";

const CourseCard = ({
  course,
  userRole = "student",
  currentUser = null,
  showActions = true,
  onEdit = null,
  onDelete = null,
  onApprove = null,
  onReject = null,
  onView = null,
  onClick = null,
  variant = "default", // 'default', 'compact', 'detailed'
  loading = false,
}) => {
  // Check if current user can edit this course
  const canEdit =
    userRole === "admin" ||
    (userRole === "instructor" && course.instructor_id === currentUser?.id);

  // Check if current user can approve/reject
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
          icon: <PendingIcon />,
          label: "PENDING",
        };
    }
  };

  const statusConfig = getStatusConfig(course.approval_status);

  // Handle card click
  const handleCardClick = (e) => {
    // Don't trigger if clicking on action buttons
    if (e.target.closest("button") || e.target.closest('[role="button"]')) {
      return;
    }

    if (onClick) {
      onClick(course);
    }
  };

  // Render action buttons based on user role
  const renderActionButtons = () => {
    if (!showActions) return null;

    const actions = [];

    // View button (always available)
    if (onView) {
      actions.push(
        <Tooltip key="view" title="View Details">
          <IconButton
            size="small"
            color="primary"
            onClick={() => onView(course)}
            disabled={loading}
          >
            <ViewIcon />
          </IconButton>
        </Tooltip>
      );
    }

    // Edit button (owner or admin)
    if (canEdit && onEdit) {
      actions.push(
        <Tooltip key="edit" title="Edit Course">
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(course)}
            disabled={loading}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      );
    }

    // Delete button (owner or admin)
    if (canEdit && onDelete) {
      actions.push(
        <Tooltip key="delete" title="Delete Course">
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(course.id, course.title)}
            disabled={loading}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      );
    }

    // Approve/Reject buttons (admin only, pending courses)
    if (canModerate) {
      if (onApprove) {
        actions.push(
          <Tooltip key="approve" title="Approve Course">
            <IconButton
              size="small"
              color="success"
              onClick={() => onApprove(course.id, course.title)}
              disabled={loading}
            >
              <ApproveIcon />
            </IconButton>
          </Tooltip>
        );
      }

      if (onReject) {
        actions.push(
          <Tooltip key="reject" title="Reject Course">
            <IconButton
              size="small"
              color="error"
              onClick={() => onReject(course.id, course.title)}
              disabled={loading}
            >
              <RejectIcon />
            </IconButton>
          </Tooltip>
        );
      }
    }

    return actions.length > 0 ? (
      <Stack direction="row" spacing={0.5}>
        {actions}
      </Stack>
    ) : null;
  };

  // Compact variant for dashboard/sidebar
  if (variant === "compact") {
    return (
      <Card
        sx={{
          cursor: onClick ? "pointer" : "default",
          transition: "all 0.2s",
          "&:hover": onClick
            ? {
                transform: "translateY(-2px)",
                boxShadow: 2,
              }
            : {},
        }}
        onClick={handleCardClick}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Box display="flex" gap={2}>
            <Avatar
              variant="rounded"
              src={course.thumbnail_url}
              sx={{ width: 48, height: 48, backgroundColor: "grey.200" }}
            >
              <CourseIcon />
            </Avatar>
            <Box flex={1} minWidth={0}>
              <Typography variant="subtitle2" fontWeight={600} noWrap mb={0.5}>
                {course.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={1}
              >
                {course.instructor_name}
              </Typography>
              <Chip
                {...statusConfig}
                size="small"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s",
        "&:hover": onClick
          ? {
              transform: "translateY(-4px)",
              boxShadow: 4,
            }
          : {},
      }}
      onClick={handleCardClick}
    >
      {/* Course Image */}
      <CardMedia
        component="div"
        sx={{
          height: 200,
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
          <CourseIcon sx={{ fontSize: 64, color: "grey.400" }} />
        )}

        {/* Status Badge */}
        <Box position="absolute" top={8} right={8}>
          <Chip {...statusConfig} size="small" sx={{ fontWeight: 600 }} />
        </Box>

        {/* Play Icon Overlay for Videos */}
        {course.content_type === "video" && onClick && (
          <Box
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              opacity: 0,
              transition: "opacity 0.2s",
              "&:hover": { opacity: 1 },
            }}
          >
            <PlayIcon sx={{ fontSize: 48, color: "white" }} />
          </Box>
        )}
      </CardMedia>

      {/* Course Content */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Title */}
        <Typography
          variant="h6"
          component="h3"
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

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          mb={2}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {course.description || "No description available"}
        </Typography>

        {/* Course Meta Information */}
        <Stack spacing={1} mb={2}>
          {/* Instructor */}
          {userRole === "admin" && (
            <Box display="flex" alignItems="center" gap={1}>
              <PersonIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {course.instructor_name || "Unknown"}
              </Typography>
            </Box>
          )}

          {/* Category */}
          {course.category_name && (
            <Chip
              label={course.category_name}
              size="small"
              variant="outlined"
              sx={{ width: "fit-content" }}
            />
          )}

          {/* Duration */}
          {course.estimated_duration && (
            <Box display="flex" alignItems="center" gap={1}>
              <TimeIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {courseService.formatDuration(course.estimated_duration)}
              </Typography>
            </Box>
          )}

          {/* Difficulty Level */}
          {course.difficulty_level && (
            <Chip
              label={course.difficulty_level.toUpperCase()}
              size="small"
              color={courseService.getDifficultyColor(course.difficulty_level)}
              sx={{ width: "fit-content" }}
            />
          )}

          {/* Rating (if available) */}
          {course.average_rating && (
            <Box display="flex" alignItems="center" gap={1}>
              <Rating
                value={course.average_rating}
                precision={0.1}
                size="small"
                readOnly
              />
              <Typography variant="caption" color="text.secondary">
                ({course.total_reviews || 0} reviews)
              </Typography>
            </Box>
          )}

          {/* Enrollment Count */}
          {course.total_enrollments !== undefined && (
            <Typography variant="caption" color="text.secondary">
              {course.total_enrollments} students enrolled
            </Typography>
          )}
        </Stack>

        {/* Price */}
        {course.price !== undefined && (
          <Box mb={1}>
            <Typography variant="h6" color="primary.main" fontWeight={700}>
              {courseService.formatPrice(course.price)}
            </Typography>
          </Box>
        )}

        {/* Created Date */}
        <Typography variant="caption" color="text.secondary">
          Created {courseService.formatDate(course.created_at)}
        </Typography>
      </CardContent>

      {/* Action Buttons */}
      {showActions && (
        <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
          <Box flex={1}>
            {/* Primary Action Button */}
            {userRole === "student" &&
              course.approval_status === "approved" && (
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<PlayIcon />}
                  onClick={() => onClick && onClick(course)}
                  disabled={loading}
                >
                  Start Learning
                </Button>
              )}

            {userRole === "instructor" &&
              course.instructor_id === currentUser?.id && (
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<EditIcon />}
                  onClick={() => onEdit && onEdit(course)}
                  disabled={loading}
                >
                  Manage Course
                </Button>
              )}

            {userRole === "admin" && (
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ViewIcon />}
                onClick={() => onView && onView(course)}
                disabled={loading}
              >
                View Details
              </Button>
            )}
          </Box>

          {/* Secondary Actions */}
          <Box ml={1}>{renderActionButtons()}</Box>
        </CardActions>
      )}
    </Card>
  );
};

export default CourseCard;
