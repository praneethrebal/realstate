import { useState } from "react";
import "../../styles/FranchiseForm.css";
import { useAuth } from "../../hooks/useAuth";
import { BaseUrl } from "../../api/BaseUrl";

function FranchiseForm() {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    preferredLocation: "",
    businessExperience: "",
    reasonToStartFranchise: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });

  // ✅ Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await BaseUrl.post(`/forms/FranchiseForm`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatus({ type: "success", message: "Form submitted successfully!" });
      console.log("Form submitted successfully:", response.data);

      // ✅ Clear form after success
      setFormData({
        name: "",
        email: "",
        contact: "",
        preferredLocation: "",
        businessExperience: "",
        reasonToStartFranchise: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="franchise-form-container">
      <form className="franchise-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Franchise Application</h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
        />
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          placeholder="Contact Number"
          required
        />
        <input
          type="text"
          name="preferredLocation"
          value={formData.preferredLocation}
          onChange={handleChange}
          placeholder="Preferred Location"
        />
        <input
          type="text"
          name="businessExperience"
          value={formData.businessExperience}
          onChange={handleChange}
          placeholder="Business Experience"
        />
        <textarea
          name="reasonToStartFranchise"
          value={formData.reasonToStartFranchise}
          onChange={handleChange}
          placeholder="Why do you want to start a franchise?"
          rows="4"
        ></textarea>

        <button type="submit" className="submit-btn">
          Submit Application
        </button>

        {status.message && (
          <p className={`form-status ${status.type}`}>{status.message}</p>
        )}
      </form>
    </div>
  );
}

export default FranchiseForm;
