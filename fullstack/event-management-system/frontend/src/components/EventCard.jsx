import { useNavigate } from "react-router-dom";

function EventCard({ event, onDelete, onRegister, showActions = true }) {
  const navigate = useNavigate();

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: "14px", padding: "18px", marginBottom: "14px", background: "#fff", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <h3 style={{ margin: "0 0 6px" }}>{event.eventName}</h3>
          <p style={{ margin: 0, color: "#475569" }}>{event.description}</p>
        </div>
        <span style={{ padding: "6px 10px", borderRadius: "999px", background: "#eff6ff", color: "#1d4ed8", fontSize: "0.9rem" }}>{event.status}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "8px", marginTop: "12px" }}>
        <p style={{ margin: 0 }}><strong>Category:</strong> {event.category}</p>
        <p style={{ margin: 0 }}><strong>Venue:</strong> {event.venue}</p>
        <p style={{ margin: 0 }}><strong>Date:</strong> {event.eventDate}</p>
        <p style={{ margin: 0 }}><strong>Seats Left:</strong> {event.availableSeats}</p>
      </div>

      {showActions && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
          <button onClick={() => navigate(`/event/${event.id}`)} style={{ padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}>View</button>
          <button onClick={() => navigate(`/edit-event/${event.id}`)} style={{ padding: "8px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}>Edit</button>
          <button onClick={() => onDelete(event.id)} style={{ padding: "8px 10px", borderRadius: "8px", border: "1px solid #fda4af", background: "#fff1f2", color: "#be123c", cursor: "pointer" }}>Delete</button>
          <button onClick={() => onRegister(event.id)} style={{ padding: "8px 10px", borderRadius: "8px", border: 0, background: "#2563eb", color: "#fff", cursor: "pointer" }}>Register</button>
        </div>
      )}
    </div>
  );
}

export default EventCard;