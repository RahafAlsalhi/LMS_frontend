import React from "react";
import { Box, Container, Typography, Button, Grid, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)",
        position: "relative",
        overflow: "hidden",
        py: { xs: 8, md: 12 },
      }}
    >
      {/* Background Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: 80,
          height: 80,
          backgroundColor: "primary.main",
          borderRadius: 2,
          opacity: 0.1,
          transform: "rotate(45deg)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          left: "15%",
          width: 40,
          height: 40,
          backgroundColor: "primary.dark",
          borderRadius: 1,
          opacity: 0.15,
          transform: "rotate(30deg)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: 60,
          height: 60,
          backgroundColor: "secondary.main",
          borderRadius: 2,
          opacity: 0.1,
          transform: "rotate(-20deg)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          right: "5%",
          width: 100,
          height: 100,
          backgroundColor: "primary.light",
          borderRadius: 3,
          opacity: 0.08,
          transform: "rotate(15deg)",
        }}
      />

      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: "text.primary",
                  mb: 2,
                }}
              >
                Boost your career potential with
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
                  EduHikerz's
                </Box>{" "}
                tech-driven, self-paced yet collaborative learning journey —
                designed to fast-track your skills and future in the digital
                world.
              </Typography>

              <Box sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/register")}
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                    boxShadow: "0 8px 25px rgba(33, 150, 243, 0.4)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 35px rgba(33, 150, 243, 0.5)",
                    },
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  Join EduHikerz now!
                </Button>
              </Box>
            </Stack>
          </Grid>

          {/* Right Content - Illustration */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 400,
              }}
            >
              {/* Main Illustration Container */}
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 300, md: 450 },
                  height: { xs: 300, md: 450 },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* Students Illustration Placeholder */}
                <Box
                  sx={{
                    width: "80%",
                    height: "80%",
                    background:
                      "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    boxShadow: "0 20px 60px rgba(33, 150, 243, 0.3)",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "-10px",
                      left: "-10px",
                      right: "-10px",
                      bottom: "-10px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)",
                      zIndex: -1,
                    },
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      color: "white",
                      fontWeight: 700,
                      textAlign: "center",
                      fontSize: { xs: "2rem", md: "3rem" },
                    }}
                  >
                    🎓
                    <br />
                    Learn & Grow
                  </Typography>
                </Box>

                {/* Floating Elements */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "10%",
                    right: "10%",
                    width: 60,
                    height: 60,
                    backgroundColor: "secondary.main",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "float 3s ease-in-out infinite",
                    "@keyframes float": {
                      "0%, 100%": { transform: "translateY(0px)" },
                      "50%": { transform: "translateY(-10px)" },
                    },
                  }}
                >
                  <Typography variant="h4">💡</Typography>
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: "15%",
                    left: "5%",
                    width: 50,
                    height: 50,
                    backgroundColor: "warning.main",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "float 3s ease-in-out infinite 1s",
                    "@keyframes float": {
                      "0%, 100%": { transform: "translateY(0px)" },
                      "50%": { transform: "translateY(-8px)" },
                    },
                  }}
                >
                  <Typography variant="h5">🚀</Typography>
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    top: "40%",
                    left: "-5%",
                    width: 45,
                    height: 45,
                    backgroundColor: "error.main",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "float 3s ease-in-out infinite 2s",
                    "@keyframes float": {
                      "0%, 100%": { transform: "translateY(0px)" },
                      "50%": { transform: "translateY(-12px)" },
                    },
                  }}
                ></Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
