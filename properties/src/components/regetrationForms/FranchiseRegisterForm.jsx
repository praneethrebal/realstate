import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileImageDefault from "../../assets/Default_profile_picture.jpeg";
import { BaseUrl } from "../../api/BaseUrl";
import "../../styles/FranchiseRegisterForm.css";

export default function FranchiseRegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    role: "FRANCHISE",
    description: "",
    location: "",
    experience: "",
    deals: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => setProfileImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (profileImage) data.append("profileImage", profileImage);

    try {
      const res = await BaseUrl.post("/login/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Franchise Registered:", res.data);
      // alert("Registration successful! Redirecting to login...");
      navigate("/login/user");
    } catch (err) {
      console.error(
        "❌ Registration error:",
        err.response?.data || err.message
      );
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="franchiseRegisterForm">
      <h1 className="formHeading">Franchise Register</h1>

      <form onSubmit={handleSubmit}>
        {/* Profile Image Upload */}
        <div
          className="profile-upload"
          onClick={() => document.getElementById("profileInput").click()}
        >
          <img
            src={
              profileImage
                ? URL.createObjectURL(profileImage)
                : ProfileImageDefault
            }
            alt="Profile Preview"
          />
          <span className="upload-text">Upload Profile Image</span>
          <input
            type="file"
            id="profileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

        {/* Input Fields */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="phone"
          placeholder="Contact Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="radies"
          placeholder="Radius"
          value={formData.deals}
          onChange={handleChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="experience"
          placeholder="Experience (Years)"
          value={formData.experience}
          onChange={handleChange}
        />

        <button type="submit">Register Franchise</button>
      </form>
    </div>
  );
}
