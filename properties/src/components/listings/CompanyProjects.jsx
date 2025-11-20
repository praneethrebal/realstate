import React, { useEffect, useState } from "react";
import { BaseUrl } from "../../api/BaseUrl";
import "../company/CompanyProjects.css";
import { useNavigate } from "react-router-dom";

export default function CompanyProjects({ endpoint }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const initialVisible = 4; // ✅ Show first 4 projects initially
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // ✅ Fetch projects using BaseUrl
        const res = await BaseUrl.get(`/${endpoint}`, { headers });
        const projectsData = res.data || [];
        setProjects(projectsData);

        const imgs = {};
        await Promise.all(
          projectsData.map(async (project) => {
            if (project.images?.length > 0) {
              try {
                const resImg = await BaseUrl.get(
                  `/free-acess/getProjectImage/${project.images[0].id}`,
                  { headers, responseType: "blob" }
                );
                imgs[project.id] = URL.createObjectURL(resImg.data);
              } catch {
                imgs[project.id] = null;
              }
            } else {
              imgs[project.id] = null;
            }
          })
        );
        setImageUrls(imgs);
      } catch (err) {
        console.error("Error loading projects:", err);
        setError(
          `Failed to load projects. (${
            err.response?.status || "Network Error"
          })`
        );
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProjects();
    else {
      setError("No authentication token found. Please log in again.");
      setLoading(false);
    }
  }, [endpoint, token]);

  if (loading) return <div className="loading">Loading projects...</div>;
  if (error) return <div className="error">{error}</div>;

  if (projects.length === 0) {
    return (
      <div className="listing-cards-wrapper" style={{ padding: "20px" }}>
        <div
          style={{
            padding: "40px",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            color: "#555",
            fontSize: "16px",
            textAlign: "center",
          }}
        >
          ⚠️ No company profiles found at the moment.
        </div>
      </div>
    );
  }

  const displayedProjects = projects.slice(0, initialVisible);

  const handleCardClick = (projectId) => {
    navigate(`/singleProject/${projectId}`);
  };

  const handleSeeMoreClick = () => {
    navigate("/all-projects", { state: { projects, imageUrls } });
  };

  return (
    <div className="company-projects-container">
      <h2 className="section-title">Company Projects</h2>

      <div className="projects-row">
        {displayedProjects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => handleCardClick(project.id)}
          >
            {imageUrls[project.id] ? (
              <img
                src={imageUrls[project.id]}
                alt={project.projectName}
                className="project-image"
              />
            ) : (
              <div className="no-image">No Image Available</div>
            )}
            <div className="project-details">
              <p className="project-title">{project.projectName}</p>
              <p>
                <strong>Location:</strong> {project.projectLocation || "N/A"}
              </p>
              <p>
                <strong>Type:</strong> {project.typeOfProject || "N/A"}
              </p>
              <p>
                <strong>Pricing:</strong> {project.pricing || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {projects.length > 0 && (
        <div className="see-all" onClick={handleSeeMoreClick}>
          <span>See All</span>
        </div>
      )}
    </div>
  );
}
