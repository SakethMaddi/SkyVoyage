import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";

const planeSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#2b10b2"
    strokeWidth="2.625"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide_plane"
  >
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  </svg>
);

export default function Header() {
  const [welcome, setWelcome] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (user?.name) setWelcome(`Hi, ${user.name.toUpperCase()}`);
    } catch {
      setWelcome("");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    setWelcome("");
    window.location.href = "/";
  };

  return (
    <header className="header">
      <nav className="nav_bar">
        <Link to="/" className="header_logo">
          {planeSvg}
          <span>SkyVoyage</span>
        </Link>
        <div className="head_menu">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `h_menu${isActive ? " active" : ""}`}
          >
            Search
          </NavLink>
          <NavLink
            to="/bookings"
            className={({ isActive }) => `h_menu${isActive ? " active" : ""}`}
          >
            My Bookings
          </NavLink>
          <div className="nav-user">
            {welcome && <span id="welcomeUser">{welcome}</span>}
            {welcome && (
              <button type="button" id="logoutBtn" onClick={logout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
