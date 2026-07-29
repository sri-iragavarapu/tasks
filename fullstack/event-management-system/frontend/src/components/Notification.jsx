function Notification({ message }) {
  if (!message) return null;

  return (
    <div style={{ padding: "10px", marginBottom: "12px", borderRadius: "6px", background: "#e8f5e9", color: "#1b5e20" }}>
      {message}
    </div>
  );
}

export default Notification;