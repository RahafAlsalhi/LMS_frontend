import React from "react";
import ProtectedRoute from "./ProtectedRoute";

const StudentRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="student">{children}</ProtectedRoute>;
};

export default StudentRoute;
