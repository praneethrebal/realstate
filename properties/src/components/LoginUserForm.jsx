import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../api/BaseUrl";
import { useAuth } from "../hooks/useAuth";
import "../styles/form.css";

export default function LoginUserForm() {
  const navigate = useNavigate();
  const { saveAuth, token } = useAuth(); // token from auth context
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    BaseUrl.post("/login/login", {
      usernameOrEmail: formData.usernameOrEmail,
      password: formData.password,
    })
      .then((res) => {
        // console.log(res.data);
        console.log("logs", res.data);
        saveAuth(res.data.token, res.data.role, res.data.username);
        console.log("token", token);

        navigate("/");
        // console.log("nav");
      })
      .catch((err) => {
        console.error(err);
        const message =
          err.response?.data?.message || "Login failed. Please try again.";
        setError(message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>User Login</h2>

        <div className="form-group">
          <label htmlFor="usernameOrEmail">Username or Email</label>
          <input
            type="text"
            id="usernameOrEmail"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            placeholder="Enter username or email"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            placeholder="Enter password"
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Don't have an account?{" "}
          <span onClick={() => navigate("/register/user")}>Register</span>
        </p>
      </form>
    </div>
  );
}
