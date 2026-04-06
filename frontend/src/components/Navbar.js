// src/components/Navbar.js
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const role       = localStorage.getItem("role");
  const userName   = localStorage.getItem("name")   || "User";
  const userAvatar = localStorage.getItem("avatar") || "🧑‍🎓";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const studentLinks = [
    { path: "/home",      label: "🏠 Home"      },
    { path: "/dashboard", label: "📊 Dashboard" },
    { path: "/exam",      label: "📝 Take Exam" },
  ];

  const adminLinks = [
    { path: "/admin", label: "🧑‍💼 Admin Panel" },
  ];

  const links = role === "admin" ? adminLinks : studentLinks;

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="nav-brand" style={{ cursor: "pointer" }} onClick={() => navigate(role === "admin" ? "/admin" : "/home")}>
        <div className="nav-brand-icon">🎓</div>
        <span className="nav-brand-name">
          Smart<span>Exam</span>
        </span>
      </div>

      {/* Links */}
      <div className="nav-links">
        {links.map(l => (
          <button
            key={l.path}
            className={`nav-link ${location.pathname === l.path ? "active" : ""}`}
            onClick={() => navigate(l.path)}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div className="nav-right">
        <div className="notif-btn">🔔<span className="notif-dot" /></div>
        <div
          className="nav-avatar"
          title={userName}
          onClick={() => navigate("/dashboard")}
        >
          {userAvatar}
        </div>
        <span style={{ fontSize: 13, color: "var(--text2)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {userName.split(" ")[0]}
        </span>
        <button className="nav-logout-btn" onClick={handleLogout}>↩ Logout</button>
      </div>
    </nav>
  );
}