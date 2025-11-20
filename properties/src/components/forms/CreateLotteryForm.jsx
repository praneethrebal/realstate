import React, { useState } from "react";
import { BaseUrl } from "../../api/BaseUrl";
import NavBar from "../NavBar";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
const CreateLotteryForm = () => {
  const [formData, setFormData] = useState({
    name: "", // ✅ Added name field
    phoneNumber: "",
    altNumber: "",
    address: "",
    adressURL: "",
    description: "",
    ticketPrice: "",
    totalTickets: "",
    property_value: "",
    drawDate: "", // ✅ New field added
    active: true,
    username: "",
  });

  const nav = useNavigate();
  const [images, setImages] = useState([]);
  const { token } = useAuth();

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Handle image uploads
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    images.forEach((file) => data.append("images", file));

    try {
      const res = await BaseUrl.post("/createLottry", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("🎉 Lottery added successfully!");
      nav("/");

      // Reset form
      setFormData({
        phoneNumber: "",
        altNumber: "",
        address: "",
        adressURL: "",
        description: "",
        ticketPrice: "",
        totalTickets: "",
        property_value: "",
        drawDate: "",
        active: true,
        username: "",
      });
      setImages([]);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to create lottery!");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <NavBar />
      <div
        className="card shadow-lg rounded-4"
        style={{ marginTop: "100px", marginBottom: "100px" }}
      >
        <div className="card-body p-4">
          <h2 className="text-center mb-4">🎟️ Create New Lottery</h2>

          <form onSubmit={handleSubmit}>
            {/* ✅ Lottery Name */}
            <div className="mb-3">
              <label className="form-label fw-bold">Owner Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            {/* Phone Number */}
            <div className="mb-3">
              <label className="form-label fw-bold">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                className="form-control"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Alternate Number */}
            <div className="mb-3">
              <label className="form-label fw-bold">Alternate Number</label>
              <input
                type="text"
                name="altNumber"
                className="form-control"
                value={formData.altNumber}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div className="mb-3">
              <label className="form-label fw-bold">Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* Address URL */}
            <div className="mb-3">
              <label className="form-label fw-bold">Address URL</label>
              <input
                type="url"
                name="adressURL"
                className="form-control"
                value={formData.adressURL}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Ticket Info */}
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Ticket Price</label>
                <input
                  type="number"
                  name="ticketPrice"
                  className="form-control"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Total Tickets</label>
                <input
                  type="number"
                  name="totalTickets"
                  className="form-control"
                  value={formData.totalTickets}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Property Value */}
            <div className="mb-3">
              <label className="form-label fw-bold">Property Value</label>
              <input
                type="text"
                name="property_value"
                className="form-control"
                value={formData.property_value}
                onChange={handleChange}
              />
            </div>

            {/* ✅ Lottery Draw Date */}
            <div className="mb-3">
              <label className="form-label fw-bold">Lottery Draw Date</label>
              <input
                type="date"
                name="drawDate"
                className="form-control"
                value={formData.drawDate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Username */}
            <div className="mb-3">
              <label className="form-label fw-bold">Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* Active Checkbox */}
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                name="active"
                id="active"
                className="form-check-input"
                checked={formData.active}
                onChange={handleChange}
              />
              <label htmlFor="active" className="form-check-label fw-bold">
                Active
              </label>
            </div>

            {/* Image Upload */}
            <div className="mb-3">
              <label className="form-label fw-bold">Upload Images</label>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                className="form-control"
                onChange={handleImageChange}
              />

              {images.length > 0 && (
                <>
                  <div className="d-flex flex-wrap mt-3">
                    {images.map((img, index) => (
                      <div key={index} className="me-2 mb-2">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`preview-${index}`}
                          width="100"
                          height="100"
                          style={{
                            objectFit: "cover",
                            borderRadius: "10px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger mt-2"
                    onClick={() => setImages([])}
                  >
                    Clear Images
                  </button>
                </>
              )}
            </div>

            {/* Submit */}
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary px-5 py-2">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLotteryForm;
