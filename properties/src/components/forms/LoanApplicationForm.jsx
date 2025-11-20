import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/LoanApplicationForm.css";
import { BaseUrl } from "../../api/BaseUrl";
import { useAuth } from "../../hooks/useAuth";

function LoanApplicationForm() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    streetAddress: "",
    unitNumber: "",
    city: "",
    state: "",
    zipCode: "",
    loanAmount: "",
    loanPurpose: "",
    dateOfApplication: "",
    employmentStatus: "",
    representedByRealtor: false,
    creditScoreRange: "",
    termsAgreed: false,
  });

  const [status, setStatus] = useState({ type: "", message: "" });

  // ✅ Handle changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await BaseUrl.post(`/forms/LoanApplicationForm`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatus({
        type: "success",
        message: "Application submitted successfully!",
      });

      // ✅ Reset form after success
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        streetAddress: "",
        unitNumber: "",
        city: "",
        state: "",
        zipCode: "",
        loanAmount: "",
        loanPurpose: "",
        dateOfApplication: "",
        employmentStatus: "",
        representedByRealtor: false,
        creditScoreRange: "",
        termsAgreed: false,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus({
        type: "error",
        message: "Error submitting form. Please try again.",
      });
    }
  };

  return (
    <div className="loan-form-container">
      {/* ===== LEFT IMAGE ===== */}
      <div className="loan-form-image">
        <img src="/images/loan.jpg" alt="Loan" />
      </div>

      {/* ===== RIGHT FORM ===== */}
      <form className="loan-form" onSubmit={handleSubmit}>
        <h2>Loan Application</h2>

        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        <div className="half-width-container">
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            placeholder="Street Address"
          />
          <input
            type="text"
            name="unitNumber"
            value={formData.unitNumber}
            onChange={handleChange}
            placeholder="Unit Number"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
          />
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            placeholder="Zip Code"
          />
          <input
            type="text"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
            placeholder="Loan Amount"
          />
          <input
            type="text"
            name="loanPurpose"
            value={formData.loanPurpose}
            onChange={handleChange}
            placeholder="Loan Purpose"
          />
          <input
            type="date"
            name="dateOfApplication"
            value={formData.dateOfApplication}
            onChange={handleChange}
          />
          <input
            type="text"
            name="employmentStatus"
            value={formData.employmentStatus}
            onChange={handleChange}
            placeholder="Employment Status"
          />
        </div>

        {/* Realtor Radio */}
        <div className="radio-container">
          <p>Are you represented by a realtor?</p>
          <label>
            <input
              type="radio"
              name="representedByRealtor"
              checked={formData.representedByRealtor === true}
              onChange={() =>
                setFormData({ ...formData, representedByRealtor: true })
              }
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="representedByRealtor"
              checked={formData.representedByRealtor === false}
              onChange={() =>
                setFormData({ ...formData, representedByRealtor: false })
              }
            />
            No
          </label>
        </div>

        <input
          type="text"
          name="creditScoreRange"
          value={formData.creditScoreRange}
          onChange={handleChange}
          placeholder="Credit Score Range"
        />

        <label className="terms-label">
          <input
            type="checkbox"
            name="termsAgreed"
            checked={formData.termsAgreed}
            onChange={handleChange}
            required
          />
          I agree to the terms and conditions
        </label>

        <button type="submit" className="submit-btn">
          Submit Application
        </button>

        {/* Status Message */}
        {status.message && (
          <p className={`form-status ${status.type}`}>{status.message}</p>
        )}

        {/* EMI Button */}
        <button
          type="button"
          className="emi-btn"
          onClick={() => navigate("/emi-calculator")}
        >
          Go to EMI Calculator
        </button>
      </form>
    </div>
  );
}

export default LoanApplicationForm;
