import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default PrivateRoute;
