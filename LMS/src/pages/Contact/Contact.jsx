import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import Layout from "@components/common/Layout";
import { useEffect } from "react";
const Contact = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 30, color: "primary.main" }} />,
      title: "Email Us",
      details: ["contact@eduhikerz.com", "support@eduhikerz.com"],
      description: "Send us an email anytime",
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 30, color: "primary.main" }} />,
      title: "Call Us",
      details: ["+962 6 1234 5678", "+962 6 8765 4321"],
      description: "Available Mon-Fri, 9 AM - 6 PM",
    },
    {
      icon: <LocationIcon sx={{ fontSize: 30, color: "primary.main" }} />,
      title: "Visit Us",
      details: ["Al Hussein Technical University", "Amman, Jordan"],
      description: "Campus location",
    },
    {
      icon: <TimeIcon sx={{ fontSize: 30, color: "primary.main" }} />,
      title: "Office Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 4:00 PM",
      ],
      description: "Jordan Standard Time (JST)",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)",
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography
              variant="h2"
              fontWeight={700}
              mb={2}
              sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
            >
              Get in Touch
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Have questions about our courses or need support? We're here to
              help! Reach out to us and we'll get back to you as soon as
              possible.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Contact Information */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} mb={4} textAlign="center">
            Contact Information
          </Typography>

          {/* Fixed Grid Container */}
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{
              width: "100%",
              margin: "0 auto",
              justifyContent: "center",
            }}
          >
            {contactInfo.map((info, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={index}
                sx={{
                  display: "flex",
                  minWidth: { md: "calc(25% - 32px)" }, // 32px accounts for spacing
                }}
              >
                <Card
                  sx={{
                    p: 3,
                    textAlign: "center",
                    width: "100%",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        backgroundColor: "primary.50",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      {info.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} mb={1}>
                      {info.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {info.description}
                    </Typography>
                    {info.details.map((detail, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        fontWeight={500}
                        sx={{
                          color: idx === 0 ? "primary.main" : "text.primary",
                          mb: 0.5,
                        }}
                      >
                        {detail}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <br />

          {/* Right Side Content */}
          <Grid container spacing={6}>
            <Grid item xs={12} md={4} sx={{ mx: "auto" }}>
              <Stack spacing={3}>
                {/* FAQ Section */}
                <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Frequently Asked Questions
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        How long does it take to complete a course?
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Course duration varies from 4-16 weeks depending on the
                        pathway and your pace.
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        Do you offer certificates?
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Yes! You'll receive a certificate upon successful
                        completion of each course.
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                {/* Response Time */}
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                    color: "white",
                  }}
                >
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Response Time
                  </Typography>
                  <Typography variant="body2" mb={2}>
                    We typically respond to all inquiries within:
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      • General inquiries: 24 hours
                    </Typography>
                    <Typography variant="body2">
                      • Technical support: 12 hours
                    </Typography>
                    <Typography variant="body2">
                      • Urgent issues: 2-4 hours
                    </Typography>
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default Contact;
