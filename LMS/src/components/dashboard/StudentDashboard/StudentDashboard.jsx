import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  Stack,
  Paper,
  useTheme,
} from "@mui/material";
import {
  PlayArrow as PlayIcon,
  AccessTime as TimeIcon,
  TrendingUp as ProgressIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  EmojiEvents as TrophyIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Sample data - replace with actual API calls
  const [enrolledCourses] = useState([
    {
      id: 1,
      title: "Full Stack Web Development",
      instructor: "Mr. David Kim",
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      lastAccessed: "2 hours ago",
      thumbnail: "/api/placeholder/300/200",
      category: "Computing and Informatics",
      nextLesson: "React Hooks Deep Dive",
    },
    {
      id: 2,
      title: "Business Sustainability",
      instructor: "Dr. Sarah Johnson",
      progress: 40,
      totalLessons: 18,
      completedLessons: 7,
      lastAccessed: "1 day ago",
      thumbnail: "/api/placeholder/300/200",
      category: "Business Technology",
      nextLesson: "Sustainable Business Models",
    },
    {
      id: 3,
      title: "Essential Principles",
      instructor: "Prof. Ahmed Hassan",
      progress: 85,
      totalLessons: 20,
      completedLessons: 17,
      lastAccessed: "3 hours ago",
      thumbnail: "/api/placeholder/300/200",
      category: "Business Technology",
      nextLesson: "Final Project Setup",
    },
  ]);

  const [recentActivity] = useState([
    {
      type: "lesson_completed",
      title: "JavaScript ES6 Features",
      course: "Full Stack Web Development",
      time: "2 hours ago",
      icon: <SchoolIcon color="primary" />,
    },
    {
      type: "assignment_submitted",
      title: "React Component Assignment",
      course: "Full Stack Web Development",
      time: "1 day ago",
      icon: <AssignmentIcon color="success" />,
    },
    {
      type: "certificate_earned",
      title: "HTML & CSS Fundamentals",
      course: "Web Development Basics",
      time: "3 days ago",
      icon: <TrophyIcon color="warning" />,
    },
  ]);

  const stats = [
    {
      title: "Enrolled Courses",
      value: "3",
      icon: <SchoolIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      color: "primary",
    },
    {
      title: "Completed Lessons",
      value: "40",
      icon: <PlayIcon sx={{ fontSize: 40, color: "success.main" }} />,
      color: "success",
    },
    {
      title: "Certificates Earned",
      value: "2",
      icon: <TrophyIcon sx={{ fontSize: 40, color: "warning.main" }} />,
      color: "warning",
    },
    {
      title: "Study Hours",
      value: "127",
      icon: <TimeIcon sx={{ fontSize: 40, color: "info.main" }} />,
      color: "info",
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" fontWeight={700} mb={1}>
          Welcome back! 👋
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Continue your learning journey and achieve your goals.
        </Typography>
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
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
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
              <Button variant="outlined" onClick={() => navigate("/courses")}>
                Browse More
              </Button>
            </Box>

            <Grid container spacing={3}>
              {enrolledCourses.map((course) => (
                <Grid item xs={12} md={6} key={course.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        height: 150,
                        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        position: "relative",
                      }}
                    >
                      <PlayIcon sx={{ fontSize: 50 }} />
                      <Chip
                        label={course.category}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          color: "white",
                        }}
                      />
                    </CardMedia>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={1}>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        By {course.instructor}
                      </Typography>

                      <Box mb={2}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mb={1}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {course.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={course.progress}
                          sx={{
                            height: 8,
                            borderRadius: 1,
                            backgroundColor: "grey.200",
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {course.completedLessons} of {course.totalLessons}{" "}
                          lessons completed
                        </Typography>
                      </Box>

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="caption" color="text.secondary">
                          Last accessed: {course.lastAccessed}
                        </Typography>
                        <Button size="small" variant="contained">
                          Continue
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={600} mb={3}>
              Recent Activity
            </Typography>

            <Stack spacing={3}>
              {recentActivity.map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
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
                      backgroundColor: "background.paper",
                    }}
                  >
                    {activity.icon}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight={600} mb={0.5}>
                      {activity.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {activity.course}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>

            <Button
              variant="text"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate("/profile/activity")}
            >
              View All Activity
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
              startIcon={<SchoolIcon />}
              onClick={() => navigate("/courses")}
              sx={{ py: 2 }}
            >
              Browse Courses
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
              View Assignments
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<TrophyIcon />}
              onClick={() => navigate("/certificates")}
              sx={{ py: 2 }}
            >
              My Certificates
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<ProgressIcon />}
              onClick={() => navigate("/progress")}
              sx={{ py: 2 }}
            >
              Track Progress
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default StudentDashboard;
