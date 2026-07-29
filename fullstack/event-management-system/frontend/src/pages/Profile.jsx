import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Notification from "../components/Notification";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Profile() {
  const { user, login } = useContext(AuthContext);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/profile/${user.id}`, { headers: { "x-user-id": user.id } });
        setProfile(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const handleProfileChange = async (event) => {
    event.preventDefault();
    try {
      const response = await api.put(`/profile/${user.id}`, profile, { headers: { "x-user-id": user.id } });
      login({ ...user, ...response.data.user });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Profile update failed.");
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    try {
      const response = await api.put(`/profile/${user.id}/password`, passwords, { headers: { "x-user-id": user.id } });
      setMessage(response.data.message);
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Password update failed.");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "6px" }}>Profile</h1>
        <p style={{ marginTop: 0, color: "#64748b" }}>Manage your account details and security preferences.</p>
        <Notification message={message} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
          <form onSubmit={handleProfileChange} style={{ display: "grid", gap: "10px", padding: "20px", borderRadius: "14px", background: "#fff", boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)" }}>
            <h3 style={{ margin: "0 0 4px" }}>Personal Information</h3>
            <input type="text" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            <input type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            <button type="submit" style={{ padding: "10px 14px", border: 0, borderRadius: "8px", background: "#2563eb", color: "#fff", cursor: "pointer" }}>Save Profile</button>
          </form>

          <form onSubmit={handlePasswordChange} style={{ display: "grid", gap: "10px", padding: "20px", borderRadius: "14px", background: "#fff", boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)" }}>
            <h3 style={{ margin: "0 0 4px" }}>Change Password</h3>
            <input type="password" placeholder="Current Password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            <input type="password" placeholder="New Password" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
            <button type="submit" style={{ padding: "10px 14px", border: 0, borderRadius: "8px", background: "#0f766e", color: "#fff", cursor: "pointer" }}>Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;