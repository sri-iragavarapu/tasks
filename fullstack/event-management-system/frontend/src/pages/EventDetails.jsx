import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Notification from "../components/Notification";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function EventDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    try {
      const response = await api.post("/registrations", { eventId: id }, { headers: { "x-user-id": user.id } });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  if (!event) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ padding: "24px", borderRadius: "16px", background: "#fff", boxShadow: "0 10px 32px rgba(15, 23, 42, 0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <h1 style={{ marginBottom: "6px" }}>{event.eventName}</h1>
              <p style={{ margin: 0, color: "#64748b" }}>{event.description}</p>
            </div>
            <span style={{ padding: "8px 12px", borderRadius: "999px", background: "#eff6ff", color: "#1d4ed8" }}>{event.status}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginTop: "16px" }}>
            <p><strong>Category:</strong> {event.category}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Event Date:</strong> {event.eventDate}</p>
            <p><strong>Deadline:</strong> {event.registrationDeadline}</p>
            <p><strong>Max Participants:</strong> {event.maxParticipants}</p>
            <p><strong>Available Seats:</strong> {event.availableSeats}</p>
            <p><strong>Registered Participants:</strong> {event.registeredCount || 0}</p>
          </div>
          <div style={{ marginTop: "16px" }}>
            <button onClick={handleRegister} style={{ padding: "10px 14px", border: 0, borderRadius: "8px", background: "#2563eb", color: "#fff", cursor: "pointer" }}>Register</button>
          </div>
          <Notification message={message} />
        </div>
      </div>
    </div>
  );
}

export default EventDetails;