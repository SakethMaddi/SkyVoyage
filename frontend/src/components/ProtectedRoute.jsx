import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "./ProtectedRoute.module.css";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.wrap}>
        <p>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
