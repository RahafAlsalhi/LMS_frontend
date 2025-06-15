import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Alert,
  Fade,
  Backdrop,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
  Divider,
  Paper,
} from "@mui/material";
import {
  Close as CloseIcon,
  School as SchoolIcon,
  CloudUpload as UploadIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Title as TitleIcon,
  AutoAwesome as SparkleIcon,
} from "@mui/icons-material";
import courseService from "../../services/coursesService";

const CreateCourseModal = ({
  open,
  onClose,
  onCourseCreated,
  instructorId = null,
  title = "Create New Course",
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail_url: "",
    category_id: "",
    instructor_id: instructorId || "",
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (open) {
      loadCategories();
      setFormData({
        title: "",
        description: "",
        thumbnail_url: "",
        category_id: "",
        instructor_id: instructorId || "",
      });
      setErrors({});
      setAlert({ show: false, message: "", severity: "success" });
    }
  }, [open, instructorId]);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const result = await courseService.getCategories();
      if (result.success) {
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      setAlert({
        show: true,
        message: "Failed to load categories",
        severity: "error",
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const validation = courseService.validateCourseData(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setAlert({
        show: true,
        message: "Please fix the errors below",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const result = await courseService.createCourse(formData);

      if (result.success) {
        setAlert({
          show: true,
          message: "Course created successfully!",
          severity: "success",
        });

        if (onCourseCreated) {
          onCourseCreated(result.data);
        }

        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        throw new Error(result.message || "Failed to create course");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      setAlert({
        show: true,
        message: error.message || "Failed to create course",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      maxHeight="90vh"
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "#ffffff",
          boxShadow:
            "0 24px 48px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          overflow: "auto",
          backdropFilter: "blur(20px)",
          border: "none",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(15, 23, 42, 0.6)",
        },
      }}
    >
      <Box>
        {/* Modern Header */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
            position: "relative",
            p: 4,
            overflow: "hidden",
          }}
        >
          {/* Animated background elements */}
          <Box
            sx={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              animation: "float 6s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                "50%": { transform: "translateY(-10px) rotate(180deg)" },
              },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -15,
              left: -15,
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.08)",
              animation: "float 8s ease-in-out infinite reverse",
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 2,
            }}
          >
            <Box display="flex" alignItems="center" gap={3}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2.5,
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <SchoolIcon sx={{ fontSize: 28, color: "white" }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "white",
                    mb: 0.5,
                    fontSize: "1.75rem",
                    letterSpacing: "-0.025em",
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "1rem",
                    fontWeight: 400,
                  }}
                >
                  Share your knowledge with the world ✨
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={handleClose}
              disabled={loading}
              sx={{
                color: "white",
                width: 48,
                height: 48,
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.2)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <CloseIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <DialogContent
          sx={{
            p: 0,
            flex: 1,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f5f9",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#cbd5e1",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#94a3b8",
            },
          }}
        >
          <Box sx={{ p: 4, pb: 6 }}>
            {/* Alert */}
            {alert.show && (
              <Fade in={alert.show}>
                <Alert
                  severity={alert.severity}
                  onClose={() => setAlert({ ...alert, show: false })}
                  sx={{
                    mb: 4,
                    borderRadius: 2,
                    border: "none",
                    fontSize: "0.95rem",
                    "& .MuiAlert-icon": {
                      fontSize: "1.25rem",
                    },
                    ...(alert.severity === "error" && {
                      background: "#fef2f2",
                      color: "#dc2626",
                      "& .MuiAlert-icon": { color: "#dc2626" },
                    }),
                    ...(alert.severity === "success" && {
                      background: "#f0fdf4",
                      color: "#16a34a",
                      "& .MuiAlert-icon": { color: "#16a34a" },
                    }),
                  }}
                >
                  {alert.message}
                </Alert>
              </Fade>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {/* Course Title */}
                <Box>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <TitleIcon sx={{ fontSize: 20, color: "white" }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600} color="#111827">
                        Course Title
                      </Typography>
                      <Typography variant="body2" color="#6b7280">
                        Create an engaging title that captures attention
                      </Typography>
                    </Box>
                  </Box>
                  <TextField
                    fullWidth
                    placeholder="e.g., Complete Web Development Bootcamp"
                    value={formData.title}
                    onChange={handleInputChange("title")}
                    error={!!errors.title}
                    helperText={errors.title}
                    disabled={loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        background: "#f9fafb",
                        fontSize: "1.1rem",
                        border: "none",
                        "& fieldset": {
                          border: "2px solid #e5e7eb",
                        },
                        "&:hover fieldset": {
                          border: "2px solid #d1d5db",
                        },
                        "&.Mui-focused fieldset": {
                          border: "2px solid #6366f1",
                        },
                        "&.Mui-focused": {
                          background: "white",
                        },
                      },
                    }}
                  />
                </Box>

                {/* Course Description */}
                <Box>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <DescriptionIcon sx={{ fontSize: 20, color: "white" }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600} color="#111827">
                        Course Description
                      </Typography>
                      <Typography variant="body2" color="#6b7280">
                        Describe what students will learn and achieve
                      </Typography>
                    </Box>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Describe the course content, learning outcomes, and what makes it unique..."
                    value={formData.description}
                    onChange={handleInputChange("description")}
                    error={!!errors.description}
                    helperText={errors.description}
                    disabled={loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        background: "#f9fafb",
                        fontSize: "1rem",
                        lineHeight: 1.6,
                        "& fieldset": {
                          border: "2px solid #e5e7eb",
                        },
                        "&:hover fieldset": {
                          border: "2px solid #d1d5db",
                        },
                        "&.Mui-focused fieldset": {
                          border: "2px solid #6366f1",
                        },
                        "&.Mui-focused": {
                          background: "white",
                        },
                      },
                    }}
                  />
                </Box>

                {/* Category Selection */}
                <Box>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #d946ef, #f59e0b)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CategoryIcon sx={{ fontSize: 20, color: "white" }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600} color="#111827">
                        Category
                      </Typography>
                      <Typography variant="body2" color="#6b7280">
                        Choose the most relevant category
                      </Typography>
                    </Box>
                  </Box>
                  <FormControl
                    fullWidth
                    error={!!errors.category_id}
                    disabled={loading || categoriesLoading}
                  >
                    <Select
                      value={formData.category_id}
                      onChange={handleInputChange("category_id")}
                      displayEmpty
                      sx={{
                        borderRadius: 3,
                        background: "#f9fafb",
                        fontSize: "1rem",
                        "& fieldset": {
                          border: "2px solid #e5e7eb",
                        },
                        "&:hover fieldset": {
                          border: "2px solid #d1d5db",
                        },
                        "&.Mui-focused fieldset": {
                          border: "2px solid #6366f1",
                        },
                        "&.Mui-focused": {
                          background: "white",
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        {categoriesLoading
                          ? "Loading categories..."
                          : "Select a category"}
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.category_id && (
                      <FormHelperText>{errors.category_id}</FormHelperText>
                    )}
                  </FormControl>
                </Box>

                {/* Thumbnail URL */}
                <Box>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <UploadIcon sx={{ fontSize: 20, color: "white" }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600} color="#111827">
                        Course Thumbnail
                      </Typography>
                      <Typography variant="body2" color="#6b7280">
                        Optional: Add a compelling course image
                      </Typography>
                    </Box>
                  </Box>
                  <TextField
                    fullWidth
                    placeholder="https://example.com/course-image.jpg"
                    value={formData.thumbnail_url}
                    onChange={handleInputChange("thumbnail_url")}
                    error={!!errors.thumbnail_url}
                    helperText={
                      errors.thumbnail_url ||
                      "Enter a URL for your course thumbnail"
                    }
                    disabled={loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        background: "#f9fafb",
                        fontSize: "1rem",
                        "& fieldset": {
                          border: "2px solid #e5e7eb",
                        },
                        "&:hover fieldset": {
                          border: "2px solid #d1d5db",
                        },
                        "&.Mui-focused fieldset": {
                          border: "2px solid #6366f1",
                        },
                        "&.Mui-focused": {
                          background: "white",
                        },
                      },
                    }}
                  />
                </Box>

                {/* Action Buttons */}
                <Box
                  pt={4}
                  sx={{
                    borderTop: "1px solid #f1f5f9",
                    mt: 4,
                    position: "sticky",
                    bottom: 0,
                    background: "white",
                    zIndex: 10,
                  }}
                >
                  <Stack direction="row" spacing={3} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={handleClose}
                      disabled={loading}
                      sx={{
                        borderRadius: 2.5,
                        px: 4,
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: 600,
                        border: "2px solid #e5e7eb",
                        color: "#6b7280",
                        "&:hover": {
                          border: "2px solid #d1d5db",
                          background: "#f9fafb",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={
                        loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <SparkleIcon />
                        )
                      }
                      sx={{
                        borderRadius: 2.5,
                        px: 6,
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: 700,
                        background:
                          "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
                        boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)",
                        border: "none",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #5b54f0 0%, #7c3aed 50%, #c333e8 100%)",
                          boxShadow: "0 15px 30px rgba(99, 102, 241, 0.4)",
                          transform: "translateY(-2px)",
                        },
                        "&:disabled": {
                          background: "#9ca3af",
                          boxShadow: "none",
                          transform: "none",
                        },
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      {loading ? "Creating Course..." : "Create Course"}
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </form>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default CreateCourseModal;
