function SearchBar({ value, onChange, placeholder = "Search events" }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
    />
  );
}

export default SearchBar;