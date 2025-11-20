import React, { useState } from "react";
import "./Addforms.css";
import NavBar from "../NavBar";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../../api/BaseUrl";

const AddForms = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const bearerToken = localStorage.getItem("token");

  const [projectData, setProjectData] = useState({
    projectName: "",
    typeOfProject: "",
    projectLocation: "",
    locationUrl: "",
    numberOfUnits: "",
    availableUnits: "",
    availableFacings: "",
    availableSizes: "",
    reraApproved: "",
    amenities: [],
    highlights: "",
    typeOfApproval: "",
    totalProjectArea: "",
    contactInfo: "",
    pricing: "",
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [brochures, setBrochures] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleSaveTextData = async (data) => {
    try {
      const response = await BaseUrl.post(`/addProject`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error saving project data:",
        error.response?.data || error.message
      );
      return null;
    }
  };

  const handleStep2Next = async () => {
    const requiredFields = [
      "projectName",
      "typeOfProject",
      "projectLocation",
      "numberOfUnits",
    ];
    for (let field of requiredFields) {
      if (!projectData[field]) {
        alert(`Please fill ${field} before proceeding.`);
        return;
      }
    }

    const payload = {
      ...projectData,
      numberOfUnits: Number(projectData.numberOfUnits),
      availableUnits: Number(projectData.availableUnits || 0),
      totalProjectArea: Number(projectData.totalProjectArea || 0),
    };

    const projectId = await handleSaveTextData(payload);
    if (projectId) {
      setProjectData({ ...projectData, id: projectId });
      setCurrentStep(3);
    } else {
      alert("Failed to save project data. Check console for details.");
    }
  };

  const handleUploadMedia = async (projectId) => {
    try {
      const formData = new FormData();

      images.forEach((img) => formData.append("images", img));
      videos.forEach((vid) => formData.append("videos", vid));
      brochures.forEach((bro) => formData.append("brochures", bro));

      await BaseUrl.post(`/addProject/${projectId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${bearerToken}`,
        },
      });

      alert("Project and all media uploaded successfully!");
      setProjectData({
        projectName: "",
        typeOfProject: "",
        projectLocation: "",
        locationUrl: "",
        numberOfUnits: "",
        availableUnits: "",
        availableFacings: "",
        availableSizes: "",
        reraApproved: "",
        amenities: [],
        highlights: "",
        typeOfApproval: "",
        totalProjectArea: "",
        contactInfo: "",
        pricing: "",
      });
      setImages([]);
      setVideos([]);
      setBrochures([]);
      setCurrentStep(1);
      navigate("/");
    } catch (error) {
      console.error(
        "Error uploading media:",
        error.response?.data || error.message
      );
      alert("Failed to upload media. Check console for details.");
    }
  };

  const handleSubmitMedia = async () => {
    const projectId = projectData.id;
    if (!projectId) {
      alert("Project ID missing. Please save text data first.");
      return;
    }
    await handleUploadMedia(projectId);
  };

  return (
    <form className="forms-con" onSubmit={(e) => e.preventDefault()}>
      <NavBar />

      {currentStep === 1 && (
        <div className="form-box">
          <h2>Project Info</h2>
          <label>
            Project Name:
            <input
              type="text"
              name="projectName"
              value={projectData.projectName}
              onChange={handleChange}
              placeholder="Enter project name"
            />
          </label>
          <label>
            Type of Project:
            <input
              type="text"
              name="typeOfProject"
              value={projectData.typeOfProject}
              onChange={handleChange}
              placeholder="Enter type of project"
            />
          </label>
          <label>
            Project Location:
            <input
              type="text"
              name="projectLocation"
              value={projectData.projectLocation}
              onChange={handleChange}
              placeholder="Enter project location"
            />
          </label>
          <label>
            Location URL:
            <input
              type="url"
              name="locationUrl"
              value={projectData.locationUrl}
              onChange={handleChange}
              placeholder="Enter location URL"
            />
          </label>
          <label>
            Number of Units:
            <input
              type="number"
              name="numberOfUnits"
              value={projectData.numberOfUnits}
              onChange={handleChange}
              placeholder="Enter number of units"
            />
          </label>
          <button
            type="button"
            className="btn btn-blue"
            onClick={() => setCurrentStep(2)}
          >
            Next ➝
          </button>
        </div>
      )}

      {currentStep === 2 && (
        <div className="form-box">
          <h2>Specifications</h2>
          <label>
            Available Units:
            <input
              type="number"
              name="availableUnits"
              value={projectData.availableUnits}
              onChange={handleChange}
              placeholder="Enter available units"
            />
          </label>
          <label>
            Available Facings:
            <input
              type="text"
              name="availableFacings"
              value={projectData.availableFacings}
              onChange={handleChange}
              placeholder="Enter available facings"
            />
          </label>
          <label>
            Available Sizes:
            <input
              type="text"
              name="availableSizes"
              value={projectData.availableSizes}
              onChange={handleChange}
              placeholder="Enter available sizes"
            />
          </label>
          <label>
            RERA Approved:
            <select
              name="reraApproved"
              value={projectData.reraApproved}
              onChange={handleChange}
            >
              <option value="">Select RERA Approved</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>

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
                    checked={projectData.amenities.includes(amenity)}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setProjectData((prev) => ({
                        ...prev,
                        amenities: checked
                          ? [...prev.amenities, value]
                          : prev.amenities.filter((a) => a !== value),
                      }));
                    }}
                  />
                  {amenity}
                </label>
              )
            )}
          </div>

          <label>
            Highlights:
            <input
              type="text"
              name="highlights"
              value={projectData.highlights}
              onChange={handleChange}
              placeholder="Enter highlights"
            />
          </label>
          <label>
            Type of Approval:
            <input
              type="text"
              name="typeOfApproval"
              value={projectData.typeOfApproval}
              onChange={handleChange}
              placeholder="Enter type of approval"
            />
          </label>
          <label>
            Total Project Area:
            <input
              type="text"
              name="totalProjectArea"
              value={projectData.totalProjectArea}
              onChange={handleChange}
              placeholder="Enter total project area"
            />
          </label>
          <label>
            Contact Info:
            <input
              type="text"
              name="contactInfo"
              value={projectData.contactInfo}
              onChange={handleChange}
              placeholder="Enter contact info"
            />
          </label>
          <label>
            Pricing:
            <input
              type="text"
              name="pricing"
              value={projectData.pricing}
              onChange={handleChange}
              placeholder="Enter pricing"
            />
          </label>

          <div className="button-group">
            <button
              type="button"
              className="btn btn-blue"
              onClick={() => setCurrentStep(1)}
            >
              ← Back
            </button>
            <button
              type="button"
              className="btn btn-blue"
              onClick={handleStep2Next}
            >
              Next ➝
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="form-box">
          <h2>Media Upload</h2>

          <label>
            Upload Project Images (multiple):
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(e) =>
                setImages((prev) => [...prev, ...Array.from(e.target.files)])
              }
            />
          </label>
          {images.length > 0 && (
            <ul className="file-list">
              {images.map((file, index) => (
                <li key={index}>
                  📸 <span>{file.name}</span>
                  <span
                    className="delete-icon"
                    onClick={() =>
                      setImages((prev) => prev.filter((_, i) => i !== index))
                    }
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                  >
                    ❌
                  </span>
                </li>
              ))}
            </ul>
          )}

          <label>
            Upload Project Videos (multiple):
            <input
              type="file"
              multiple
              accept=".mp4,.webm"
              onChange={(e) =>
                setVideos((prev) => [...prev, ...Array.from(e.target.files)])
              }
            />
          </label>
          {videos.length > 0 && (
            <ul className="file-list">
              {videos.map((file, index) => (
                <li key={index}>
                  🎥 <span>{file.name}</span>
                  <span
                    className="delete-icon"
                    onClick={() =>
                      setVideos((prev) => prev.filter((_, i) => i !== index))
                    }
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                  >
                    ❌
                  </span>
                </li>
              ))}
            </ul>
          )}

          <label>
            Upload Brochures (multiple):
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={(e) =>
                setBrochures((prev) => [...prev, ...Array.from(e.target.files)])
              }
            />
          </label>
          {brochures.length > 0 && (
            <ul className="file-list">
              {brochures.map((file, index) => (
                <li key={index}>
                  📄 <span>{file.name}</span>
                  <span
                    className="delete-icon"
                    onClick={() =>
                      setBrochures((prev) => prev.filter((_, i) => i !== index))
                    }
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                  >
                    ❌
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="button-group">
            <button
              type="button"
              className="btn btn-blue"
              onClick={() => setCurrentStep(2)}
            >
              ← Back
            </button>
            <button
              type="button"
              className="btn btn-blue"
              onClick={handleSubmitMedia}
            >
              Submit ✅
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default AddForms;
