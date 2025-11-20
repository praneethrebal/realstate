import React, { useState } from "react";
import "../../styles/EmiCalculatorForm.css";
import { BaseUrl } from "../../api/BaseUrl";
import { useAuth } from "../../hooks/useAuth";

function EmiCalculatorForm() {
  const [formData, setFormData] = useState({
    totalAmount: "",
    rateOfInterest: "",
    month: "",
  });

  const [emi, setEmi] = useState(null);
  const { token } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["totalAmount", "rateOfInterest", "month"].includes(name)) {
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { totalAmount, rateOfInterest, month } = formData;

    if (!totalAmount || !rateOfInterest || !month) {
      alert("Please fill all fields before calculating EMI.");
      return;
    }

    try {
      const response = await BaseUrl.get(
        `/forms/emiAmount/${totalAmount}/${rateOfInterest}/${month}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("EMI calculated:", response.data);
      setEmi(Number(response.data));
    } catch (error) {
      console.error("Error calculating EMI:", error);
      alert("Error calculating EMI. Please try again.");
    }
  };

  return (
    <div className="emi-container">
      <form className="emi-form" onSubmit={handleSubmit}>
        <p>Calculate your EMI</p>

        <input
          type="text"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleChange}
          placeholder="Total Amount"
        />

        <input
          type="text"
          name="rateOfInterest"
          value={formData.rateOfInterest}
          onChange={handleChange}
          placeholder="Rate of Interest (%)"
        />

        <input
          type="text"
          name="month"
          value={formData.month}
          onChange={handleChange}
          placeholder="Loan Tenure (Months)"
        />

        <button type="submit">Calculate EMI</button>

        {emi !== null && (
          <h3>
            EMI AMOUNT: <span style={{ color: "green" }}>{emi.toFixed(2)}</span>
          </h3>
        )}
      </form>
    </div>
  );
}

export default EmiCalculatorForm;
