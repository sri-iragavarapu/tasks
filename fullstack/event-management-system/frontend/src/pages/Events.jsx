import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import EventCard from "../components/EventCard";
import Notification from "../components/Notification";
import { AuthContext } from "../context/AuthContext";
import { EventContext } from "../context/EventContext";
import { useEvents } from "../hooks/useEvents";
import api from "../services/api";

function Events() {
  const { user } = useContext(AuthContext);
  const { events, fetchEvents } = useContext(EventContext);
  const { search, setSearch, status, setStatus, category, setCategory, sortBy, setSortBy, filteredEvents } = useEvents(events);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/events/${id}`, { headers: { "x-user-id": user.id } });
      setMessage("Event deleted successfully.");
      fetchEvents();
    } catch (error) {
      setMessage(error.response?.data?.message || "Delete failed.");
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const response = await api.post("/registrations", { eventId }, { headers: { "x-user-id": user.id } });
      setMessage(response.data.message);
      fetchEvents();
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  const categories = Array.from(new Set(events.map((event) => event.category).filter(Boolean)));

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>All Events</h1>
        <SearchBar value={search} onChange={setSearch} />
        <FilterPanel
          status={status}
          setStatus={setStatus}
          category={category}
          setCategory={setCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
        />
        <Notification message={message} />
        {filteredEvents.length === 0 ? (
          <p>No Events Found.</p>
        ) : (
          filteredEvents.map((event) => <EventCard key={event.id} event={event} onDelete={handleDelete} onRegister={handleRegister} />)
        )}
      </div>
    </div>
  );
}

export default Events;