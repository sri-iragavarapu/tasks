import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", background: "linear-gradient(90deg, #2563eb, #1d4ed8)", color: "white", gap: "12px", flexWrap: "wrap", boxShadow: "0 4px 20px rgba(37, 99, 235, 0.18)" }}>
      <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Event Management System</h2>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <Link to="/dashboard" style={{ color: "white", textDecoration: "none", padding: "6px 10px", borderRadius: "999px", transition: "background 0.2s ease" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>Dashboard</Link>
        <Link to="/events" style={{ color: "white", textDecoration: "none", padding: "6px 10px", borderRadius: "999px", transition: "background 0.2s ease" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>Events</Link>
        <Link to="/my-registrations" style={{ color: "white", textDecoration: "none", padding: "6px 10px", borderRadius: "999px", transition: "background 0.2s ease" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>My Registrations</Link>
        <Link to="/profile" style={{ color: "white", textDecoration: "none", padding: "6px 10px", borderRadius: "999px", transition: "background 0.2s ease" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>Profile</Link>
        <span style={{ color: "#e0f2fe" }}>Welcome, {user?.name}</span>
        <button onClick={handleLogout} style={{ padding: "8px 12px", border: 0, borderRadius: "999px", background: "#fff", color: "#2563eb", cursor: "pointer" }}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;