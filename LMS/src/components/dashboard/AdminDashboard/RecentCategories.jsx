import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Fade,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import AddIcon from "@mui/icons-material/Add";
import categoryAPI from "../../../services/categoryAPI";

const RecentCategoriesComponent = ({ navigate }) => {
  const [recentCategories, setRecentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCategoriesCount, setTotalCategoriesCount] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch recent categories when component mounts
  useEffect(() => {
    fetchRecentCategories();
  }, []);

  const fetchRecentCategories = async () => {
    try {
      setLoading(true);

      // Use the same API call as your categories page
      // Replace with your actual API method name
      const response = await categoryAPI.getAllCategories();

      if (response.success) {
        // Sort categories by creation date (newest first) and take only first 8
        const sortedCategories = response.data.sort((a, b) => {
          const dateA = new Date(
            a.created_at || a.createdAt || a.creation_date
          );
          const dateB = new Date(
            b.created_at || b.createdAt || b.creation_date
          );
          return dateB - dateA; // Newest first
        });

        const recentEight = sortedCategories.slice(0, 8);
        setRecentCategories(recentEight);
        setTotalCategoriesCount(response.data.length);

        if (recentEight.length > 0) {
          showSnackbar(`Loaded ${recentEight.length} recent categories`);
        }
      } else {
        showSnackbar("Failed to fetch recent categories", "error");
      }
    } catch (error) {
      console.error("Error fetching recent categories:", error);
      showSnackbar("Error loading recent categories", "error");
    } finally {
      setLoading(false);
    }
  };

  // Snackbar helper
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleManageCategories = () => {
    if (navigate) {
      navigate("/admin/Catogery"); // Note: keeping your original spelling
    } else {
      window.location.href = "/admin/Catogery";
    }
  };

  const handleCreateCategory = () => {
    if (navigate) {
      navigate("/admin/Catogery");
    } else {
      window.location.href = "/admin/Catogery";
    }
  };

  const formatCreationDate = (category) => {
    const dateString =
      category.created_at || category.createdAt || category.creation_date;
    if (!dateString) return "Recently";

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Color assignment for categories
  const getColorForIndex = (index) => {
    const colors = [
      { bg: "#eff6ff", text: "#2563eb" },
      { bg: "#f0fdf4", text: "#16a34a" },
      { bg: "#fef7ff", text: "#a855f7" },
      { bg: "#fffbeb", text: "#d97706" },
      { bg: "#fef2f2", text: "#dc2626" },
      { bg: "#f0fdfa", text: "#059669" },
      { bg: "#fdf4ff", text: "#c026d3" },
      { bg: "#f0f9ff", text: "#0284c7" },
    ];
    return colors[index % colors.length];
  };

  return (
    <>
      <Fade in timeout={1400}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            background: "white",
            border: "1px solid #f0f0f0",
            overflow: "hidden",
            mb: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <Box sx={{ p: 4, borderBottom: "1px solid #f5f5f5" }}>
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={{ xs: 2, sm: 0 }}
            >
              <Box display="flex" alignItems="center" gap={3}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    backgroundColor: "#f0fdfa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#059669",
                  }}
                >
                  <CategoryIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    color="#1a1a1a"
                    mb={0.5}
                  >
                    Categories Overview
                  </Typography>
                  <Typography variant="body2" color="#6b7280">
                    Course categories and content organization
                  </Typography>
                </Box>
              </Box>

              <Box width={{ xs: "100%", sm: "auto" }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleManageCategories}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    borderColor: "#e5e7eb",
                    color: "#059669",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#059669",
                      backgroundColor: "#f0fdfa",
                    },
                  }}
                >
                  Manage Categories ({totalCategoriesCount})
                </Button>
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress size={32} sx={{ color: "#059669" }} />
              </Box>
            ) : recentCategories.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {recentCategories.map((category, index) => {
                    const color = getColorForIndex(index);

                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        lg={3}
                        key={category.id || index}
                        sx={{
                          display: { xs: "none", sm: "block" },
                        }}
                      >
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: 2.5,
                            backgroundColor: "#f9fafb",
                            border: "1px solid #f3f4f6",
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            "&:hover": {
                              backgroundColor: "#f3f4f6",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            },
                          }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={2}
                            mb={2}
                          >
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                backgroundColor: color.bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: color.text,
                              }}
                            >
                              <CategoryIcon fontSize="small" />
                            </Box>
                            <Box flex={1}>
                              <Typography
                                variant="body1"
                                fontWeight={600}
                                color="#1a1a1a"
                                noWrap
                                title={category.name}
                              >
                                {category.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="#9ca3af"
                                display="block"
                              >
                                {formatCreationDate(category)}
                              </Typography>
                            </Box>
                          </Box>

                          {category.description && (
                            <Typography
                              variant="body2"
                              color="#6b7280"
                              sx={{ mb: 2, flex: 1 }}
                            >
                              {category.description.length > 60
                                ? `${category.description.substring(0, 60)}...`
                                : category.description}
                            </Typography>
                          )}

                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mt="auto"
                          >
                            <Chip
                              label={
                                category.is_active !== false
                                  ? "Active"
                                  : "Inactive"
                              }
                              size="small"
                              sx={{
                                backgroundColor:
                                  category.is_active !== false
                                    ? "#f0fdf4"
                                    : "#f9fafb",
                                color:
                                  category.is_active !== false
                                    ? "#16a34a"
                                    : "#6b7280",
                                fontWeight: 500,
                                fontSize: "0.7rem",
                                height: 20,
                              }}
                            />
                            {(category.courseCount ||
                              category.courses_count ||
                              category.course_count) && (
                              <Typography variant="caption" color="#6b7280">
                                {category.courseCount ||
                                  category.courses_count ||
                                  category.course_count}{" "}
                                courses
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>

                {totalCategoriesCount > 8 && (
                  <Box textAlign="center" mt={3}>
                    <Typography variant="body2" color="#6b7280" mb={2}>
                      Showing {recentCategories.length} of{" "}
                      {totalCategoriesCount} total categories
                    </Typography>
                    <Button
                      variant="text"
                      onClick={handleManageCategories}
                      sx={{
                        color: "#059669",
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: "#f0fdfa",
                        },
                      }}
                    >
                      View All {totalCategoriesCount} Categories
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Box textAlign="center" py={6}>
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
                  <CategoryIcon sx={{ fontSize: 32, color: "#9ca3af" }} />
                </Box>
                <Typography
                  variant="h6"
                  color="#374151"
                  mb={1}
                  fontWeight={600}
                >
                  No categories yet
                </Typography>
                <Typography variant="body2" color="#6b7280" mb={3}>
                  Create categories to organize your courses
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleCreateCategory}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    borderColor: "#e5e7eb",
                    color: "#059669",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#059669",
                      backgroundColor: "#f0fdfa",
                    },
                  }}
                >
                  Create First Category
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Fade>

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

export default RecentCategoriesComponent;
