import { useState } from "react";

import "../../styles/BuildWithConfidence.css";
import { useAuth } from "../../hooks/useAuth";
import { BaseUrl } from "../../api/BaseUrl";
import constructionImg from "../../../public/images/construction.jpg"; // ✅ image import

function BuildWithConfidence() {
  const { token } = useAuth();
  const [formData, setFormData] = useState({});

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await BaseUrl.post(`/forms/ConstructionForm`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Form submitted successfully", response.data);
      alert("Form submitted successfully!");
      setFormData({});
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Error submitting form!");
    }
  };

  return (
    <div className="construction-form-container">
      {/* Left Side Image */}
      <div className="construction-form-image">
        <img src={constructionImg} alt="Construction Work" />
      </div>

      {/* Right Side Form */}
      <form className="construction-form" onSubmit={handleSubmit}>
        <p>Construction</p>

        <input
          type="text"
          name="customerName"
          value={formData.customerName || ""}
          onChange={handlechange}
          placeholder="Customer Name"
          required
        />

        <input
          type="text"
          name="number"
          value={formData.number || ""}
          onChange={handlechange}
          placeholder="Number"
          required
        />

        <input
          type="text"
          name="alternateNumber"
          value={formData.alternateNumber || ""}
          onChange={handlechange}
          placeholder="Alternate Number"
        />

        <input
          type="text"
          name="typeOfService"
          value={formData.typeOfService || ""}
          onChange={handlechange}
          placeholder="Type of Service"
          required
        />

        <input
          type="text"
          name="location"
          value={formData.location || ""}
          onChange={handlechange}
          placeholder="Location"
          required
        />

        <textarea
          name="additionalInfo"
          value={formData.additionalInfo || ""}
          onChange={handlechange}
          placeholder="Additional Information"
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default BuildWithConfidence;
