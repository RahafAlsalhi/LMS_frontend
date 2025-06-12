import React from "react";
import { useSelector } from "react-redux";
import Layout from "@components/common/Layout";
import StudentDashboard from "@components/dashboard/StudentDashboard";
import InstructorDashboard from "@components/dashboard/InstructorDashboard";
import AdminDashboard from "@components/dashboard/AdminDashboard";

const Dashboard = () => {
  // Get user role from Redux store
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role || "student";

  const renderDashboard = () => {
    switch (userRole) {
      case "admin":
        return <AdminDashboard />;
      case "instructor":
        return <InstructorDashboard />;
      case "student":
      default:
        return <StudentDashboard />;
    }
  };

  return <Layout>{renderDashboard()}</Layout>;
};

export default Dashboard;
