import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const user = localStorage.getItem("user"); // Check for user authentication

  if (user) {
    return children;
  } else {
    Swal.fire({
      icon: "error",
      text: "Denied Access",
      confirmButtonText: "OK",
    }).then(() => {
      navigate("/login");
    });
    return null;
  }
};

export default PrivateRoute;
