import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const nextErrors = {};
    const emailPattern = /\S+@\S+\.\S+/;

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
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
      const response = await api.post("/auth/login", formData);
      login(response.data.user);
      setMessage(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f5f7ff, #eef2ff)", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "440px", padding: "28px", borderRadius: "16px", background: "#fff", boxShadow: "0 12px 35px rgba(15, 23, 42, 0.12)" }}>
        <h1 style={{ marginBottom: "8px" }}>Welcome Back</h1>
        <p style={{ marginTop: 0, color: "#64748b" }}>Sign in to manage your events and registrations.</p>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <div>
            <input type="email" name="email" placeholder="Enter Email" value={formData.email} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: errors.email ? "1px solid #ef4444" : "1px solid #cbd5e1" }} />
            {errors.email && <p style={{ color: "#ef4444", margin: "6px 0 0", fontSize: "0.9rem" }}>{errors.email}</p>}
          </div>
          <div>
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: errors.password ? "1px solid #ef4444" : "1px solid #cbd5e1" }} />
            {errors.password && <p style={{ color: "#ef4444", margin: "6px 0 0", fontSize: "0.9rem" }}>{errors.password}</p>}
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#334155" }}><input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} /> Show Password</label>
          <button type="submit" style={{ padding: "10px 14px", border: 0, borderRadius: "8px", background: "#2563eb", color: "#fff", cursor: "pointer" }}>Login</button>
        </form>
        <p style={{ marginTop: "12px" }}>No account? <Link to="/register" style={{ color: "#2563eb" }}>Create one</Link></p>
        <p style={{ color: "#0f766e" }}>{message}</p>
      </div>
    </div>
  );
}

export default Login;