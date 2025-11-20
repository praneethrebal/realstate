import React, { useState } from "react";

import "../../styles/addProperty.css";
import { useAuth } from "../../hooks/useAuth";
import { BaseUrl } from "../../api/BaseUrl";

const Step3Final = ({ formData, setFormData, nextStep, prevStep }) => {
  // State to manage the input for custom amenities
  const [customAmenity, setCustomAmenity] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const { token } = useAuth();
  const submitStep3 = async () => {
    try {
      const res = await BaseUrl.post("/addProperty", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // The backend response contains the new property id
      const propertyId = res.data.id;

      // Save id in formData so Step 4 can use it
      setFormData({ ...formData, propertyId });

      // Move to next step
      nextStep();
    } catch (err) {
      console.error(err);
      alert("Failed to add property.");
    }
  };
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prevData) => {
      if (checked) {
        // Add selected amenity
        return { ...prevData, amenities: [...prevData.amenities, value] };
      } else {
        // Remove unselected amenity
        return {
          ...prevData,
          amenities: prevData.amenities.filter((item) => item !== value),
        };
      }
    });
  };

  // Function to handle adding a custom amenity
  const handleAddCustomAmenity = () => {
    const trimmedAmenity = customAmenity.trim();
    // Only add if the input is not empty and not already in the list
    if (trimmedAmenity && !formData.amenities.includes(trimmedAmenity)) {
      setFormData((prevData) => ({
        ...prevData,
        amenities: [...prevData.amenities, trimmedAmenity],
      }));
    }
    setCustomAmenity(""); // Clear the input field after adding or if it's a duplicate/empty
  };

  return (
    <form
      className="step"
      onSubmit={(e) => {
        e.preventDefault();
        submitStep3();
      }}
    >
      <h2>Final Details</h2>
      <div>
        <label>
          RERA Approved
          <input
            type="checkbox"
            name="reraApproved"
            checked={formData.reraApproved}
            onChange={(e) =>
              setFormData({ ...formData, reraApproved: e.target.checked })
            }
          />
        </label>
      </div>

      <input
        type="text"
        name="approvalType"
        placeholder="Type of Approval"
        value={formData.approvalType}
        onChange={handleChange}
      />

      <div>
        <h3>Select Amenities</h3>
        {["Swimming Pool", "Gym", "Playground", "Park", "Club House"].map(
          (amenity) => (
            <label
              key={amenity}
              style={{ display: "block", marginBottom: "5px" }}
            >
              <input
                type="checkbox"
                name="amenities"
                value={amenity}
                checked={formData.amenities.includes(amenity)}
                onChange={handleCheckboxChange}
              />
              {amenity}
            </label>
          )
        )}
      </div>

      {/* Input field for custom amenities */}
      <div style={{ marginTop: "10px" }}>
        <input
          type="text"
          placeholder="Add other amenity"
          value={customAmenity}
          onChange={(e) => setCustomAmenity(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button type="button" onClick={handleAddCustomAmenity}>
          Add
        </button>
      </div>
      {/* Display currently added amenities */}
      <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "5px" }}>
        Added: {formData.amenities.join(", ") || "None"}
      </p>

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
      />
      <input
        type="text"
        name="locationUrl"
        placeholder="Location URL"
        value={formData.locationUrl}
        onChange={handleChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Price (₹)"
        value={formData.price}
        onChange={handleChange}
      />

      <input
        type="text"
        name="highlights"
        placeholder="Highlights"
        value={formData.highlights}
        onChange={handleChange}
      />

      <div className="buttons">
        <button type="button" onClick={prevStep}>
          ← Back
        </button>
        <button type="submit">Next →</button>
      </div>
    </form>
  );
};

export default Step3Final;
