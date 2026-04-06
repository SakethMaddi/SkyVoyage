import { useNavigate, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import AuthHeader from "../components/Header/AuthHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { loginRequest } from "../api/client.js";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await loginRequest(email.trim(), password.trim());
      setUser(data.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <>
      <AuthHeader />
      <main>
        <div className={styles.container}>
          <h2>Welcome Back</h2>
          <p className={styles.subtitle}>Login to continue your journey ✈️</p>
          <form onSubmit={submit}>
            <div className={styles.group}>
              <p>Email</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.group}>
              <p>Password</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.btn}>
              Login
            </button>
            <p className={styles.error}>{error}</p>
          </form>
          <p className={styles.switch}>
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </main>
    </>
  );
}
