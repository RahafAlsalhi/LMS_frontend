import React from "react";
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
  Stack,
  Avatar,
  Paper,
  useTheme,
} from "@mui/material";
import {
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  Group as GroupIcon,
  PlayArrow as PlayIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "@components/common/Layout";
import HeroSection from "@components/ui/HeroSection";

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // ✅ Get authentication state from Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Sample featured courses data
  const featuredCourses = [
    {
      id: 1,
      title: "Business Sustainability",
      category: "Business Technology",
      image: "/api/placeholder/300/200",
      instructor: "Dr. Sarah Johnson",
      duration: "6 weeks",
      students: 1245,
      rating: 4.8,
      isPurchased: true,
    },
    {
      id: 2,
      title: "Essential Principles",
      category: "Business Technology",
      image: "/api/placeholder/300/200",
      instructor: "Prof. Ahmed Hassan",
      duration: "8 weeks",
      students: 987,
      rating: 4.9,
      isPurchased: true,
    },
    {
      id: 3,
      title: "Business Analysis",
      category: "Business Technology",
      image: "/api/placeholder/300/200",
      instructor: "Dr. Maria Rodriguez",
      duration: "10 weeks",
      students: 1456,
      rating: 4.7,
      isPurchased: true,
    },
    {
      id: 4,
      title: "Full Stack Web Development",
      category: "Computing and Informatics",
      image: "/api/placeholder/300/200",
      instructor: "Mr. David Kim",
      duration: "12 weeks",
      students: 2341,
      rating: 4.9,
      isPurchased: true,
    },
  ];

  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Learn with Experts",
      description:
        "Access courses taught by industry professionals and academic experts.",
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Unlimited Access",
      description:
        "Learn at your own pace with lifetime access to course materials.",
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Learn Anywhere",
      description:
        "Access your courses from any device, anywhere in the world.",
    },
    {
      icon: <TrophyIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "High Quality Content",
      description:
        "Curated content that meets industry standards and best practices.",
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Get Certified",
      description:
        "Earn certificates upon completion to boost your professional profile.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section - ✅ Only show if not authenticated */}
      {!isAuthenticated && <HeroSection />}

      {/* ✅ Welcome back section for authenticated users */}
      {isAuthenticated && (
        <Box
          sx={{
            py: { xs: 4, md: 6 },
            background:
              "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)",
          }}
        >
          <Container maxWidth="xl">
            <Box textAlign="center">
              <Typography
                variant="h3"
                fontWeight={700}
                mb={2}
                sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
              >
                Welcome back, {user?.firstName || user?.name || "Student"}! 👋
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                mb={3}
                sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
              >
                Continue your learning journey where you left off
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/dashboard")}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 3,
                }}
              >
                Go to Dashboard
              </Button>
            </Box>
          </Container>
        </Box>
      )}

      {/* Featured Courses Section */}
      <Box
        sx={{ py: { xs: 6, md: 10 }, backgroundColor: "background.default" }}
      >
        <Container maxWidth="xl">
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h2"
              fontWeight={700}
              mb={2}
              sx={{ fontSize: { xs: "2rem", md: "2.75rem" } }}
            >
              {isAuthenticated ? "Continue Learning" : "Featured Courses"}
            </Typography>

            {/* Category Filters */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              flexWrap="wrap"
              sx={{ gap: 1, mb: 4 }}
            >
              {[
                "ALL COURSES",
                "BUSINESS",
                "TECHNOLOGY",
                "COMPUTING AND INFORMATICS",
                "ENGINEERING",
              ].map((category) => (
                <Chip
                  key={category}
                  label={category}
                  variant={category === "ALL COURSES" ? "filled" : "outlined"}
                  color={category === "ALL COURSES" ? "primary" : "default"}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    "&:hover": {
                      backgroundColor:
                        category === "ALL COURSES"
                          ? "primary.dark"
                          : "primary.50",
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Grid container spacing={4}>
            {featuredCourses.map((course) => (
              <Grid item xs={12} sm={6} lg={3} key={course.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: theme.shadows[8],
                    },
                  }}
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="div"
                      sx={{
                        height: 200,
                        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <Box textAlign="center">
                        <PlayIcon sx={{ fontSize: 60, mb: 1 }} />
                        <Typography variant="h6" fontWeight={600}>
                          {course.title}
                        </Typography>
                      </Box>
                    </CardMedia>

                    <Chip
                      label={course.category}
                      size="small"
                      color="primary"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        fontWeight: 600,
                      }}
                    />

                    {course.isPurchased && (
                      <Chip
                        label="Purchased"
                        size="small"
                        color="success"
                        sx={{
                          position: "absolute",
                          bottom: 12,
                          right: 12,
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={1}>
                      {course.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={2}>
                      By {course.instructor}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      mb={2}
                    >
                      <Box display="flex" alignItems="center">
                        <AccessTimeIcon
                          sx={{
                            fontSize: 16,
                            mr: 0.5,
                            color: "text.secondary",
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {course.duration}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <GroupIcon
                          sx={{
                            fontSize: 16,
                            mr: 0.5,
                            color: "text.secondary",
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {course.students.toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Button
                        variant={isAuthenticated ? "contained" : "outlined"}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/courses/${course.id}`);
                        }}
                      >
                        {isAuthenticated && course.isPurchased
                          ? "Continue"
                          : "View Course"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mt={6}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/courses")}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 3,
              }}
            >
              {isAuthenticated ? "Browse All Courses" : "Explore Courses"}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Why Learn with EduHikerz Section - ✅ Only show if not authenticated */}
      {!isAuthenticated && (
        <Box
          sx={{
            py: { xs: 6, md: 10 },
            background: "linear-gradient(135deg, #F8FBFF 0%, #EBF4FF 100%)",
            display: "flex",
            alignItems: "center",
            minHeight: { md: "100vh" },
          }}
        >
          <Container maxWidth="xl">
            <Grid
              container
              spacing={4}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12} md={8}>
                <Typography
                  variant="h2"
                  fontWeight={700}
                  sx={{
                    fontSize: { xs: "2rem", md: "2.75rem" },
                    textAlign: "center",
                    mb: 4,
                  }}
                >
                  Why Learn with{" "}
                  <Box
                    component="span"
                    sx={{
                      background:
                        "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    EduHikerz
                  </Box>
                  ?
                </Typography>
              </Grid>

              <Grid item xs={12} md={10}>
                <Grid container spacing={3} justifyContent="center">
                  {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box
                        sx={{
                          height: "100%",
                          p: 2,
                          borderRadius: 2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "white",
                            boxShadow: theme.shadows[4],
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            mb: 2,
                            backgroundColor: "primary.50",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" fontWeight={600} mb={1}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/register")}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    mt: 4,
                  }}
                >
                  Join Now
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      {/* Call to Action Section - ✅ Only show if not authenticated */}
      {!isAuthenticated && (
        <Box
          sx={{
            py: { xs: 6, md: 8 },
            background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h3"
              fontWeight={700}
              mb={2}
              sx={{ fontSize: { xs: "1.75rem", md: "2.5rem" } }}
            >
              Ready to Start Your Learning Journey?
            </Typography>

            <Typography
              variant="h6"
              mb={4}
              sx={{
                opacity: 0.9,
                fontSize: { xs: "1rem", md: "1.25rem" },
                maxWidth: 600,
                mx: "auto",
              }}
            >
              Join thousands of learners who are already advancing their careers
              with EduHikerz. Start your journey today and unlock your
              potential.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/register")}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 3,
                  backgroundColor: "white",
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "grey.100",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Get Started Free
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/courses")}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 3,
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Explore Courses
              </Button>
            </Stack>
          </Container>
        </Box>
      )}
    </Layout>
  );
};

export default Home;
