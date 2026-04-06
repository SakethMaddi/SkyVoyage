import { Link, NavLink, useNavigate } from "react-router-dom";
import PlaneIcon from "../Icons/PlaneIcon.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./Header.module.css";

export default function Header({ variant = "app" }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const navClass =
    variant === "auth" ? `${styles.navBar} ${styles.navBarTight}` : styles.navBar;

  return (
    <header className={styles.header}>
      <nav className={navClass}>
        <Link to="/" className={styles.headerLogo}>
          <PlaneIcon className={styles.plane} />
          <span>SkyVoyage</span>
        </Link>
        <div className={styles.headMenu}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.hMenu} ${isActive ? styles.hMenuActive : ""}`
            }
            end
          >
            Search
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `${styles.hMenu} ${isActive ? styles.hMenuActive : ""}`
            }
          >
            My Bookings
          </NavLink>
          {variant === "app" && (
            <div className={styles.navUser}>
              {user?.name && (
                <span className={styles.welcome}>
                  Hi, {user.name.toUpperCase()}
                </span>
              )}
              <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
