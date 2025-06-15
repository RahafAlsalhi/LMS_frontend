import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Stack,
  Alert,
  Snackbar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  useTheme,
  alpha,
  Fade,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  ViewList as TableViewIcon,
  ViewModule as CardViewIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import adminAPI from "../../../services/adminAPI";

const GetAllUsers = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users function
  const fetchUsers = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await adminAPI.getAllUsers();

      if (response.success) {
        setUsers(response.data);
        showSnackbar(`Successfully loaded ${response.data.length} users`);
      } else {
        showSnackbar("Failed to fetch users", "error");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showSnackbar("Error loading users", "error");
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

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.is_active) ||
      (statusFilter === "inactive" && !user.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get unique roles for filter dropdown
  const availableRoles = [...new Set(users.map((user) => user.role))];

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
            <Typography variant="h6" color="text.secondary" mb={2}>
              Loading users...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        {/* Header: Title + Refresh Button */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
          mb={2}
        >
          <Box>
            <Typography variant="h3" fontWeight={700} mb={1}>
              All Users 👥
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage and view all registered users in the system
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={refreshing ? null : <RefreshIcon />}
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
            fullWidth={true}
            sx={{
              minWidth: { xs: "100%", sm: 120 },
              alignSelf: { xs: "stretch", sm: "auto" },
            }}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {users.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Users
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {users.filter((user) => user.is_active).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Users
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {users.filter((user) => user.role === "instructor").length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Instructors
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={700} color="info.main">
                {users.filter((user) => user.role === "student").length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Students
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

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
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              fullWidth
              label="Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="all">All Roles</option>
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <IconButton
                color={viewMode === "table" ? "primary" : "default"}
                onClick={() => setViewMode("table")}
              >
                <TableViewIcon />
              </IconButton>
              <IconButton
                color={viewMode === "card" ? "primary" : "default"}
                onClick={() => setViewMode("card")}
              >
                <CardViewIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Display */}
      {viewMode === "table" ? (
        /* Table View */
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="center">Role</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user, index) => (
                  <TableRow hover key={user.email + index}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={user.avatar_url}
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: theme.palette.primary.main,
                          }}
                        >
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {user.name || "Unknown"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={user.role?.toUpperCase()}
                        size="small"
                        color={adminAPI.getRoleColor(user.role)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={
                          user.is_active ? <ActiveIcon /> : <InactiveIcon />
                        }
                        label={user.is_active ? "Active" : "Inactive"}
                        size="small"
                        color={user.is_active ? "success" : "default"}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        /* Card View */
        <Box>
          <Grid container spacing={3}>
            {paginatedUsers.map((user, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={user.email + index}>
                <Fade in timeout={300 + index * 100}>
                  <Card
                    sx={{
                      p: 3,
                      textAlign: "center",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <Avatar
                      src={user.avatar_url}
                      sx={{
                        width: 60,
                        height: 60,
                        mx: "auto",
                        mb: 2,
                        backgroundColor: theme.palette.primary.main,
                      }}
                    >
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>

                    <Typography variant="h6" fontWeight={600} mb={1}>
                      {user.name || "Unknown"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {user.email}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                      mb={2}
                    >
                      <Chip
                        label={user.role?.toUpperCase()}
                        size="small"
                        color={adminAPI.getRoleColor(user.role)}
                        variant="outlined"
                      />
                      <Chip
                        label={user.is_active ? "Active" : "Inactive"}
                        size="small"
                        color={user.is_active ? "success" : "default"}
                        variant="outlined"
                      />
                    </Stack>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>

          {/* Pagination for Card View */}
          <Box display="flex" justifyContent="center" mt={4}>
            <TablePagination
              rowsPerPageOptions={[8, 12, 24, 48]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Box>
      )}

      {/* No users found */}
      {filteredUsers.length === 0 && !loading && (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <PersonIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={1}>
            No users found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || roleFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "No users have been registered yet"}
          </Typography>
        </Paper>
      )}

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

export default GetAllUsers;
