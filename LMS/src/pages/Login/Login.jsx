import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Link,
  Alert,
  Stack,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "@store/slices/authSlice";
import GoogleAuth from "@components/auth/GoogleAuth";
import Layout from "@components/common/Layout";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const from = location.state?.from?.pathname || "/dashboard";
  const successMessage = location.state?.message;

  // ✅ FIXED: Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Clear any previous errors when component mounts
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  // ✅ FIXED: Updated submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      return;
    }

    try {
      // ✅ FIXED: Proper credentials format
      const credentials = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      // ✅ FIXED: Use Redux thunk and handle response properly
      const resultAction = await dispatch(loginUser(credentials));

      if (loginUser.fulfilled.match(resultAction)) {
        // Success - Redux will handle state updates
        navigate(from, { replace: true });
      }
      // Error handling is done by Redux
    } catch (error) {
      // Additional error handling if needed
      console.error("Login failed:", error);
    }
  };

  // ✅ FIXED: Google success handler
  const handleGoogleSuccess = (result) => {
    // Redux already updated the state, just navigate
    navigate(from, { replace: true });
  };

  // ✅ FIXED: Google error handler
  const handleGoogleError = (error) => {
    console.error("Google login failed:", error);
    // Error will be displayed via Redux state
  };

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "calc(100vh - 140px)",
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: "0 20px 60px rgba(33, 150, 243, 0.15)",
            }}
          >
            <Box textAlign="center" mb={3}>
              <Typography variant="h4" fontWeight={700} mb={1}>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to your EduHikerz account
              </Typography>
            </Box>

            {/* Success message from registration */}
            {successMessage && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {successMessage}
              </Alert>
            )}

            {/* ✅ FIXED: Error message display */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || !formData.email || !formData.password}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </Stack>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            {/* ✅ FIXED: Google Auth with proper handlers */}
            <GoogleAuth
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              disabled={loading}
              text="Sign in with Google"
            />

            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate("/register")}
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>

            <Box textAlign="center" mt={1}>
              <Link
                component="button"
                type="button"
                onClick={() => navigate("/forgot-password")}
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  "&:hover": {
                    color: "primary.main",
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot your password?
              </Link>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default Login;
