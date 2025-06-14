import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Box,
  Typography,
  Avatar,
  Chip,
} from "@mui/material";
import {
  School as CourseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { InlineLoader } from "../common/LoadingSpinner";

const CourseFormDialog = ({
  open,
  onClose,
  onSubmit,
  mode = "create", // "create", "edit", "view"
  course = null,
  categories = [],
  loading = false,
  userRole = "instructor", // "instructor", "admin"
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail_url: "",
    category_id: "",
    instructor_id: null,
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when course changes
  useEffect(() => {
    if (course && (mode === "edit" || mode === "view")) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        thumbnail_url: course.thumbnail_url || "",
        category_id: course.category_id || "",
        instructor_id: course.instructor_id || null,
      });
    } else if (mode === "create") {
      setFormData({
        title: "",
        description: "",
        thumbnail_url: "",
        category_id: "",
        instructor_id: null,
      });
    }
    setErrors({});
  }, [course, mode, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Course title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Course title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Course description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.category_id) {
      newErrors.category_id = "Please select a category";
    }

    if (formData.thumbnail_url && !isValidUrl(formData.thumbnail_url)) {
      newErrors.thumbnail_url = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = () => {
    if (mode === "view") {
      onClose();
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Add instructor_id for backend compatibility
    const submitData = {
      ...formData,
      instructor_id:
        currentUser?.id || userRole === "admin"
          ? formData.instructor_id
          : currentUser?.id,
    };

    onSubmit(submitData);
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      thumbnail_url: "",
      category_id: "",
      instructor_id: null,
    });
    setErrors({});
    onClose();
  };

  const getDialogTitle = () => {
    switch (mode) {
      case "create":
        return "Create New Course";
      case "edit":
        return "Edit Course";
      case "view":
        return "Course Details";
      default:
        return "Course";
    }
  };

  const getSubmitButtonText = () => {
    if (loading) return "Processing...";
    switch (mode) {
      case "create":
        return "Create Course";
      case "edit":
        return "Update Course";
      default:
        return "Save";
    }
  };

  const isReadOnly = mode === "view";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            {mode === "create" ? (
              <AddIcon />
            ) : mode === "edit" ? (
              <EditIcon />
            ) : (
              <CourseIcon />
            )}
          </Avatar>
          <Box>
            <Typography variant="h6">{getDialogTitle()}</Typography>
            {course && mode === "view" && (
              <Chip
                label={course.approval_status?.toUpperCase() || "PENDING"}
                size="small"
                color={
                  course.approval_status === "approved"
                    ? "success"
                    : course.approval_status === "rejected"
                    ? "error"
                    : "warning"
                }
              />
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Course Title */}
          <Grid item xs={12}>
            <TextField
              label="Course Title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              fullWidth
              required
              disabled={isReadOnly}
              error={!!errors.title}
              helperText={errors.title}
              placeholder="Enter a descriptive course title"
            />
          </Grid>

          {/* Course Description */}
          <Grid item xs={12}>
            <TextField
              label="Course Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              fullWidth
              required
              multiline
              rows={4}
              disabled={isReadOnly}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Provide a detailed description of what students will learn"
            />
          </Grid>

          {/* Category and Thumbnail Row */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={!!errors.category_id}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category_id}
                onChange={(e) => handleChange("category_id", e.target.value)}
                label="Category"
                disabled={isReadOnly}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category_id && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, ml: 1.5 }}
                >
                  {errors.category_id}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Thumbnail URL (Optional)"
              value={formData.thumbnail_url}
              onChange={(e) => handleChange("thumbnail_url", e.target.value)}
              fullWidth
              disabled={isReadOnly}
              error={!!errors.thumbnail_url}
              helperText={
                errors.thumbnail_url || "URL to course thumbnail image"
              }
              placeholder="https://example.com/image.jpg"
            />
          </Grid>

          {/* Show instructor info in view mode */}
          {mode === "view" && course && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Instructor"
                  value={course.instructor_name || "Unknown"}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Created Date"
                  value={new Date(course.created_at).toLocaleDateString()}
                  fullWidth
                  disabled
                />
              </Grid>
            </>
          )}

          {/* Admin notice for new courses */}
          {mode === "create" && userRole === "instructor" && (
            <Grid item xs={12}>
              <Alert severity="info">
                <strong>Course Review Process:</strong> After creating your
                course, it will be submitted for admin review. You can add
                modules, lessons, and content once your course is approved.
              </Alert>
            </Grid>
          )}

          {/* Admin can approve/reject notice */}
          {mode === "view" &&
            userRole === "admin" &&
            course?.approval_status === "pending" && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  <strong>Admin Action Required:</strong> This course is pending
                  approval. You can approve or reject it from the course
                  management page.
                </Alert>
              </Grid>
            )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          {mode === "view" ? "Close" : "Cancel"}
        </Button>

        {!isReadOnly && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={
              loading ? (
                <InlineLoader size={16} />
              ) : mode === "create" ? (
                <AddIcon />
              ) : (
                <SaveIcon />
              )
            }
          >
            {getSubmitButtonText()}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CourseFormDialog;
