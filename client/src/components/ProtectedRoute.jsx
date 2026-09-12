import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { userData, authChecked } = useSelector((state) => state.user);

  if (!authChecked) {
    return null;
  }

  if (!userData) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
