import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>; // optional spinner or loader
  }

  if (!token) {
    return <Navigate to="/login/user" replace />;
  }

  return children;
};

export default ProtectedRoute;
