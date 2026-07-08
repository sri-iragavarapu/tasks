import axios from "axios";
import { useState } from "react";
import "../styles/BugForm.css";


function BugForm({ fetchBugs }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    developer: "",
    priority: "Low",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.post("http://localhost:5000/bugs", formData);
    await fetchBugs();

    alert("Bug reported successfully!");

    setFormData({
      title: "",
      description: "",
      developer: "",
      priority: "Low",
    });
  } catch (error) {
    console.log(error);
  }
};

  return (
    <form className="bug-form" onSubmit={handleSubmit}>
      <h2>Report New Bug</h2>

      <input
        type="text"
        name="title"
        placeholder="Bug Title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Bug Description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="developer"
        placeholder="Developer Name"
        value={formData.developer}
        onChange={handleChange}
        required
      />

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <button type="submit">Report Bug</button>
    </form>
  );
}

export default BugForm;