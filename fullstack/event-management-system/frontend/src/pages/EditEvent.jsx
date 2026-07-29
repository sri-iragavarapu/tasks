import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Notification from "../components/Notification";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    category: "",
    venue: "",
    eventDate: "",
    registrationDeadline: "",
    maxParticipants: "",
    status: "Upcoming"
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.eventName.trim()) nextErrors.eventName = "Event name is required.";
    if (!formData.description.trim()) nextErrors.description = "Description is required.";
    if (!formData.category.trim()) nextErrors.category = "Category is required.";
    if (!formData.venue.trim()) nextErrors.venue = "Venue is required.";
    if (!formData.eventDate) nextErrors.eventDate = "Event date is required.";
    if (!formData.registrationDeadline) nextErrors.registrationDeadline = "Registration deadline is required.";

    if (formData.eventDate && formData.registrationDeadline && new Date(formData.registrationDeadline) > new Date(formData.eventDate)) {
      nextErrors.registrationDeadline = "Deadline cannot be after the event date.";
    }

    const maxParticipants = Number(formData.maxParticipants);
    if (!formData.maxParticipants) {
      nextErrors.maxParticipants = "Maximum participants is required.";
    } else if (Number.isNaN(maxParticipants) || maxParticipants <= 0) {
      nextErrors.maxParticipants = "Enter a positive number.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await api.put(`/events/${id}`, formData, { headers: { "x-user-id": user.id } });
      setMessage("Event Updated Successfully");
      setTimeout(() => navigate("/events"), 800);
    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed.");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "24px", maxWidth: "720px", margin: "0 auto" }}>
        <h1>Edit Event</h1>
        <p style={{ color: "#64748b" }}>Adjust the event details and its status whenever necessary.</p>
        <Notification message={message} />
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px", maxWidth: "420px" }}>
          <div>
            <input type="text" name="eventName" placeholder="Event Name" value={formData.eventName} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: errors.eventName ? "1px solid #ef4444" : "1px solid #cbd5e1" }} />
            {errors.eventName && <p style={{ color: "#ef4444", margin: "6px 0 0", fontSize: "0.9rem" }}>{errors.eventName}</p>}
          </div>
          <div>
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} style={{ width: "100%", minHeight: "96px", padding: "10px 12px", borderRadius: "8px", border: errors.description ? "1px solid #ef4444" : "1px solid #cbd5e1" }} />
            {errors.description && <p style={{ color: "#ef4444", margin: "6px 0 0", fontSize: "0.9rem" }}>{errors.description}</p>}
          </div>
          <div>
            <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: errors.category ? "1px solid #ef4444" : "1px solid #cbd5e1" }} />
            {errors.category && <p style={{ color: "#ef4444", margin: "6px 0 0", fontSize: "0.9rem" }}>{errors.category}</p>}
          </div>
          <div>
            <input type="text" name="venue" placeholder="Venue" value={formData.venue} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: errors.venue ? "1px solid #ef4444" : "1px solid #cbd5e1" }} />
            {errors.venue && <p style={{ color: "#ef4444", margin: "6px 0 0", fontSize: "0.9rem" }}>{errors.venue}</p>}
          </div>
          <div>
            <label style={{ display: "grid", gap: "4px" }}>Event Date<input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} style={{ padding: "10px 12px", borderRadius: "8px", border: errors.eventDate ? "1px solid #ef4444" : "1px solid #cbd5e1" }} /></label>
            {errors.eventDate && <p style={{ color: "#ef4444", margin: "6px 0 0", fontSize: "0.9rem" }}>{errors.eventDate}</p>}
          </div>
          <div>
            <label style={{ display: "grid", gap: "4px" }}>Registration Deadline<input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} style={{ padding: "10px 12px", borderRadius: "8px", border: errors.registrationDeadline ? "1px solid #ef4444" : "1px solid #cbd5e1" }} /></label>
            {errors.registrationDeadline && <p style={{ color: "#ef4444", margin: "6px 0 0", fontSize: "0.9rem" }}>{errors.registrationDeadline}</p>}
          </div>
          <div>
            <input type="number" name="maxParticipants" placeholder="Maximum Participants" value={formData.maxParticipants} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: errors.maxParticipants ? "1px solid #ef4444" : "1px solid #cbd5e1" }} />
            {errors.maxParticipants && <p style={{ color: "#ef4444", margin: "6px 0 0", fontSize: "0.9rem" }}>{errors.maxParticipants}</p>}
          </div>
          <select name="status" value={formData.status} onChange={handleChange} style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
          <button type="submit" style={{ padding: "10px 14px", border: 0, borderRadius: "8px", background: "#2563eb", color: "#fff", cursor: "pointer" }}>Update Event</button>
        </form>
      </div>
    </div>
  );
}

export default EditEvent;