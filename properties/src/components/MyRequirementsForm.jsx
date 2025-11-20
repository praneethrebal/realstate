import React, { useState } from "react";
import { BaseUrl } from "../api/BaseUrl";
import { useAuth } from "../hooks/useAuth";
import "../styles/MyRequirementsForm.css";

function MyRequirementsForm() {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    propertyType: "",
    bhkType: "",
    budget: "",
    city: "",
    state: "",
    approvalType: "",
    companyName: "",
    extent: "",
    facing: "",
    location: "",
    projectName: "",
    contactNumber: "",
    alternateContactNumber: "",
  });

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await BaseUrl.post(
        `/forms/FutureRequirementsForm`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Form submitted successfully:", response.data);
      alert("Form submitted successfully!");
      setFormData({
        propertyType: "",
        bhkType: "",
        budget: "",
        city: "",
        state: "",
        approvalType: "",
        companyName: "",
        extent: "",
        facing: "",
        location: "",
        projectName: "",
        contactNumber: "",
        alternateContactNumber: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="requirements-container">
      {/* ===== LEFT IMAGE ===== */}
      <div className="requirements-image">
        <img src="/images/requirements.jpg" alt="Requirements" />
      </div>

      {/* ===== RIGHT FORM ===== */}
      <form className="requirements-form" onSubmit={handleSubmit}>
        <p className="form-title">My Requirements</p>

        <input
          type="text"
          name="propertyType"
          value={formData.propertyType}
          onChange={handlechange}
          placeholder="Property Type"
        />
        <input
          type="text"
          name="bhkType"
          value={formData.bhkType}
          onChange={handlechange}
          placeholder="BHK Type"
        />
        <input
          type="text"
          name="budget"
          value={formData.budget}
          onChange={handlechange}
          placeholder="Budget"
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handlechange}
          placeholder="City"
        />
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handlechange}
          placeholder="State"
        />
        <input
          type="text"
          name="approvalType"
          value={formData.approvalType}
          onChange={handlechange}
          placeholder="Approval Type"
        />
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handlechange}
          placeholder="Company Name"
        />
        <input
          type="text"
          name="extent"
          value={formData.extent}
          onChange={handlechange}
          placeholder="Extent"
        />
        <input
          type="text"
          name="facing"
          value={formData.facing}
          onChange={handlechange}
          placeholder="Facing"
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handlechange}
          placeholder="Location"
        />
        <input
          type="text"
          name="projectName"
          value={formData.projectName}
          onChange={handlechange}
          placeholder="Project Name"
        />
        <input
          type="text"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handlechange}
          placeholder="Contact Number"
        />
        <input
          type="text"
          name="alternateContactNumber"
          value={formData.alternateContactNumber}
          onChange={handlechange}
          placeholder="Alternate Contact Number"
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default MyRequirementsForm;
