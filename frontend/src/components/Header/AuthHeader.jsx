import { Link, NavLink } from "react-router-dom";
import PlaneIcon from "../Icons/PlaneIcon.jsx";
import styles from "./AuthHeader.module.css";

export default function AuthHeader() {
  return (
    <header className={styles.wrap}>
      <nav className={styles.navBar}>
        <Link to="/" className={styles.headerLogo}>
          <PlaneIcon className={styles.plane} />
          <span>SkyVoyage</span>
        </Link>
        <div className={styles.headMenu}>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${styles.hMenu} ${isActive ? styles.hMenuActive : ""}`
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              `${styles.hMenu} ${isActive ? styles.hMenuActive : ""}`
            }
          >
            Sign Up
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
