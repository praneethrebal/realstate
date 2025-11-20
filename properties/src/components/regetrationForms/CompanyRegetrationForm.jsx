import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ProfileImageDefault from "../../assets/Default_profile_picture.jpeg";
import { BaseUrl } from "../../api/BaseUrl";
import "../../styles/CompanyRegisterForm.css";

export default function CompanyRegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    role: "COMPANY",
    companyName: "",
    Description: "",
    Experience: "",
    TotalProjects: "",
    OngoingProjects: "",
    CompletedProjects: "",
    CompanyAddress: "",
    phone: "",
    planType: "",
    selectedDuration: 1,
  });

  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyWallpaper, setCompanyWallpaper] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlanSelect = (plan) => {
    setFormData({ ...formData, planType: plan });
  };

  const handleFileChange = (e) => setCompanyLogo(e.target.files[0]);
  const handleWallpaperChange = (e) => setCompanyWallpaper(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Password check
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (companyLogo) data.append("companyLogo", companyLogo);
    if (companyWallpaper) data.append("companyWallpaper", companyWallpaper);

    try {
      const res = await BaseUrl.post("/login/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("✅ User registered:", res.data);

      // alert(" Registration successful! Redirecting to login...");
      navigate("/login/user"); // ✅ Redirect to login page
    } catch (err) {
      console.error(
        "❌ Registration error:",
        err.response?.data || err.message
      );
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="companyRegisterForm">
      <h1 className="formHeading">Company Register</h1>

      <form onSubmit={handleSubmit}>
        {/* MEDIA UPLOAD SECTION */}
        <div className="media-upload-section">
          {/* Wallpaper */}
          <div
            className="wallpaper-upload"
            onClick={() => document.getElementById("wallpaperInput").click()}
          >
            <img
              src={
                companyWallpaper
                  ? URL.createObjectURL(companyWallpaper)
                  : ProfileImageDefault
              }
              alt="Wallpaper Preview"
            />
            <span className="upload-text wallpaper-text">Upload Wallpaper</span>
            <input
              type="file"
              id="wallpaperInput"
              style={{ display: "none" }}
              onChange={handleWallpaperChange}
            />
          </div>

          {/* Logo */}
          <div
            className="logo-upload"
            onClick={() => document.getElementById("logoInput").click()}
          >
            <img
              src={
                companyLogo
                  ? URL.createObjectURL(companyLogo)
                  : ProfileImageDefault
              }
              alt="Logo Preview"
            />
            <span className="upload-text logo-text">Upload Logo</span>
            <input
              type="file"
              id="logoInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* INPUT FIELDS */}
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
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
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
          type="text"
          name="Description"
          placeholder="Description"
          value={formData.Description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Experience"
          placeholder="Experience (Years)"
          value={formData.Experience}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="TotalProjects"
          placeholder="Total Projects"
          value={formData.TotalProjects}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="OngoingProjects"
          placeholder="Ongoing Projects"
          value={formData.OngoingProjects}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="CompletedProjects"
          placeholder="Completed Projects"
          value={formData.CompletedProjects}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="CompanyAddress"
          placeholder="Company Address"
          value={formData.CompanyAddress}
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

        {/* PLAN OPTIONS */}
        <label>Choose Plan</label>
        <div className="plan-options">
          <button
            type="button"
            className={`blue-plan ${
              formData.planType === "COMPANY_NORMAL" ? "selected-plan" : ""
            }`}
            onClick={() => handlePlanSelect("COMPANY_NORMAL")}
          >
            ₹14999
          </button>

          <button
            type="button"
            className={`red-plan ${
              formData.planType === "COMPANY_PRO" ? "selected-plan" : ""
            }`}
            onClick={() => handlePlanSelect("COMPANY_PRO")}
          >
            ₹19999
          </button>
        </div>
        {formData.planType && (
          <div className="duration-section">
            <label>Select Duration</label>
            <select
              name="selectedDuration"
              value={formData.selectedDuration}
              onChange={handleChange}
              required
            >
              <option value="">--Select Duration--</option>
              <option value={1}>1 Month</option>
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
            </select>

            {/* TOTAL AMOUNT DISPLAY */}
            {formData.selectedDuration && (
              <p className="total-amount">
                <strong>Total Amount:</strong>{" "}
                {formData.planType === "COMPANY_NORMAL"
                  ? `₹${14999 * formData.selectedDuration}`
                  : `₹${19999 * formData.selectedDuration}`}
              </p>
            )}
          </div>
        )}

        <div style={{ display: "flex" }}>
          <span>
            <input type="checkbox" required style={{ marginRight: "1px" }} />
          </span>
          <span>
            <Link to="/TermsAndConditions">Terms & Conditions</Link>
          </span>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
