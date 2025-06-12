import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Home, ArrowBack, Search } from "@mui/icons-material";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleSearchCourses = () => {
    navigate("/courses");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            p: 6,
            borderRadius: 3,
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(33, 150, 243, 0.15)",
          }}
        >
          {/* 404 Number */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "6rem", md: "8rem" },
              fontWeight: 700,
              background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
              mb: 2,
            }}
          >
            404
          </Typography>

          {/* Main heading */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            Oops! Page Not Found
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mb: 4,
              fontSize: "1.1rem",
              lineHeight: 1.6,
              maxWidth: "500px",
              mx: "auto",
            }}
          >
            The page you're looking for doesn't exist or has been moved. Don't
            worry, let's get you back on track with your learning journey!
          </Typography>

          {/* Action buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={handleGoHome}
              sx={{
                px: 3,
                py: 1.5,
                fontSize: "1rem",
                minWidth: "160px",
              }}
            >
              Go Home
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBack />}
              onClick={handleGoBack}
              sx={{
                px: 3,
                py: 1.5,
                fontSize: "1rem",
                minWidth: "160px",
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              Go Back
            </Button>

            <Button
              variant="text"
              size="large"
              startIcon={<Search />}
              onClick={handleSearchCourses}
              sx={{
                px: 3,
                py: 1.5,
                fontSize: "1rem",
                minWidth: "160px",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.50",
                },
              }}
            >
              Browse Courses
            </Button>
          </Stack>

          {/* Helpful links */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Looking for something specific?
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              justifyContent="center"
            >
              <Button
                variant="text"
                onClick={() => navigate("/dashboard")}
                sx={{ color: "text.secondary", textDecoration: "underline" }}
              >
                Dashboard
              </Button>
              <Button
                variant="text"
                onClick={() => navigate("/courses")}
                sx={{ color: "text.secondary", textDecoration: "underline" }}
              >
                All Courses
              </Button>
              <Button
                variant="text"
                onClick={() => navigate("/contact")}
                sx={{ color: "text.secondary", textDecoration: "underline" }}
              >
                Contact Support
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound;
