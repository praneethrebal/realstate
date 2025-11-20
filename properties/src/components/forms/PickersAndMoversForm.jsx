import React, { useState } from "react";
import { BaseUrl } from "../../api/BaseUrl";
import "../../styles/PickersAndMoversForm.css";
import { useAuth } from "../../hooks/useAuth";
import img from "../../../public/images/packers-movers.jpg";

function PickersAndMoversForm() {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    customerName: "",
    number: "",
    alternateNumber: "",
    typeOfService: "",
    fromLocation: "",
    toLocation: "",
    fromFloor: "",
    toFloor: "",
    noOfMenPower: "",
    typeOfVehicle: "",
    additionalInfo: "",
  });

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await BaseUrl.post(
        `/forms/PackersAndMoversForm`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Form submitted successfully:", response.data);
      alert("Form submitted successfully!");
      setFormData({
        customerName: "",
        number: "",
        alternateNumber: "",
        typeOfService: "",
        fromLocation: "",
        toLocation: "",
        fromFloor: "",
        toFloor: "",
        noOfMenPower: "",
        typeOfVehicle: "",
        additionalInfo: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="packers-form-container">
      {/* ===== LEFT IMAGE ===== */}
      <div className="packers-form-image">
        <img src={img} alt="Packers and Movers" />
      </div>

      {/* ===== RIGHT FORM ===== */}
      <form onSubmit={handleSubmit} className="packers-form">
        <p>Packers & Movers Form</p>

        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handlechange}
          placeholder="Customer Name"
          required
        />

        <input
          type="text"
          name="number"
          value={formData.number}
          onChange={handlechange}
          placeholder="Phone Number"
          required
        />

        <div className="half-width-container">
          <input
            type="text"
            name="alternateNumber"
            value={formData.alternateNumber}
            onChange={handlechange}
            placeholder="Alternate Number"
          />
          <input
            type="text"
            name="typeOfService"
            value={formData.typeOfService}
            onChange={handlechange}
            placeholder="Type of Service"
          />
          <input
            type="text"
            name="fromLocation"
            value={formData.fromLocation}
            onChange={handlechange}
            placeholder="From Location"
          />
          <input
            type="text"
            name="toLocation"
            value={formData.toLocation}
            onChange={handlechange}
            placeholder="To Location"
          />
          <input
            type="text"
            name="fromFloor"
            value={formData.fromFloor}
            onChange={handlechange}
            placeholder="From Floor"
          />
          <input
            type="text"
            name="toFloor"
            value={formData.toFloor}
            onChange={handlechange}
            placeholder="To Floor"
          />
          <input
            type="text"
            name="noOfMenPower"
            value={formData.noOfMenPower}
            onChange={handlechange}
            placeholder="Number of Men Power"
          />
          <input
            type="text"
            name="typeOfVehicle"
            value={formData.typeOfVehicle}
            onChange={handlechange}
            placeholder="Type of Vehicle"
          />
        </div>

        <textarea
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handlechange}
          placeholder="Additional Information (optional)"
          rows={4}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default PickersAndMoversForm;
