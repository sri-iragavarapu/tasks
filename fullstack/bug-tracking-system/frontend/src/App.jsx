import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import BugForm from "./components/BugForm";
import BugList from "./components/BugList";

import "./styles/App.css";

function App() {
  const [bugs, setBugs] = useState([]);

  const fetchBugs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/bugs");
      setBugs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  return (
    <>
      <Navbar />
      <Dashboard bugs={bugs} />
      <BugForm fetchBugs={fetchBugs} />
      <BugList
    bugs={bugs}
    fetchBugs={fetchBugs}
/>
    </>
  );
}

export default App;