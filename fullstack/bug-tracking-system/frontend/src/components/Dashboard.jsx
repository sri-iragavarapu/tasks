import "../styles/Dashboard.css";

function Dashboard({ bugs }) {
  const open = bugs.filter((bug) => bug.status === "Open").length;
  const progress = bugs.filter(
    (bug) => bug.status === "In Progress"
  ).length;
  const resolved = bugs.filter(
    (bug) => bug.status === "Resolved"
  ).length;

  return (
    <div className="dashboard">
      <div className="card">
        <h3>Total</h3>
        <p>{bugs.length}</p>
      </div>

      <div className="card">
        <h3>Open</h3>
        <p>{open}</p>
      </div>

      <div className="card">
        <h3>In Progress</h3>
        <p>{progress}</p>
      </div>

      <div className="card">
        <h3>Resolved</h3>
        <p>{resolved}</p>
      </div>
    </div>
  );
}

export default Dashboard;