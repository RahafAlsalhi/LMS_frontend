import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Button,
  Chip,
  Avatar,
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  useTheme,
  InputAdornment,
  Pagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  PersonAdd as PersonAddIcon,
  School as SchoolIcon,
  Person as StudentIcon,
  AdminPanelSettings as AdminIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import adminAPI from "../../services/adminAPI";
import {
  FullScreenLoader,
  InlineLoader,
  TableLoader,
} from "../common/LoadingSpinner";

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("create"); // create, edit, view
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Filter and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    avatar_url: "",
  });

  // Statistics
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    instructors: 0,
    admins: 0,
  });

  // Check authentication and fetch data
  useEffect(() => {
    if (!adminAPI.isAdminAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchUsers();
  }, [navigate]);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((user) => user.is_active === isActive);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await adminAPI.getAllUsers();

      if (result.success) {
        setUsers(result.data);
        calculateStats(result.data);
      } else {
        showSnackbar("Failed to fetch users", "error");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showSnackbar("Error fetching users", "error");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (usersData) => {
    const stats = {
      totalUsers: usersData.length,
      students: usersData.filter((user) => user.role === "student").length,
      instructors: usersData.filter((user) => user.role === "instructor")
        .length,
      admins: usersData.filter((user) => user.role === "admin").length,
    };
    setStats(stats);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Dialog handlers
  const handleOpenDialog = (mode, user = null) => {
    setDialogMode(mode);
    setSelectedUser(user);

    if (mode === "create") {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "student",
        avatar_url: "",
      });
    } else if (mode === "edit" && user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "", // Don't populate password for security
        role: user.role,
        avatar_url: user.avatar_url || "",
      });
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "student",
      avatar_url: "",
    });
  };

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // API operations
  const handleCreateUser = async () => {
    try {
      setActionLoading(true);
      const result = await adminAPI.createUser(formData);

      if (result.success) {
        showSnackbar("User created successfully!");
        fetchUsers();
        handleCloseDialog();
      } else {
        showSnackbar(result.message || "Failed to create user", "error");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      showSnackbar("Error creating user", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      setActionLoading(true);

      // Remove password field - users must change their own passwords
      const updateData = { ...formData };
      delete updateData.password;

      const result = await adminAPI.updateUser(selectedUser.id, updateData);

      if (result.success) {
        showSnackbar("User updated successfully!");
        fetchUsers();
        handleCloseDialog();
      } else {
        showSnackbar(result.message || "Failed to update user", "error");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showSnackbar("Error updating user", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(`Are you sure you want to delete user "${userName}"?`)
    ) {
      return;
    }

    try {
      setActionLoading(true);
      const result = await adminAPI.deleteUser(userId);

      if (result.success) {
        showSnackbar("User deleted successfully!");
        fetchUsers();
      } else {
        showSnackbar(result.message || "Failed to delete user", "error");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showSnackbar("Error deleting user", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Get pagination data
  const getPaginatedUsers = () => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <AdminIcon color="error" />;
      case "instructor":
        return <SchoolIcon color="primary" />;
      case "student":
      default:
        return <StudentIcon color="success" />;
    }
  };

  if (loading) {
    return <FullScreenLoader message="Loading users..." />;
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
              User Management 👥
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage students, instructors, and administrators.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => handleOpenDialog("create")}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h4" fontWeight={700} color="primary.main">
              {stats.totalUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Users
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h4" fontWeight={700} color="success.main">
              {stats.students}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Students
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h4" fontWeight={700} color="primary.main">
              {stats.instructors}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Instructors
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <Typography variant="h4" fontWeight={700} color="error.main">
              {stats.admins}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Admins
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search users..."
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
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Role"
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="student">Students</MenuItem>
                <MenuItem value="instructor">Instructors</MenuItem>
                <MenuItem value="admin">Admins</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchUsers}
              disabled={actionLoading}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Summary */}
      <Box mb={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {getPaginatedUsers().length} of {filteredUsers.length} users
          {searchTerm && ` for "${searchTerm}"`}
        </Typography>
      </Box>

      {/* Users Table */}
      <Paper sx={{ overflow: "hidden" }}>
        {actionLoading ? (
          <InlineLoader message="Processing..." height="300px" />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="center">Role</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getPaginatedUsers().map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={user.avatar_url}
                          sx={{ width: 40, height: 40 }}
                        >
                          {user.name?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={getRoleIcon(user.role)}
                        label={user.role?.toUpperCase()}
                        color={adminAPI.getRoleColor(user.role)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={user.is_active ? "Active" : "Inactive"}
                        color={user.is_active ? "success" : "default"}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog("view", user)}
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleOpenDialog("edit", user)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          disabled={user.role === "admin"} // Prevent deleting admins
                        >
                          <DeleteIcon />
                        </IconButton>
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

        {filteredUsers.length === 0 && !actionLoading && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              No users found.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Create/Edit User Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "create"
            ? "Add New User"
            : dialogMode === "edit"
            ? "Edit User"
            : "User Details"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              fullWidth
              disabled={dialogMode === "view"}
              required
            />

            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFormChange("email", e.target.value)}
              fullWidth
              disabled={dialogMode === "view"}
              required
            />

            {/* Password field only for creating new users */}
            {dialogMode === "create" && (
              <TextField
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleFormChange("password", e.target.value)}
                fullWidth
                required
                helperText="Minimum 6 characters"
              />
            )}

            {/* Security note for editing users */}
            {dialogMode === "edit" && (
              <Alert severity="info">
                For security reasons, users must change their own passwords
                through their profile settings.
              </Alert>
            )}

            <FormControl fullWidth disabled={dialogMode === "view"}>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => handleFormChange("role", e.target.value)}
                label="Role"
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="instructor">Instructor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Avatar URL (optional)"
              value={formData.avatar_url}
              onChange={(e) => handleFormChange("avatar_url", e.target.value)}
              fullWidth
              disabled={dialogMode === "view"}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={actionLoading}>
            {dialogMode === "view" ? "Close" : "Cancel"}
          </Button>
          {dialogMode === "create" && (
            <Button
              variant="contained"
              onClick={handleCreateUser}
              disabled={
                !formData.name ||
                !formData.email ||
                !formData.password ||
                actionLoading
              }
              startIcon={actionLoading ? <InlineLoader size={16} /> : null}
            >
              {actionLoading ? "Creating..." : "Create User"}
            </Button>
          )}
          {dialogMode === "edit" && (
            <Button
              variant="contained"
              onClick={handleUpdateUser}
              disabled={!formData.name || !formData.email || actionLoading}
              startIcon={actionLoading ? <InlineLoader size={16} /> : null}
            >
              {actionLoading ? "Updating..." : "Update User"}
            </Button>
          )}
        </DialogActions>
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

export default AdminUserManagement;
