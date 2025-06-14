import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Chip,
  Grid,
  Stack,
  Fade,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import adminAPI from "../../../services/adminAPI";

const RecentUsersComponent = ({ navigate }) => {
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch recent users when component mounts
  useEffect(() => {
    fetchRecentUsers();
  }, []);

  const fetchRecentUsers = async () => {
    try {
      setLoading(true);

      // Use the same API call as GetAllUsers page
      const response = await adminAPI.getAllUsers();

      if (response.success) {
        // Sort users by creation date (newest first) and take only first 4
        const sortedUsers = response.data.sort((a, b) => {
          const dateA = new Date(
            a.created_at || a.createdAt || a.registration_date
          );
          const dateB = new Date(
            b.created_at || b.createdAt || b.registration_date
          );
          return dateB - dateA; // Newest first
        });

        const recentFour = sortedUsers.slice(0, 4);
        setRecentUsers(recentFour);
        setTotalUsersCount(response.data.length);

        if (recentFour.length > 0) {
          showSnackbar(`Loaded ${recentFour.length} recent users`);
        }
      } else {
        showSnackbar("Failed to fetch recent users", "error");
      }
    } catch (error) {
      console.error("Error fetching recent users:", error);
      showSnackbar("Error loading recent users", "error");
    } finally {
      setLoading(false);
    }
  };

  // Snackbar helper
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewAllUsers = () => {
    if (navigate) {
      navigate("/admin/GetAllUsers");
    } else {
      window.location.href = "/admin/GetAllUsers";
    }
  };

  const formatRegistrationDate = (user) => {
    const dateString =
      user.created_at || user.createdAt || user.registration_date;
    if (!dateString) return "Recently";

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Fade in timeout={1200}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            background: "white",
            border: "1px solid #f0f0f0",
            overflow: "hidden",
            mb: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <Box sx={{ p: 4, borderBottom: "1px solid #f5f5f5" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={3}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    backgroundColor: "#fef7ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#a855f7",
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    color="#1a1a1a"
                    mb={0.5}
                  >
                    Recent Users
                  </Typography>
                  <Typography variant="body2" color="#6b7280">
                    Latest user registrations and activity
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                onClick={handleViewAllUsers}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  borderColor: "#e5e7eb",
                  color: "#a855f7",
                  fontWeight: 500,
                  "&:hover": {
                    borderColor: "#a855f7",
                    backgroundColor: "#fef7ff",
                  },
                }}
              >
                View All Users ({totalUsersCount})
              </Button>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress size={40} sx={{ color: "#a855f7" }} />
              </Box>
            ) : recentUsers.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {recentUsers.map((user, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={3}
                      key={user.id || index}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          p: 3,
                          borderRadius: 2.5,
                          backgroundColor: "#f9fafb",
                          border: "1px solid #f3f4f6",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                          height: "100%",
                          "&:hover": {
                            backgroundColor: "#f3f4f6",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          },
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            src={user.avatar_url || user.profileImage}
                            sx={{
                              width: 56,
                              height: 56,
                              backgroundColor: "#a855f7",
                              fontSize: "1.25rem",
                              fontWeight: 600,
                              color: "white",
                            }}
                          >
                            {user.name?.charAt(0)?.toUpperCase() ||
                              user.username?.charAt(0)?.toUpperCase() ||
                              "U"}
                          </Avatar>
                          <Box flex={1}>
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              mb={0.5}
                              color="#1a1a1a"
                              noWrap
                            >
                              {user.name || user.username || "Unknown User"}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="#6b7280"
                              mb={1}
                              noWrap
                            >
                              {user.email}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="#9ca3af"
                              display="block"
                            >
                              {formatRegistrationDate(user)}
                            </Typography>
                          </Box>
                        </Box>

                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          gap={1}
                        >
                          <Chip
                            label={user.role?.toUpperCase() || "USER"}
                            size="small"
                            sx={{
                              backgroundColor:
                                user.role === "admin"
                                  ? "#fef2f2"
                                  : user.role === "instructor"
                                  ? "#fffbeb"
                                  : "#f0fdf4",
                              color:
                                user.role === "admin"
                                  ? "#dc2626"
                                  : user.role === "instructor"
                                  ? "#d97706"
                                  : "#16a34a",
                              fontWeight: 500,
                              fontSize: "0.7rem",
                              height: 20,
                            }}
                          />
                          <Chip
                            label={user.is_active ? "Active" : "Inactive"}
                            size="small"
                            sx={{
                              backgroundColor: user.is_active
                                ? "#f0fdf4"
                                : "#f9fafb",
                              color: user.is_active ? "#16a34a" : "#6b7280",
                              fontWeight: 500,
                              fontSize: "0.7rem",
                              height: 20,
                            }}
                          />
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {totalUsersCount > 4 && (
                  <Box mt={3} textAlign="center">
                    <Typography variant="body2" color="#6b7280">
                      Showing {recentUsers.length} of {totalUsersCount} total
                      users
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box textAlign="center" py={8}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 3,
                    backgroundColor: "#f9fafb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 32, color: "#9ca3af" }} />
                </Box>
                <Typography
                  variant="h6"
                  color="#374151"
                  mb={1}
                  fontWeight={600}
                >
                  No recent users
                </Typography>
                <Typography variant="body2" color="#6b7280">
                  New user registrations will appear here
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Fade>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RecentUsersComponent;
