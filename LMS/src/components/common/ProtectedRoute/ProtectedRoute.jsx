import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Box, CircularProgress, Typography } from "@mui/material";
import { getCurrentUser } from "@store/slices/authSlice";

const ProtectedRoute = ({
  children,
  requiredRole = null,
  allowedRoles = [],
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Try to get current user if we have localStorage data but no Redux user
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user && !loading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, loading]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={50} />
        <Typography variant="body1" color="text.secondary">
          Verifying authentication...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  const userRole = user.role;

  // If specific role is required
  if (requiredRole && userRole !== requiredRole) {
    return getRedirectByRole(userRole);
  }

  // If allowed roles array is provided
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return getRedirectByRole(userRole);
  }

  return children;
};

// Helper function to redirect based on user role
const getRedirectByRole = (role) => {
  switch (role) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "instructor":
      return <Navigate to="/instructor/dashboard" replace />;
    case "student":
      return <Navigate to="/student/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
