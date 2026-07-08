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
      <h3>{bug.title}</h3>

      <p>
        <strong>Description:</strong> {bug.description}
      </p>

      <p>
        <strong>Developer:</strong> {bug.developer}
      </p>

      <p>
        <strong>Priority:</strong> {bug.priority}
      </p>

      <p>
        <strong>Status:</strong> {bug.status}
      </p>

      <p>
        <strong>Date:</strong> {bug.date}
      </p>

       <button onClick={updateStatus}>
  Update Status
</button>

<button onClick={deleteBug}>
  Delete
</button>

    </div>
  );
}

export default BugCard;