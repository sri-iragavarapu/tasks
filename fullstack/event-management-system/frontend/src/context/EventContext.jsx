import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";

export const EventContext = createContext();

function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/events");
      setEvents(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const value = useMemo(() => ({
    events,
    loading,
    error,
    fetchEvents,
    setEvents
  }), [events, loading, error, fetchEvents]);

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export default EventProvider;