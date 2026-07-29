import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Notification from "../components/Notification";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function MyRegistrations() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMyRegistrations = async () => {
      try {
        const response = await api.get(`/registrations/${user.id}`, { headers: { "x-user-id": user.id } });
        setEvents(response.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Unable to load registrations.");
      }
    };

    if (user?.id) {
      fetchMyRegistrations();
    }
  }, [user]);

  const cancelRegistration = async (eventId) => {
    try {
      const response = await api.delete(`/registrations/${eventId}/${user.id}`, { headers: { "x-user-id": user.id } });
      setMessage(response.data.message);
      setEvents((current) => current.filter((event) => event.id !== eventId));
    } catch (error) {
      setMessage(error.response?.data?.message || "Cancellation failed.");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>My Registrations</h1>
        <Notification message={message} />
        {events.length === 0 ? (
          <p>No Registrations Found.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} style={{ border: "1px solid gray", padding: "15px", marginBottom: "15px" }}>
              <h2>{event.eventName}</h2>
              <p>{event.description}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
              <p><strong>Date:</strong> {event.eventDate}</p>
              <p><strong>Status:</strong> {event.status}</p>
              <button onClick={() => cancelRegistration(event.id)}>Cancel</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyRegistrations;