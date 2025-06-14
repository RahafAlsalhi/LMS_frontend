import React from "react";
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
  Fade,
  Grow,
  Divider,
  CircularProgress,
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
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Category as CategoryIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminAPI from "../../../services/adminAPI";
import {
  FullScreenLoader,
  InlineLoader,
  CardLoader,
} from "../../common/LoadingSpinner/LoadingSpinner";
import RecentUsersComponent from "./RecentUsers";
import RecentCategoriesComponent from "./RecentCategories";
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
  const [actionLoading, setActionLoading] = useState(null);
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
      setActionLoading(courseId);

      let response;
      if (action === "approve") {
        response = await adminAPI.approveCourse(courseId);
      } else if (action === "reject") {
        response = await adminAPI.rejectCourse(courseId);
      }

      if (response.success) {
        // Remove the course from the current dashboard data
        setDashboardData((prev) => ({
          ...prev,
          courses: prev.courses.filter((course) => course.id !== courseId),
          stats: {
            ...prev.stats,
            pendingApprovals: prev.stats.pendingApprovals - 1,
          },
        }));

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
    }
  };

  // Statistics data for cards
  const calculateTrend = (current, recent, type = "number") => {
    if (type === "percentage") {
      if (current >= 95) return "Excellent";
      if (current >= 80) return "Good";
      if (current >= 60) return "Fair";
      return "Needs Attention";
    }

    if (recent > 0) {
      return `+${recent} this week`;
    }
    return "No recent activity";
  };

  const getHealthStatus = (stats) => {
    // Calculate system health based on various factors
    let healthScore = 100;

    // Deduct points for pending approvals
    if (stats.pendingApprovals > 10) healthScore -= 20;
    else if (stats.pendingApprovals > 5) healthScore -= 10;
    else if (stats.pendingApprovals > 0) healthScore -= 5;

    // Deduct points if no recent activity
    if (stats.recentUsers === 0) healthScore -= 10;
    if (stats.recentCourses === 0) healthScore -= 10;

    // Boost score for active users and courses
    if (stats.activeCourses > stats.totalCourses * 0.8) healthScore += 5;
    if (stats.students > 50) healthScore += 5;

    return Math.max(60, Math.min(100, healthScore)); // Keep between 60-100%
  };

  // Statistics data for cards with real backend data
  const statsData = [
    {
      title: "Total Users",
      value: loading
        ? "..."
        : (dashboardData?.stats?.totalUsers || 0).toLocaleString(),
      subtitle: loading
        ? "Loading..."
        : `${dashboardData?.stats?.students || 0} Students • ${
            dashboardData?.stats?.instructors || 0
          } Instructors`,
      icon: <PeopleIcon />,
      color: "#2563eb",
      bgColor: "#eff6ff",
      trend: loading
        ? "..."
        : calculateTrend(
            dashboardData?.stats?.totalUsers || 0,
            dashboardData?.stats?.recentUsers || 0
          ),
    },
    {
      title: "Active Courses",
      value: loading
        ? "..."
        : (dashboardData?.stats?.activeCourses || 0).toString(),
      subtitle: loading
        ? "Loading..."
        : `${dashboardData?.stats?.totalCourses || 0} Total Courses`,
      icon: <SchoolIcon />,
      color: "#16a34a",
      bgColor: "#f0fdf4",
      trend: loading
        ? "..."
        : calculateTrend(
            dashboardData?.stats?.activeCourses || 0,
            dashboardData?.stats?.recentCourses || 0
          ),
    },
    {
      title: "Pending Approvals",
      value: loading
        ? "..."
        : (dashboardData?.stats?.pendingApprovals || 0).toString(),
      subtitle: loading
        ? "Loading..."
        : dashboardData?.stats?.pendingApprovals > 0
        ? `${dashboardData.stats.pendingApprovals} need${
            dashboardData.stats.pendingApprovals === 1 ? "s" : ""
          } attention`
        : "All caught up!",
      icon: <AssignmentIcon />,
      color:
        (dashboardData?.stats?.pendingApprovals || 0) > 0
          ? "#d97706"
          : "#16a34a",
      bgColor:
        (dashboardData?.stats?.pendingApprovals || 0) > 0
          ? "#fffbeb"
          : "#f0fdf4",
      trend: loading
        ? "..."
        : (dashboardData?.stats?.pendingApprovals || 0) > 0
        ? "Needs Review"
        : "Up to Date",
    },
    {
      title: "System Health",
      value: loading
        ? "..."
        : `${getHealthStatus(dashboardData?.stats || {})}%`,
      subtitle: loading
        ? "Loading..."
        : (() => {
            const health = getHealthStatus(dashboardData?.stats || {});
            if (health >= 95) return "All systems optimal";
            if (health >= 85) return "Systems running well";
            if (health >= 75) return "Minor issues detected";
            return "Needs attention";
          })(),
      icon: <SecurityIcon />,
      color: loading
        ? "#6b7280"
        : (() => {
            const health = getHealthStatus(dashboardData?.stats || {});
            if (health >= 90) return "#16a34a"; // Green
            if (health >= 75) return "#d97706"; // Amber
            return "#dc2626"; // Red
          })(),
      bgColor: loading
        ? "#f9fafb"
        : (() => {
            const health = getHealthStatus(dashboardData?.stats || {});
            if (health >= 90) return "#f0fdf4"; // Green bg
            if (health >= 75) return "#fffbeb"; // Amber bg
            return "#fef2f2"; // Red bg
          })(),
      trend: loading
        ? "..."
        : calculateTrend(
            getHealthStatus(dashboardData?.stats || {}),
            0,
            "percentage"
          ),
    },
  ];

  // Show full screen loader for initial load
  if (loading) {
    return <FullScreenLoader message="Loading dashboard..." />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,rgb(95, 180, 219) 0%,rgb(88, 119, 221) 100%)",
        pb: 4,
      }}
    >
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        {/* Header Section */}
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 4,
              p: { xs: 2, sm: 4 },
              mb: 4,
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={2}
            >
              {/* Title Section */}
              <Box>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 1,
                      background:
                        "linear-gradient(135deg,rgb(140, 174, 236) 0%,rgb(99, 138, 245) 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DashboardIcon sx={{ color: "white", fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight={800}
                      sx={{
                        background:
                          "linear-gradient(135deg,rgb(102, 192, 234) 0%,rgb(125, 114, 218) 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Admin Dashboard
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={400}
                    >
                      Monitor platform performance and manage operations
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Refresh Button */}
              <Stack
                direction="row"
                spacing={2}
                width={{ xs: "100%", sm: "auto" }}
                justifyContent={{ xs: "flex-end", sm: "initial" }}
              >
                <Button
                  fullWidth={true}
                  variant="outlined"
                  startIcon={
                    refreshing ? <InlineLoader size={16} /> : <RefreshIcon />
                  }
                  onClick={() => fetchDashboardData(false)}
                  disabled={refreshing}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    borderColor: "rgba(102, 126, 234, 0.3)",
                    color: "#667eea",
                    "&:hover": {
                      borderColor: "#667eea",
                      background: "rgba(102, 126, 234, 0.1)",
                    },
                  }}
                >
                  {refreshing ? "Refreshing..." : "Refresh"}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Fade>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4} justifyContent="center">
          {statsData.map((stat, index) => (
            <Grid
              item
              key={index}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{
                display: "flex",
                justifyContent: "center", // ensures consistent alignment
              }}
            >
              <Grow in timeout={600 + index * 200} style={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 280,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      flexGrow: 1,
                      height: "100%",
                      borderRadius: 2,
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      overflow: "hidden",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: `linear-gradient(90deg, ${stat.color}, ${stat.color}aa)`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Box
                        display="flex"
                        alignItems="flex-start"
                        justifyContent="space-between"
                        mb={2}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 3,
                            backgroundColor: stat.bgColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: stat.color,
                          }}
                        >
                          {React.cloneElement(stat.icon, {
                            sx: { fontSize: 28 },
                          })}
                        </Box>
                        <Chip
                          label={stat.trend}
                          size="small"
                          sx={{
                            backgroundColor: stat.bgColor,
                            color: stat.color,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        />
                      </Box>

                      <Typography
                        variant="h3"
                        fontWeight={700}
                        mb={1}
                        color="#1a1a1a"
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="#1a1a1a"
                        mb={0.5}
                      >
                        {stat.title}
                      </Typography>
                      <Typography variant="caption" color="#6b7280">
                        {stat.subtitle}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* Pending Course Approvals - Full Width */}
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
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  width={{ xs: "100%", sm: "auto" }}
                >
                  <Button
                    fullWidth
                    variant="contained"
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
                    fullWidth
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

            <Box sx={{ p: 4, display: { xs: "none", sm: "block" } }}>
              {refreshing ? (
                <InlineLoader message="Loading courses..." height="200px" />
              ) : dashboardData.courses && dashboardData.courses.length > 0 ? (
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
                      {dashboardData.courses.map((course) => (
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
                                  {course.description?.substring(0, 80)}...
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
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              color="#374151"
                            >
                              {course.instructor_name || "Unknown"}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={
                                course.category_name ||
                                course.category ||
                                "No Category"
                              }
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
                                disabled={actionLoading === course.id}
                                onClick={() =>
                                  handleApproveCourse(course.id, "approve")
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
                                  handleApproveCourse(course.id, "reject")
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
        {/* Categories Overview - Full Width */}
        <RecentCategoriesComponent navigate={navigate} />

        {/* Recent Users - Full Width */}

        <RecentUsersComponent navigate={navigate} />

        {/* Quick Actions */}
        <Fade in timeout={1400}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              background: "white",
              border: "1px solid #f0f0f0",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <Box sx={{ p: 4, borderBottom: "1px solid #f5f5f5" }}>
              <Box display="flex" alignItems="center" gap={3}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    backgroundColor: "#fef7ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#a855f7",
                  }}
                >
                  <SettingsIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    color="#1a1a1a"
                    mb={0.5}
                  >
                    Quick Actions
                  </Typography>
                  <Typography variant="body2" color="#6b7280">
                    Common administrative tasks and shortcuts
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: 4 }}>
              <Grid container spacing={3}>
                {[
                  {
                    label: "Manage Users",
                    icon: <PeopleIcon />,
                    path: "/admin/users",
                    color: "#2563eb",
                    bg: "#eff6ff",
                  },
                  {
                    label: "Review Courses",
                    icon: <SchoolIcon />,
                    path: "/admin/courses",
                    color: "#16a34a",
                    bg: "#f0fdf4",
                  },
                ].map((action, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={action.icon}
                      onClick={() => navigate(action.path)}
                      sx={{
                        py: 3,
                        borderRadius: 2.5,
                        borderColor: "transparent",
                        color: action.color,
                        backgroundColor: action.bg,
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: action.bg,
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                          borderColor: "transparent",
                        },
                      }}
                    >
                      {action.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Fade>
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

export default AdminDashboard;
