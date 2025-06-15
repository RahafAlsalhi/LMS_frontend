import React, { useState } from "react";
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
} from "@mui/material";
import {
  Add as AddIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CreateCourseModal from "@/components/courses/CreateCourseModal";
const InstructorDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Sample data - replace with actual API calls
  const [myCourses] = useState([
    {
      id: 1,
      title: "Full Stack Web Development",
      students: 234,
      status: "published",
      rating: 4.8,
      revenue: "$2,340",
      lastUpdated: "2 days ago",
      enrollments: 15,
    },
    {
      id: 2,
      title: "Advanced JavaScript Concepts",
      students: 156,
      status: "published",
      rating: 4.9,
      revenue: "$1,560",
      lastUpdated: "1 week ago",
      enrollments: 8,
    },
    {
      id: 3,
      title: "React.js Masterclass",
      students: 89,
      status: "draft",
      rating: 0,
      revenue: "$0",
      lastUpdated: "3 days ago",
      enrollments: 0,
    },
  ]);

  const [recentStudents] = useState([
    {
      name: "Ahmed Hassan",
      course: "Full Stack Web Development",
      progress: 65,
      lastActive: "2 hours ago",
      avatar: "AH",
    },
    {
      name: "Sarah Johnson",
      course: "Advanced JavaScript",
      progress: 90,
      lastActive: "1 day ago",
      avatar: "SJ",
    },
    {
      name: "David Kim",
      course: "Full Stack Web Development",
      progress: 45,
      lastActive: "3 hours ago",
      avatar: "DK",
    },
    {
      name: "Maria Rodriguez",
      course: "Advanced JavaScript",
      progress: 78,
      lastActive: "5 hours ago",
      avatar: "MR",
    },
  ]);

  const stats = [
    {
      title: "Total Students",
      value: "479",
      change: "+12%",
      icon: <PeopleIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      color: "primary",
    },
    {
      title: "Active Courses",
      value: "3",
      change: "+1",
      icon: <SchoolIcon sx={{ fontSize: 40, color: "success.main" }} />,
      color: "success",
    },
    {
      title: "Total Revenue",
      value: "$3,900",
      change: "+8%",
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "warning.main" }} />,
      color: "warning",
    },
    {
      title: "Avg. Rating",
      value: "4.85",
      change: "+0.2",
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: "info.main" }} />,
      color: "info",
    },
  ];

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
          <div>
            <Typography variant="h3" fontWeight={700} mb={1}>
              Instructor Dashboard 👨‍🏫
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage your courses and track student progress.
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
            onClick={() => navigate("/instructor/courses/create")}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              background:
                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
              boxShadow: "0 10px 20px rgba(99, 102, 241, 0.3)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #5b54f0 0%, #7c3aed 50%, #c333e8 100%)",
                boxShadow: "0 15px 30px rgba(99, 102, 241, 0.4)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            Create New Course
          </Button>
        </Box>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 3,
                border: "1px solid #f0f0f0",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  borderColor: `${stat.color}.200`,
                },
              }}
            >
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: 2.5,
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
              <Chip
                label={stat.change}
                size="small"
                color="success"
                variant="outlined"
                sx={{ borderRadius: 1.5 }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* My Courses */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 4, borderRadius: 3, border: "1px solid #f0f0f0" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h5" fontWeight={600}>
                My Courses
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => navigate("/instructor/courses/create")}
                sx={{
                  borderRadius: 2,
                  borderColor: "#e5e7eb",
                  color: "#6366f1",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#6366f1",
                    backgroundColor: "#f8faff",
                  },
                }}
              >
                Create Course
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                      Course
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 600, color: "#6b7280" }}
                    >
                      Students
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 600, color: "#6b7280" }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 600, color: "#6b7280" }}
                    >
                      Rating
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 600, color: "#6b7280" }}
                    >
                      Revenue
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 600, color: "#6b7280" }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myCourses.map((course) => (
                    <TableRow
                      key={course.id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f9fafb",
                        },
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight={600} mb={0.5}>
                            {course.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Updated {course.lastUpdated}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={500}>
                          {course.students}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={course.status}
                          size="small"
                          color={
                            course.status === "published"
                              ? "success"
                              : "warning"
                          }
                          variant="outlined"
                          sx={{ borderRadius: 1.5, fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={500}>
                          {course.rating > 0 ? `⭐ ${course.rating}` : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="success.main"
                        >
                          {course.revenue}
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
                            onClick={() => navigate(`/courses/${course.id}`)}
                            sx={{
                              backgroundColor: "#f0fdf4",
                              color: "#16a34a",
                              "&:hover": {
                                backgroundColor: "#dcfce7",
                                transform: "scale(1.05)",
                              },
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              navigate(`/instructor/courses/${course.id}/edit`)
                            }
                            sx={{
                              backgroundColor: "#fef3c7",
                              color: "#d97706",
                              "&:hover": {
                                backgroundColor: "#fde68a",
                                transform: "scale(1.05)",
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              navigate(
                                `/instructor/courses/${course.id}/analytics`
                              )
                            }
                            sx={{
                              backgroundColor: "#f0f9ff",
                              color: "#0284c7",
                              "&:hover": {
                                backgroundColor: "#e0f2fe",
                                transform: "scale(1.05)",
                              },
                            }}
                          >
                            <AnalyticsIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Students */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 4, borderRadius: 3, border: "1px solid #f0f0f0" }}>
            <Typography variant="h5" fontWeight={600} mb={3}>
              Recent Students
            </Typography>

            <Stack spacing={3}>
              {recentStudents.map((student, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2.5,
                    borderRadius: 2.5,
                    backgroundColor: "#f9fafb",
                    border: "1px solid #f0f0f0",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      backgroundColor: "primary.main",
                      fontWeight: 600,
                    }}
                  >
                    {student.avatar}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight={600} mb={0.5}>
                      {student.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mb={0.5}
                    >
                      {student.course}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 40,
                          height: 4,
                          backgroundColor: "#e5e7eb",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            width: `${student.progress}%`,
                            height: "100%",
                            backgroundColor: "#10b981",
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {student.progress}%
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {student.lastActive}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>

            <Button
              variant="text"
              fullWidth
              sx={{
                mt: 3,
                borderRadius: 2,
                color: "#6366f1",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "#f8faff",
                },
              }}
              onClick={() => navigate("/instructor/students")}
            >
              View All Students
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 4, mt: 4, borderRadius: 3, border: "1px solid #f0f0f0" }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => navigate("/instructor/courses/create")}
              sx={{
                py: 2.5,
                borderRadius: 2.5,
                borderColor: "#e5e7eb",
                color: "#6366f1",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#6366f1",
                  backgroundColor: "#f8faff",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Create Course
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AssignmentIcon />}
              onClick={() => navigate("/instructor/assignments")}
              sx={{
                py: 2.5,
                borderRadius: 2.5,
                borderColor: "#e5e7eb",
                color: "#059669",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#059669",
                  backgroundColor: "#f0fdf4",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Manage Assignments
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<PeopleIcon />}
              onClick={() => navigate("/instructor/students")}
              sx={{
                py: 2.5,
                borderRadius: 2.5,
                borderColor: "#e5e7eb",
                color: "#dc2626",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#dc2626",
                  backgroundColor: "#fef2f2",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              View Students
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AnalyticsIcon />}
              onClick={() => navigate("/instructor/analytics")}
              sx={{
                py: 2.5,
                borderRadius: 2.5,
                borderColor: "#e5e7eb",
                color: "#0284c7",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#0284c7",
                  backgroundColor: "#f0f9ff",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              View Analytics
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default InstructorDashboard;
