// components/instructorDashboard/InstructorCourseManagement.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import CourseList from "../courses/CourseList";
import adminAPI from "../../services/adminAPI"; // You can use the same API service

const InstructorCourseManagement = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current instructor user
    const getCurrentUser = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.role === "instructor") {
          setCurrentUser(user);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error getting current user:", error);
        navigate("/login");
      }
    };

    getCurrentUser();
  }, [navigate]);

  if (!currentUser) {
    return null; // Loading state
  }

  return (
    <>
      <CourseList
        userRole="instructor"
        currentUser={currentUser}
        apiService={adminAPI}
      />

      <Box mt={4} display="flex" justifyContent="flex-start" px={4}>
        <Button
          variant="outlined"
          onClick={() => navigate("/instructor/dashboard")}
          sx={{ minWidth: 150 }}
        >
          ← Back to Dashboard
        </Button>
      </Box>
    </>
  );
};

export default InstructorCourseManagement;
