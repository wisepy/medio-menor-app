import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function ProtectedRoute({ children, requiredRole }) {
  const { isLoggedIn, loading, user } = useApp();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (loading || !user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
