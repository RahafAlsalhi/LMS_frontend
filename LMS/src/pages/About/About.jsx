import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Paper,
  Chip,
} from "@mui/material";
import {
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  Groups as GroupsIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
} from "@mui/icons-material";
import Layout from "@components/common/Layout";
import { useEffect } from "react";
const About = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const stats = [
    { icon: <SchoolIcon />, number: "7+", label: "Learning Pathways" },
    { icon: <GroupsIcon />, number: "200+", label: "Active Students" },
    { icon: <TrophyIcon />, number: "20+", label: "Expert Instructors" },
    { icon: <TrendingUpIcon />, number: "95%", label: "Success Rate" },
  ];

  const values = [
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Innovation-Driven",
      description:
        "We leverage cutting-edge technology to create engaging learning experiences that prepare students for the future.",
    },
    {
      icon: <LightbulbIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Quality-Focused",
      description:
        "Every course is carefully crafted by industry experts and continuously updated to meet current market demands.",
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Community-Centered",
      description:
        "We believe in collaborative learning and building strong connections between students, instructors, and industry.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h2"
              fontWeight={700}
              mb={3}
              sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
            >
              About{" "}
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
            </Typography>

            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: 800,
                mx: "auto",
                fontSize: { xs: "1.1rem", md: "1.5rem" },
                lineHeight: 1.6,
              }}
            >
              Empowering the next generation of tech professionals through
              innovative, accelerated learning pathways designed for the modern
              digital economy.
            </Typography>
          </Box>

          {/* Stats */}
          <Grid container spacing={3} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      backgroundColor: "primary.50",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                      color: "primary.main",
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* Mission Section */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid
            container
            spacing={6}
            alignItems="center"
            justifyContent="center"
          >
            <Grid
              item
              xs={12}
              md={6}
              sx={{ textAlign: { xs: "center", md: "left" } }}
            >
              <Typography variant="h3" fontWeight={700} mb={3}>
                Our Mission
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                At EduHikerz, we're on a mission to bridge the gap between
                traditional education and industry needs. We believe that
                learning should be practical, engaging, and directly applicable
                to real-world challenges.
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Our innovative approach combines expert instruction, hands-on
                projects, and collaborative learning to create an educational
                experience that not only teaches skills but transforms careers.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Whether you're a student starting your journey or a professional
                looking to upskill, EduHikerz provides the tools, community, and
                support you need to succeed in today's rapidly evolving tech
                landscape.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                  borderRadius: 4,
                  p: 4,
                  color: "white",
                  textAlign: "center",
                  mx: "auto",
                }}
              >
                <Typography variant="h4" fontWeight={700} mb={2}>
                  Why Choose EduHikerz?
                </Typography>
                <Stack spacing={2}>
                  {[
                    "Industry-Relevant Curriculum",
                    "Expert Instructors",
                    "Hands-on Projects",
                    "Career Support",
                    "Flexible Learning",
                  ].map((label) => (
                    <Chip
                      key={label}
                      label={label}
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        color: "white",
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Values Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: "grey.50" }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={700} textAlign="center" mb={6}>
            Our Values
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {values.map((value, index) => (
              <Grid item xs={12} sm={8} md={4} key={index}>
                <Card
                  sx={{
                    p: 3,
                    height: "100%",
                    textAlign: "center",
                    transition: "transform 0.3s ease-in-out",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    "&:hover": {
                      transform: "translateY(-8px)",
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: "primary.50",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                      }}
                    >
                      {value.icon}
                    </Box>
                    <Typography variant="h5" fontWeight={600} mb={2}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default About;
