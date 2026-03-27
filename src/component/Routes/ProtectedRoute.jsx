// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { authLocalStorage } from "../Utils/authLocalStorage";

const ProtectedRoute = ({ allowedRoles }) => {
  const userData = authLocalStorage();
  const userRole = userData ? userData.role : null;

  // Not logged in
  if (!userData) return <Navigate to="/" replace />;

  //  Invalid role
  if (!userRole) return <Navigate to="/" replace />;

  // Not authorized
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="#" replace />;
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  // userRole: PropTypes.string,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
