import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import AddEvent from "./pages/AddEvent";
import EditEvent from "./pages/EditEvent";
import EventDetails from "./pages/EventDetails";
import MyRegistrations from "./pages/MyRegistrations";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import EventProvider from "./context/EventContext";

function App() {
  return (
    <EventProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/add-event" element={<ProtectedRoute><AddEvent /></ProtectedRoute>} />
        <Route path="/edit-event/:id" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
        <Route path="/event/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
        <Route path="/my-registrations" element={<ProtectedRoute><MyRegistrations /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </EventProvider>
  );
}

export default App;