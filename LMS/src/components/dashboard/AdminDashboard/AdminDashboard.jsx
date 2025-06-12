import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
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
  useTheme,
  IconButton,
  LinearProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  People as PeopleIcon,
  School as SchoolIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  Security as SecurityIcon,
  PersonAdd as PersonAddIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import adminAPI from "../../../services/adminAPI";
import {
  FullScreenLoader,
  InlineLoader,
  CardLoader,
} from "../../common/LoadingSpinner/LoadingSpinner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // State management
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    users: [],
    courses: [],
    stats: {
      totalUsers: 0,
      students: 0,
      instructors: 0,
      admins: 0,
      activeCourses: 0,
      pendingApprovals: 0,
    },
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Check authentication
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const isAuthenticated = await adminAPI.isAdminAuthenticated();
        if (!isAuthenticated) {
          navigate("/login");
          return;
        }
        fetchDashboardData();
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/login");
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  // Fetch dashboard data
  const fetchDashboardData = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const result = await adminAPI.getDashboardData();

      if (result.success) {
        setDashboardData(result.data);
      } else {
        showSnackbar("Failed to fetch dashboard data", "error");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showSnackbar("Error loading dashboard", "error");
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

  // Course approval actions
  const handleApproveCourse = async (courseId, action) => {
    try {
      const actionText = action === "approve" ? "approved" : "rejected";

      if (action === "approve") {
        await adminAPI.approveCourse(courseId);
      } else {
        await adminAPI.rejectCourse(courseId);
      }

      showSnackbar(`Course ${actionText} successfully!`);
      fetchDashboardData(false); // Refresh without full loader
    } catch (error) {
      console.error(`Error ${action}ing course:`, error);
      showSnackbar(`Error ${action}ing course`, "error");
    }
  };

  // Statistics data for cards
  const statsData = [
    {
      title: "Total Users",
      value: loading ? "..." : dashboardData.stats.totalUsers.toLocaleString(),
      change: `${dashboardData.stats.students} Students, ${dashboardData.stats.instructors} Instructors`,
      icon: <PeopleIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      color: "primary",
    },
    {
      title: "Active Courses",
      value: loading ? "..." : dashboardData.stats.activeCourses.toString(),
      change: `${dashboardData.stats.totalCourses} Total Courses`,
      icon: <SchoolIcon sx={{ fontSize: 40, color: "success.main" }} />,
      color: "success",
    },
    {
      title: "Pending Approvals",
      value: loading ? "..." : dashboardData.stats.pendingApprovals.toString(),
      change:
        dashboardData.stats.pendingApprovals > 0
          ? "Needs attention"
          : "All caught up!",
      icon: <AssignmentIcon sx={{ fontSize: 40, color: "warning.main" }} />,
      color: "warning",
    },
  ];

  // System metrics (mock data - you can replace with real metrics)
  const systemMetrics = [
    { label: "Server Performance", value: 92, color: "success" },
    { label: "Database Health", value: 98, color: "success" },
    { label: "User Satisfaction", value: 87, color: "warning" },
    { label: "Course Completion Rate", value: 76, color: "primary" },
  ];

  // Show full screen loader for initial load
  if (loading) {
    return <FullScreenLoader message="Loading dashboard data..." />;
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
              Admin Dashboard 👑
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Monitor platform performance and manage system operations.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={
              refreshing ? <InlineLoader size={16} /> : <RefreshIcon />
            }
            onClick={() => fetchDashboardData(false)}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </Box>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} mb={4}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
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
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: 2,
                  backgroundColor: `${stat.color}.50`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                {stat.icon}
              </Box>
              <Typography variant="h4" fontWeight={700} mb={1}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {stat.title}
              </Typography>
              <Typography
                variant="caption"
                color={
                  stat.color === "warning" ? "warning.main" : "success.main"
                }
                fontWeight={600}
              >
                {stat.change}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Pending Course Approvals */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h5" fontWeight={600}>
                Pending Course Approvals
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/courses")}
              >
                View All
              </Button>
            </Box>

            {refreshing ? (
              <InlineLoader message="Loading courses..." height="200px" />
            ) : dashboardData.courses.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Course Details</TableCell>
                      <TableCell align="center">Category</TableCell>
                      <TableCell align="center">Submitted</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.courses.map((course) => (
                      <TableRow key={course.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              {course.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {course.description?.substring(0, 80)}...
                            </Typography>
                            <Chip
                              label="Pending"
                              size="small"
                              color="warning"
                              variant="outlined"
                            />
                          </Box>
                        </TableCell>

                        <TableCell align="center">
                          <Chip
                            label={course.category}
                            size="small"
                            variant="outlined"
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
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                navigate(`/admin/courses/${course.id}`)
                              }
                            >
                              <ViewIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() =>
                                handleApproveCourse(course.id, "approve")
                              }
                            >
                              <CheckIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleApproveCourse(course.id, "reject")
                              }
                            >
                              <CancelIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  No pending course approvals at the moment.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Users */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" fontWeight={600} mb={3}>
              Recent Users
            </Typography>

            {refreshing ? (
              <CardLoader count={3} />
            ) : (
              <Stack spacing={2}>
                {dashboardData.users.map((user, index) => (
                  <Box
                    key={user.id || index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "grey.50",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "grey.100",
                      },
                    }}
                  >
                    <Avatar
                      src={user.avatar_url}
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: "primary.main",
                      }}
                    >
                      {user.name?.charAt(0)}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="body2" fontWeight={600} mb={0.5}>
                        {user.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {user.email}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
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
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}

            <Button
              variant="text"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate("/admin/GetAllUsers")}
            >
              View All Users
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* System Metrics */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          System Metrics
        </Typography>

        <Grid container spacing={3}>
          {systemMetrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" fontWeight={600}>
                    {metric.label}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {metric.value}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={metric.value}
                  color={metric.color}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: "grey.200",
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Administrative Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<PeopleIcon />}
              onClick={() => navigate("/admin/users")}
              sx={{ py: 2 }}
            >
              Manage Users
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<SchoolIcon />}
              onClick={() => navigate("/admin/courses")}
              sx={{ py: 2 }}
            >
              Review Courses
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<PersonAddIcon />}
              onClick={() => navigate("/admin/users")}
              sx={{ py: 2 }}
            >
              Add New User
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<SecurityIcon />}
              onClick={() => fetchDashboardData(false)}
              sx={{ py: 2 }}
            >
              Refresh Data
            </Button>
          </Grid>
        </Grid>
      </Paper>

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

export default AdminDashboard;
