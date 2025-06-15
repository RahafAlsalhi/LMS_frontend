import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Menu,
  MenuItem,
  Alert,
  Snackbar,
  Fade,
  Grow,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  ViewList as TableViewIcon,
  ViewModule as CardViewIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import categoryAPI from "../../services/categoryAPI";

const Category = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // State management
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create"); // 'create' or 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuCategory, setMenuCategory] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories function
  const fetchCategories = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await categoryAPI.getAllCategories();

      if (response.success) {
        setCategories(response.data || []);
        showSnackbar(
          `Successfully loaded ${response.data?.length || 0} categories`
        );
      } else {
        showSnackbar("Failed to fetch categories", "error");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      showSnackbar("Error loading categories", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Snackbar helper
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (category) =>
      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dialog handlers
  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setSelectedCategory(null);
    setFormData({ name: "", description: "" });
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (category) => {
    setDialogMode("edit");
    setSelectedCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
    });
    setFormErrors({});
    setDialogOpen(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCategory(null);
    setFormData({ name: "", description: "" });
    setFormErrors({});
  };

  // Form handlers
  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  const handleSubmit = async () => {
    // Validate form
    const validation = categoryAPI.validateCategoryData(formData);

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setSubmitting(true);

    try {
      if (dialogMode === "create") {
        const response = await categoryAPI.createCategory(formData);
        if (response.success) {
          showSnackbar("Category created successfully!");
          fetchCategories(false);
          handleCloseDialog();
        } else {
          showSnackbar("Failed to create category", "error");
        }
      } else {
        const response = await categoryAPI.updateCategory(
          selectedCategory.id,
          formData
        );
        if (response.success) {
          showSnackbar("Category updated successfully!");
          fetchCategories(false);
          handleCloseDialog();
        } else {
          showSnackbar("Failed to update category", "error");
        }
      }
    } catch (error) {
      console.error("Error submitting category:", error);
      showSnackbar(error.message || "Error saving category", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete handlers
  const handleOpenDeleteDialog = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await categoryAPI.deleteCategory(categoryToDelete.id);
      if (response.success) {
        showSnackbar("Category deleted successfully!");
        fetchCategories(false);
        handleCloseDeleteDialog();
      } else {
        showSnackbar("Failed to delete category", "error");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      showSnackbar(error.message || "Error deleting category", "error");
    }
  };

  // Menu handlers
  const handleOpenMenu = (event, category) => {
    setAnchorEl(event.currentTarget);
    setMenuCategory(category);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuCategory(null);
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <Box textAlign="center">
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading categories...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#f8fafc", pb: 4 }}>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        {/* Header */}
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              background: "white",
              borderRadius: 3,
              p: 4,
              mb: 4,
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={3}
            >
              <Box>
                <Box display="flex" alignItems="center" gap={3} mb={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CategoryIcon sx={{ color: "white", fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h3"
                      fontWeight={700}
                      sx={{ color: "#1a1a1a", mb: 0.5 }}
                    >
                      Categories
                    </Typography>
                    <Typography variant="h6" color="#6b7280" fontWeight={400}>
                      Manage course categories and organize content
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                width={{ xs: "100%", sm: "auto" }}
              >
                <Button
                  variant="outlined"
                  startIcon={
                    refreshing ? (
                      <CircularProgress size={16} />
                    ) : (
                      <RefreshIcon />
                    )
                  }
                  onClick={() => fetchCategories(true)}
                  disabled={refreshing}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    borderColor: "#e5e7eb",
                    color: "#4f46e5",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#4f46e5",
                      backgroundColor: "#f8faff",
                    },
                  }}
                >
                  {refreshing ? "Refreshing..." : "Refresh"}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenCreateDialog}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    fontWeight: 600,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)",
                    },
                  }}
                >
                  Add Category
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Fade>

        {/* Stats Card */}
        <Grow in timeout={1000}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              background: "white",
              border: "1px solid #f0f0f0",
              mb: 4,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" gap={3}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        backgroundColor: "#eff6ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#2563eb",
                      }}
                    >
                      <CategoryIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h3" fontWeight={700} color="#1a1a1a">
                        {categories.length}
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color="#1a1a1a"
                        mb={0.5}
                      >
                        Total Categories
                      </Typography>
                      <Typography variant="caption" color="#6b7280">
                        Active content categories
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" gap={2} alignItems="center">
                    <TextField
                      fullWidth
                      placeholder="Search categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                    <Box display="flex" gap={1}>
                      <IconButton
                        color={viewMode === "card" ? "primary" : "default"}
                        onClick={() => setViewMode("card")}
                        sx={{
                          backgroundColor:
                            viewMode === "card" ? "#eff6ff" : "transparent",
                        }}
                      >
                        <CardViewIcon />
                      </IconButton>
                      <IconButton
                        color={viewMode === "table" ? "primary" : "default"}
                        onClick={() => setViewMode("table")}
                        sx={{
                          backgroundColor:
                            viewMode === "table" ? "#eff6ff" : "transparent",
                        }}
                      >
                        <TableViewIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grow>

        {/* Categories Display */}
        {viewMode === "card" ? (
          /* Card View */
          <Box>
            {filteredCategories.length > 0 ? (
              <Grid container spacing={3}>
                {filteredCategories.map((category, index) => {
                  const colors = categoryAPI.getCategoryColor(category.name);
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={category.id || index}
                    >
                      <Fade in timeout={600 + index * 100}>
                        <Card
                          elevation={0}
                          sx={{
                            borderRadius: 3,
                            background: "white",
                            border: "1px solid #f0f0f0",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                            },
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              mb={2}
                            >
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 2.5,
                                  backgroundColor: colors.bg,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: colors.text,
                                }}
                              >
                                <CategoryIcon sx={{ fontSize: 24 }} />
                              </Box>
                              <IconButton
                                size="small"
                                onClick={(e) => handleOpenMenu(e, category)}
                                sx={{ color: "#6b7280" }}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Box>

                            <Typography
                              variant="h6"
                              fontWeight={600}
                              mb={1}
                              color="#1a1a1a"
                            >
                              {category.name}
                            </Typography>

                            {category.description && (
                              <Typography
                                variant="body2"
                                color="#6b7280"
                                mb={2}
                              >
                                {category.description.length > 80
                                  ? `${category.description.substring(
                                      0,
                                      80
                                    )}...`
                                  : category.description}
                              </Typography>
                            )}

                            <Chip
                              label="Active"
                              size="small"
                              sx={{
                                backgroundColor: "#f0fdf4",
                                color: "#16a34a",
                                fontWeight: 500,
                                fontSize: "0.75rem",
                              }}
                            />

                            {category.created_at && (
                              <Typography
                                variant="caption"
                                color="#9ca3af"
                                display="block"
                                mt={1}
                              >
                                Created{" "}
                                {categoryAPI.formatDate(category.created_at)}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Fade>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Paper sx={{ p: 8, textAlign: "center", borderRadius: 3 }}>
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
                  {searchTerm ? "No categories found" : "No categories yet"}
                </Typography>
                <Typography variant="body2" color="#6b7280" mb={3}>
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Create your first category to get started"}
                </Typography>
                {!searchTerm && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateDialog}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      background:
                        "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                      fontWeight: 600,
                    }}
                  >
                    Add First Category
                  </Button>
                )}
              </Paper>
            )}
          </Box>
        ) : (
          /* Table View */
          <Paper
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid #f0f0f0",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                    <TableCell
                      sx={{ fontWeight: 600, color: "#374151", py: 2 }}
                    >
                      Category
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 600, color: "#374151", py: 2 }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 600, color: "#374151", py: 2 }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 600, color: "#374151", py: 2 }}
                    >
                      Created
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 600, color: "#374151", py: 2 }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCategories.map((category, index) => {
                    const colors = categoryAPI.getCategoryColor(category.name);
                    return (
                      <TableRow
                        key={category.id || index}
                        hover
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f9fafb",
                          },
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                backgroundColor: colors.bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: colors.text,
                              }}
                            >
                              <CategoryIcon fontSize="small" />
                            </Box>
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              color="#1a1a1a"
                            >
                              {category.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2" color="#6b7280">
                            {category.description || "No description"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Chip
                            label="Active"
                            size="small"
                            sx={{
                              backgroundColor: "#f0fdf4",
                              color: "#16a34a",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2" color="#6b7280">
                            {categoryAPI.formatDate(category.created_at)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          <IconButton
                            size="small"
                            onClick={(e) => handleOpenMenu(e, category)}
                            sx={{ color: "#6b7280" }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredCategories.length === 0 && (
              <Box textAlign="center" py={8}>
                <CategoryIcon sx={{ fontSize: 64, color: "#9ca3af", mb: 2 }} />
                <Typography variant="h6" color="#374151" mb={1}>
                  {searchTerm ? "No categories found" : "No categories yet"}
                </Typography>
                <Typography variant="body2" color="#6b7280">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Create your first category to get started"}
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              border: "1px solid #f0f0f0",
            },
          }}
        >
          <MenuItem onClick={() => handleOpenEditDialog(menuCategory)}>
            <EditIcon fontSize="small" sx={{ mr: 1, color: "#2563eb" }} />
            Edit Category
          </MenuItem>
          <MenuItem
            onClick={() => handleOpenDeleteDialog(menuCategory)}
            sx={{ color: "#dc2626" }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete Category
          </MenuItem>
        </Menu>

        {/* Create/Edit Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            },
          }}
        >
          <DialogTitle sx={{ p: 3, pb: 1 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" fontWeight={600}>
                {dialogMode === "create"
                  ? "Create New Category"
                  : "Edit Category"}
              </Typography>
              <IconButton onClick={handleCloseDialog} sx={{ color: "#6b7280" }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Category Name"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                error={!!formErrors.name}
                helperText={formErrors.name}
                placeholder="Enter category name"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                error={!!formErrors.description}
                helperText={formErrors.description}
                placeholder="Enter category description (optional)"
                multiline
                rows={3}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              {dialogMode === "create" && (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Categories help organize courses and make them easier to find
                  for students.
                </Alert>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                borderRadius: 2,
                px: 3,
                color: "#6b7280",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} /> : null}
              sx={{
                borderRadius: 2,
                px: 4,
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                fontWeight: 600,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)",
                },
              }}
            >
              {submitting
                ? dialogMode === "create"
                  ? "Creating..."
                  : "Updating..."
                : dialogMode === "create"
                ? "Create Category"
                : "Update Category"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            },
          }}
        >
          <DialogTitle sx={{ p: 3, pb: 2 }}>
            <Typography variant="h5" fontWeight={600} color="#dc2626">
              Delete Category
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ p: 3, pt: 0 }}>
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
              This action cannot be undone. Deleting this category may affect
              associated courses.
            </Alert>
            <Typography variant="body1" color="#374151">
              Are you sure you want to delete the category "
              <strong>{categoryToDelete?.name}</strong>"?
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={handleCloseDeleteDialog}
              sx={{
                borderRadius: 2,
                px: 3,
                color: "#6b7280",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDeleteCategory}
              color="error"
              sx={{
                borderRadius: 2,
                px: 4,
                fontWeight: 600,
              }}
            >
              Delete Category
            </Button>
          </DialogActions>
        </Dialog>

        {/* Back to Dashboard Button */}
        <Box mt={4} display="flex" justifyContent="flex-start">
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/dashboard")}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              borderColor: "#e5e7eb",
              color: "#4f46e5",
              fontWeight: 500,
              "&:hover": {
                borderColor: "#4f46e5",
                backgroundColor: "#f8faff",
              },
            }}
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
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Category;
