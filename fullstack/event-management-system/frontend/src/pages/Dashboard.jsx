import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [data, setData] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    ongoingEvents: 0,
    completedEvents: 0,
    totalRegistrations: 0
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/events/dashboard/stats");
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div>
      <Navbar />
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <h1 style={{ marginBottom: "6px" }}>Dashboard</h1>
          <p style={{ margin: 0, color: "#64748b" }}>A quick view of your event ecosystem and registrations.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "18px" }}>
          {[
            { label: "Total Events", value: data.totalEvents, accent: "#2563eb" },
            { label: "Upcoming Events", value: data.upcomingEvents, accent: "#0f766e" },
            { label: "Ongoing Events", value: data.ongoingEvents, accent: "#d97706" },
            { label: "Completed Events", value: data.completedEvents, accent: "#7c3aed" },
            { label: "Total Registrations", value: data.totalRegistrations, accent: "#dc2626" }
          ].map((item) => (
            <div key={item.label} style={{ border: "1px solid #e2e8f0", borderRadius: "14px", padding: "20px", background: "#fff", boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)", transition: "transform 0.2s ease", cursor: "default" }} onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}>
              <h3 style={{ margin: "0 0 8px", color: item.accent }}>{item.label}</h3>
              <h2 style={{ margin: 0, fontSize: "1.8rem" }}>{item.value}</h2>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link to="/events" style={{ padding: "10px 14px", borderRadius: "999px", background: "#2563eb", color: "#fff", textDecoration: "none" }}>View Events</Link>
          <Link to="/add-event" style={{ padding: "10px 14px", borderRadius: "999px", background: "#e2e8f0", color: "#0f172a", textDecoration: "none" }}>Create Event</Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;