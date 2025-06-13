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
  Notifications as NotificationsIcon,
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
      fetchDashboardData(false);
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
      subtitle: `${dashboardData.stats.students} Students • ${dashboardData.stats.instructors} Instructors`,
      icon: <PeopleIcon />,
      color: "#2563eb",
      bgColor: "#eff6ff",
      trend: "+12%",
    },
    {
      title: "Active Courses",
      value: loading ? "..." : dashboardData.stats.activeCourses.toString(),
      subtitle: `${dashboardData.stats.totalCourses || 0} Total Courses`,
      icon: <SchoolIcon />,
      color: "#16a34a",
      bgColor: "#f0fdf4",
      trend: "+8%",
    },
    {
      title: "Pending Approvals",
      value: loading ? "..." : dashboardData.stats.pendingApprovals.toString(),
      subtitle:
        dashboardData.stats.pendingApprovals > 0
          ? "Needs attention"
          : "All caught up!",
      icon: <AssignmentIcon />,
      color: "#d97706",
      bgColor: "#fffbeb",
      trend: dashboardData.stats.pendingApprovals > 0 ? "Urgent" : "Good",
    },
    {
      title: "System Health",
      value: "98%",
      subtitle: "All systems operational",
      icon: <SecurityIcon />,
      color: "#a855f7",
      bgColor: "#fef7ff",
      trend: "Excellent",
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
        background: "linear-gradient(135deg, #011e4c 0%,rgb(64, 40, 168) 100%)",
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
              p: 4,
              mb: 4,
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 1,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DashboardIcon sx={{ color: "white", fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h3"
                      fontWeight={800}
                      sx={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Admin Dashboard
                    </Typography>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      fontWeight={400}
                    >
                      Monitor platform performance and manage operations
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button
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
        <Grid container spacing={3} mb={4}>
          {statsData.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Grow in timeout={600 + index * 200}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    overflow: "hidden",
                    position: "relative",
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
                  <CardContent sx={{ p: 3 }}>
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
                <Button
                  variant="outlined"
                  onClick={() => navigate("Catogery")}
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
                  View All
                </Button>
              </Box>
            </Box>

            <Box sx={{ p: 4 }}>
              {refreshing ? (
                <InlineLoader message="Loading courses..." height="200px" />
              ) : dashboardData.courses.length > 0 ? (
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
                      {dashboardData.courses.map((course, index) => (
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
                                sx={{ mb: 1.5 }}
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
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={course.category}
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
                                onClick={() =>
                                  navigate(`/admin/courses/${course.id}`)
                                }
                                sx={{
                                  backgroundColor: "#eff6ff",
                                  color: "#2563eb",
                                  width: 32,
                                  height: 32,
                                  "&:hover": {
                                    backgroundColor: "#dbeafe",
                                    transform: "scale(1.05)",
                                  },
                                }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
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
                                }}
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
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
                                }}
                              >
                                <CancelIcon fontSize="small" />
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
                  <Typography variant="body2" color="#6b7280">
                    All courses have been reviewed and approved
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Fade>

        {/* Categories Overview - Full Width */}
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
                justifyContent="space-between"
                alignItems="center"
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
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/Catogery")} // This should now work
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
                  Manage Categories
                </Button>
              </Box>
            </Box>

            <Box sx={{ p: 4 }}>
              {refreshing ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress size={32} />
                </Box>
              ) : dashboardData.categories &&
                dashboardData.categories.length > 0 ? (
                <Grid container spacing={3}>
                  {dashboardData.categories
                    .slice(0, 8)
                    .map((category, index) => {
                      // Simple color assignment based on index
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
                      const color = colors[index % colors.length];

                      return (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          key={category.id || index}
                        >
                          <Box
                            sx={{
                              p: 3,
                              borderRadius: 2.5,
                              backgroundColor: "#f9fafb",
                              border: "1px solid #f3f4f6",
                              transition: "all 0.2s ease",
                              cursor: "pointer",
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
                                >
                                  {category.name}
                                </Typography>
                              </Box>
                            </Box>

                            {category.description && (
                              <Typography
                                variant="body2"
                                color="#6b7280"
                                sx={{ mb: 2 }}
                              >
                                {category.description.length > 60
                                  ? `${category.description.substring(
                                      0,
                                      60
                                    )}...`
                                  : category.description}
                              </Typography>
                            )}

                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Chip
                                label="Active"
                                size="small"
                                sx={{
                                  backgroundColor: "#f0fdf4",
                                  color: "#16a34a",
                                  fontWeight: 500,
                                  fontSize: "0.7rem",
                                  height: 20,
                                }}
                              />
                              {category.courseCount && (
                                <Typography variant="caption" color="#6b7280">
                                  {category.courseCount} courses
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      );
                    })}
                </Grid>
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
                    onClick={() => navigate("/admin/Catogery")} // This should now work
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

              {dashboardData.categories &&
                dashboardData.categories.length > 8 && (
                  <Box textAlign="center" mt={3}>
                    <Button
                      variant="text"
                      onClick={() => navigate("/admin/categories")}
                      sx={{
                        color: "#059669",
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: "#f0fdfa",
                        },
                      }}
                    >
                      View All {dashboardData.categories.length} Categories
                    </Button>
                  </Box>
                )}
            </Box>
          </Paper>
        </Fade>
        {/* Recent Users - Full Width */}
        <Fade in timeout={1200}>
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
                justifyContent="space-between"
                alignItems="center"
              >
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
                    <PeopleIcon sx={{ fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      color="#1a1a1a"
                      mb={0.5}
                    >
                      Recent Users
                    </Typography>
                    <Typography variant="body2" color="#6b7280">
                      Latest user registrations and activity
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/GetAllUsers")}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    borderColor: "#e5e7eb",
                    color: "#a855f7",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#a855f7",
                      backgroundColor: "#fef7ff",
                    },
                  }}
                >
                  View All Users
                </Button>
              </Box>
            </Box>

            <Box sx={{ p: 4 }}>
              {refreshing ? (
                <CardLoader count={3} />
              ) : (
                <Grid container spacing={3}>
                  {dashboardData.users.map((user, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={user.id || index}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2.5,
                          p: 3,
                          borderRadius: 2.5,
                          backgroundColor: "#f9fafb",
                          border: "1px solid #f3f4f6",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "#f3f4f6",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          },
                        }}
                      >
                        <Avatar
                          src={user.avatar_url}
                          sx={{
                            width: 56,
                            height: 56,
                            backgroundColor: "#a855f7",
                            fontSize: "1.25rem",
                            fontWeight: 600,
                            color: "white",
                          }}
                        >
                          {user.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Box flex={1}>
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            mb={0.5}
                            color="#1a1a1a"
                          >
                            {user.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="#6b7280"
                            mb={1.5}
                            noWrap
                          >
                            {user.email}
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Chip
                              label={user.role?.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor:
                                  user.role === "admin"
                                    ? "#fef2f2"
                                    : user.role === "instructor"
                                    ? "#fffbeb"
                                    : "#f0fdf4",
                                color:
                                  user.role === "admin"
                                    ? "#dc2626"
                                    : user.role === "instructor"
                                    ? "#d97706"
                                    : "#16a34a",
                                fontWeight: 500,
                                fontSize: "0.7rem",
                                height: 20,
                              }}
                            />
                            <Chip
                              label={user.is_active ? "Active" : "Inactive"}
                              size="small"
                              sx={{
                                backgroundColor: user.is_active
                                  ? "#f0fdf4"
                                  : "#f9fafb",
                                color: user.is_active ? "#16a34a" : "#6b7280",
                                fontWeight: 500,
                                fontSize: "0.7rem",
                                height: 20,
                              }}
                            />
                          </Stack>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}

              {dashboardData.users.length === 0 && !refreshing && (
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
                    <PeopleIcon sx={{ fontSize: 32, color: "#9ca3af" }} />
                  </Box>
                  <Typography
                    variant="h6"
                    color="#374151"
                    mb={1}
                    fontWeight={600}
                  >
                    No recent users
                  </Typography>
                  <Typography variant="body2" color="#6b7280">
                    New user registrations will appear here
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Fade>
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
                  {
                    label: "View Analytics",
                    icon: <AnalyticsIcon />,
                    path: "/admin/analytics",
                    color: "#a855f7",
                    bg: "#fef7ff",
                  },
                  {
                    label: "System Settings",
                    icon: <SettingsIcon />,
                    path: "/admin/settings",
                    color: "#d97706",
                    bg: "#fffbeb",
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
