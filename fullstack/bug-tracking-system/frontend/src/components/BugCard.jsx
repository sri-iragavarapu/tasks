import axios from "axios";
import "../styles/BugCard.css";

function BugCard({ bug, fetchBugs }) {

    const updateStatus = async () => {
  let nextStatus = "Open";

  if (bug.status === "Open") {
    nextStatus = "In Progress";
  } else if (bug.status === "In Progress") {
    nextStatus = "Resolved";
  }

  await axios.put(`http://localhost:5000/bugs/${bug.id}`, {
    status: nextStatus,
  });

  fetchBugs();
};

const deleteBug = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this bug?"
  );

  if (!confirmDelete) return;

  await axios.delete(`http://localhost:5000/bugs/${bug.id}`);

  fetchBugs();
};

  return (
  <div className="bug-card">
    <h2>{bug.title}</h2>

    <p>{bug.description}</p>

    <hr />

    <p>
      <strong>👨‍💻 Developer:</strong> {bug.developer}
    </p>

    <p>
      <strong>🔥 Priority:</strong>{" "}
      <span
        className={
          bug.priority === "High"
            ? "high"
            : bug.priority === "Medium"
            ? "medium"
            : "low"
        }
      >
        {bug.priority}
      </span>
    </p>

    <p>
      <strong>📌 Status:</strong>{" "}
      <span
        className={
          bug.status === "Open"
            ? "open"
            : bug.status === "In Progress"
            ? "progress"
            : "resolved"
        }
      >
        {bug.status}
      </span>
    </p>

    <p>
      <strong>📅 Created:</strong> {bug.date}
    </p>

    <button
      onClick={updateStatus}
      disabled={bug.status === "Resolved"}
    >
      Update Status
    </button>

    <button onClick={deleteBug}>
      Delete
    </button>
  </div>
);
}

export default BugCard;