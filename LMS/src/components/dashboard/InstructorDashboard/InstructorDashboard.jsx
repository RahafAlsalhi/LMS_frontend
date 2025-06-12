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
            onClick={() => navigate("/courses/create")}
            sx={{ px: 3, py: 1.5 }}
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
              <Chip
                label={stat.change}
                size="small"
                color="success"
                variant="outlined"
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* My Courses */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
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
                onClick={() => navigate("/courses/create")}
              >
                Create Course
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course</TableCell>
                    <TableCell align="center">Students</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Rating</TableCell>
                    <TableCell align="center">Revenue</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myCourses.map((course) => (
                    <TableRow key={course.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {course.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Updated {course.lastUpdated}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
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
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          {course.rating > 0 ? course.rating : "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600}>
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
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              navigate(`/courses/${course.id}/edit`)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              navigate(`/courses/${course.id}/analytics`)
                            }
                          >
                            <AnalyticsIcon />
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
          <Paper sx={{ p: 3 }}>
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
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "primary.main",
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
                    >
                      {student.course}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Progress: {student.progress}% • {student.lastActive}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>

            <Button
              variant="text"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate("/students")}
            >
              View All Students
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AddIcon />}
              onClick={() => navigate("/courses/create")}
              sx={{ py: 2 }}
            >
              Create Course
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AssignmentIcon />}
              onClick={() => navigate("/assignments")}
              sx={{ py: 2 }}
            >
              Manage Assignments
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<PeopleIcon />}
              onClick={() => navigate("/students")}
              sx={{ py: 2 }}
            >
              View Students
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<AnalyticsIcon />}
              onClick={() => navigate("/analytics")}
              sx={{ py: 2 }}
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
