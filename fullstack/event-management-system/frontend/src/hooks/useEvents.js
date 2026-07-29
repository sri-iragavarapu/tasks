import { useMemo, useState } from "react";

export const useEvents = (events) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("eventDate");

  const filteredEvents = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    const result = events.filter((event) => {
      const matchesSearch = [event.eventName, event.category, event.venue]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
      const matchesStatus = status === "All" || event.status === status;
      const matchesCategory = category === "All" || event.category === category;
      return matchesSearch && matchesStatus && matchesCategory;
    });

    result.sort((a, b) => {
      if (sortBy === "availableSeats") {
        return b.availableSeats - a.availableSeats;
      }
      if (sortBy === "eventName") {
        return a.eventName.localeCompare(b.eventName);
      }
      return new Date(a.eventDate) - new Date(b.eventDate);
    });

    return result;
  }, [events, search, status, category, sortBy]);

  return {
    search,
    setSearch,
    status,
    setStatus,
    category,
    setCategory,
    sortBy,
    setSortBy,
    filteredEvents
  };
};