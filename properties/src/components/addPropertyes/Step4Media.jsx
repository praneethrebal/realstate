import React, { useState, useEffect } from "react";
import { BaseUrl } from "../../api/BaseUrl";
import "../../styles/addProperty.css";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Step4Media = ({ formData, setFormData, prevStep }) => {
  const [uploading, setUploading] = useState(false);
  const { token, role } = useAuth();

  const navigate = useNavigate();
  useEffect(() => {
    if (formData.propertyId) {
      console.log("Property ID:", formData.propertyId);
    }
    console.log(role);
  }, [formData.propertyId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.propertyId) return alert("Property ID missing!");

    const data = new FormData();
    data.append("propertyId", formData.propertyId);

    if (formData.photos) {
      Array.from(formData.photos).forEach((file) => data.append("image", file));
    }
    if (formData.video) {
      data.append("video", formData.video);
    }
    if (role === "OWNER") {
      if (formData.documents) {
        Array.from(formData.documents).forEach((file) =>
          data.append("document", file)
        );
      }
    }

    try {
      const res = await BaseUrl.post(
        `/uploadImg/${formData.propertyId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Media uploaded successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="step">
      <h2>Upload Media</h2>

      <label>
        Photos (multiple):
        <input
          type="file"
          name="photos"
          multiple
          onChange={(e) => setFormData({ ...formData, photos: e.target.files })}
        />
      </label>

      <label>
        Video:
        <input
          type="file"
          name="video"
          onChange={(e) =>
            setFormData({ ...formData, video: e.target.files[0] })
          }
        />
      </label>
      {role === "OWNER" && (
        <label>
          Documents (multiple):
          <input
            type="file"
            name="documents"
            multiple
            onChange={(e) =>
              setFormData({ ...formData, documents: e.target.files })
            }
          />
        </label>
      )}

      <div className="buttons">
        <button type="button" onClick={prevStep}>
          ← Back
        </button>
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Post Property"}
        </button>
      </div>
    </form>
  );
};

export default Step4Media;
