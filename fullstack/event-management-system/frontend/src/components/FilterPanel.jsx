function FilterPanel({ status, setStatus, category, setCategory, sortBy, setSortBy, categories }) {
  return (
    <div style={{ display: "grid", gap: "10px", marginBottom: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
      <select value={status} onChange={(event) => setStatus(event.target.value)} style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
        <option value="All">All Status</option>
        <option value="Upcoming">Upcoming</option>
        <option value="Ongoing">Ongoing</option>
        <option value="Completed">Completed</option>
      </select>

      <select value={category} onChange={(event) => setCategory(event.target.value)} style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
        <option value="All">All Categories</option>
        {categories.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
        <option value="eventDate">Sort by Date</option>
        <option value="eventName">Sort by Name</option>
        <option value="availableSeats">Sort by Seats</option>
      </select>
    </div>
  );
}

export default FilterPanel;