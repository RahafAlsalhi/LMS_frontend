import React from "react";
import ProtectedRoute from "./ProtectedRoute";

const TeacherRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["instructor", "admin"]}>
      {children}
    </ProtectedRoute>
  );
};

export default TeacherRoute;
