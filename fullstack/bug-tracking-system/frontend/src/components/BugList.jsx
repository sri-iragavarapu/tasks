import BugCard from "./BugCard";
import "../styles/BugList.css";

function BugList({ bugs, fetchBugs }) {
  return (
    <div className="bug-list">
      {bugs.map((bug) => (
        <BugCard
    key={bug.id}
    bug={bug}
    fetchBugs={fetchBugs}
/>
      ))}
    </div>
  );
}

export default BugList;