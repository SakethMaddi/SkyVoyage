import { Link, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import AuthHeader from "../components/Header/AuthHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { registerRequest } from "../api/client.js";
import styles from "./SignupPage.module.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      const data = await registerRequest(
        name.trim(),
        email.trim(),
        password.trim()
      );
      setUser(data.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Sign up failed");
    }
  }

  return (
    <>
      <AuthHeader />
      <main>
        <div className={styles.container}>
          <h2>Create Account</h2>
          <p className={styles.subtitle}>Join SkyVoyage today ✈️</p>
          <form onSubmit={submit}>
            <div className={styles.group}>
              <label htmlFor="signupName">Name</label>
              <input
                id="signupName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className={styles.group}>
              <label htmlFor="signupEmail">Email</label>
              <input
                id="signupEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.group}>
              <label htmlFor="signupPassword">Password</label>
              <input
                id="signupPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className={styles.group}>
              <label htmlFor="signupConfirm">Confirm password</label>
              <input
                id="signupConfirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.btn}>
              Sign Up
            </button>
            <p className={styles.error}>{error}</p>
          </form>
          <p className={styles.switch}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </main>
    </>
  );
}
