import React, { useEffect, useState } from "react";
import { BaseUrl } from "../../api/BaseUrl";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../NavBar";
import "../../styles/CompanyProfile.css";

function CompanyProfile() {
  const [activeTab, setActiveTab] = useState("uploads");
  const [projects, setProjects] = useState({
    total: 0,
    ongoing: 0,
    completed: 0,
  });
  const [company, setCompany] = useState(null);
  const [uploadedProjects, setUploadedProjects] = useState([]);
  const [reels, setReels] = useState([]);
  const [dashboard, setDashboard] = useState({ views: 0, leads: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editForm, setEditForm] = useState({});
  const { token, userId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const paramUserId = queryParams.get("userid");
  const isOwner = !paramUserId || Number(paramUserId) === userId;

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        let url = "/companyProfile";
        if (paramUserId) url += `?userid=${Number(paramUserId)}`;

        // Fetch Company Profile
        const res = await BaseUrl.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompany(res.data);
        setEditForm(res.data);
        setProjects({
          total: res.data.totalProjects || 5,
          ongoing: res.data.ongoingProjects || 2,
          completed: res.data.completedProjects || 3,
        });

        // Fetch Wallpaper
        try {
          const wallpaperRes = await BaseUrl.get(
            `/getWallPaper/${res.data.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "blob",
            }
          );
          const wallpaperUrl = URL.createObjectURL(wallpaperRes.data);
          setCompany((prev) => ({ ...prev, companyWallpaper: wallpaperUrl }));
        } catch (err) {
          console.warn("No wallpaper found:", err);
        }

        // Fetch Logo
        try {
          const logoRes = await BaseUrl.get(`/getLogo/${res.data.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          });
          const logoUrl = URL.createObjectURL(logoRes.data);
          setCompany((prev) => ({ ...prev, companyLogo: logoUrl }));
        } catch (err) {
          console.warn("No logo found:", err);
        }

        // Fetch Dashboard metrics
        try {
          const viewsRes = await BaseUrl.get(`/getviewsCount/${res.data.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Fetch Leads if endpoint exists
          let leadsCount = 0;
          try {
            const leadsRes = await BaseUrl.get(
              `/getLeadsCount/${res.data.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            leadsCount = leadsRes.data;
          } catch (err) {
            console.warn("No leads data found:", err);
          }

          setDashboard({ views: viewsRes.data, leads: leadsCount });
        } catch (err) {
          console.warn("No dashboard data found:", err);
        }
      } catch (err) {
        console.error("Error fetching company profile:", err);
        setError("Failed to load company profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, [token, userId, paramUserId]);

  // Fetch Uploaded Projects
  const handleUploadsClick = async () => {
    if (!company?.id) return;
    try {
      const res = await BaseUrl.get(`/getProject/${company.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadedProjects(res.data);
      setActiveTab("uploads");
    } catch (err) {
      console.error("Error fetching uploaded projects:", err);
      setUploadedProjects([]);
    }
  };

  // Fetch Reels
  const handleReelsClick = async () => {
    if (!company?.id) return;
    try {
      const res = await BaseUrl.get(`/getReels/${company.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const reelsWithBlob = await Promise.all(
        res.data.map(async (reel) => {
          try {
            const videoRes = await BaseUrl.get(`/getReelVideo/${reel.id}`, {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "blob",
            });
            return { ...reel, videoUrl: URL.createObjectURL(videoRes.data) };
          } catch {
            return { ...reel, videoUrl: null };
          }
        })
      );

      setReels(reelsWithBlob);
      setActiveTab("reels");
    } catch (err) {
      console.error("Error fetching reels:", err);
      setReels([]);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await BaseUrl.put(`/companyProfile/${company.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");

      // ✅ Preserve logo and wallpaper after update
      setCompany((prev) => ({
        ...prev,
        ...res.data,
        companyWallpaper: prev.companyWallpaper,
        companyLogo: prev.companyLogo,
      }));

      setShowEditPopup(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Try again.");
    }
  };

  if (loading) return <div className="company-wrap">Loading...</div>;
  if (error) return <div className="company-wrap error">{error}</div>;

  return (
    <div className="company-wrap">
      <NavBar />

      {/* Wallpaper */}
      <div
        className="company-wallpaper"
        style={{
          backgroundImage: company?.companyWallpaper
            ? `url(${company.companyWallpaper})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "200px",
          width: "100%",
          marginTop: "100px",
          marginBottom: "100px",
        }}
      ></div>

      {/* Header */}
      <div className="header">
        <div className="avatar">
          {company?.companyLogo ? (
            <img
              src={company.companyLogo}
              alt="Company Logo"
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            company?.companyName?.[0]?.toUpperCase() || "C"
          )}
        </div>
        <div className="company-title">
          <h1>{company?.companyName || "Company Name"}</h1>
          <div className="location">
            📍 {company?.location || "Location not available"}
          </div>
        </div>
        <div
          className="header-buttons"
          style={{ marginLeft: "auto", display: "flex", gap: 10 }}
        >
          {isOwner && (
            <button className="add-btn" onClick={() => setShowEditPopup(true)}>
              ✏️ Edit Profile
            </button>
          )}
          <button
            className="add-btn contact-btn"
            onClick={() => navigate(`/contact-us/${company.id}`)}
          >
            Contact
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="top-row">
        <div className="about-card">
          <h2>About the Company</h2>
          <p className="muted">
            {company?.description || "No description available."}
          </p>
          <div className="stats">
            <div className="stat-card">
              <div className="label">Experience</div>
              <div className="value">{company?.experience || 0} Years</div>
            </div>
            <div className="stat-card">
              <div className="label">Total Projects</div>
              <div className="value">{projects.total}</div>
            </div>
            <div className="stat-card">
              <div className="label">Ongoing</div>
              <div className="value ongoing">{projects.ongoing}</div>
            </div>
            <div className="stat-card">
              <div className="label">Completed</div>
              <div className="value completed">{projects.completed}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="label">Subscription End</div>
            <div className="value completed">
              {company.companySubscriptionEndDate}
            </div>
          </div>
        </div>

        <div className="add-project">
          {isOwner && (
            <button
              className="add-btn full"
              onClick={() => navigate("/add-project")}
            >
              ➕ Add Project
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <div
          className={`tab ${activeTab === "uploads" ? "active" : ""}`}
          onClick={handleUploadsClick}
        >
          📁 Uploads
        </div>
        <div
          className={`tab ${activeTab === "reels" ? "active" : ""}`}
          onClick={handleReelsClick}
        >
          🎞️ Reels
        </div>
      </div>

      {/* Uploads */}
      {activeTab === "uploads" && (
        <div className="uploads-grid">
          {uploadedProjects.map((proj) => (
            <div key={proj.id} className="project-card">
              <div onClick={() => navigate(`/singleProject/${proj.id}`)}>
                <h4>{proj.projectName}</h4>
                <p>📍 {proj.projectLocation || "N/A"}</p>
                <p>🏗️ {proj.typeOfProject || "N/A"}</p>
                <p>💰 {proj.pricing || "N/A"}</p>
              </div>

              {/* 🗑️ Delete Project Button (only for owner) */}
              {isOwner && (
                <button
                  className="delete-btn"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const confirmDelete = window.confirm(
                      "Are you sure you want to delete this project?"
                    );
                    if (!confirmDelete) return;

                    try {
                      await BaseUrl.delete(
                        `/deleteProject/${company.id}/${proj.id}`,
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );
                      alert("✅ Project deleted successfully!");
                      setUploadedProjects((prev) =>
                        prev.filter((p) => p.id !== proj.id)
                      );
                    } catch (err) {
                      console.error("Error deleting project:", err);
                      alert("❌ Failed to delete project.");
                    }
                  }}
                  style={{
                    background: "#e11d48",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    marginTop: "8px",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  🗑️ Delete Project
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reels */}
      {activeTab === "reels" && (
        <div className="reels-grid">
          {reels.length === 0 ? (
            <div className="empty">No reels found.</div>
          ) : (
            reels.map(
              (reel) =>
                reel.videoUrl && (
                  <video
                    key={reel.id}
                    src={reel.videoUrl}
                    controls
                    muted
                    loop
                    style={{
                      width: "300px",
                      margin: "0.5rem",
                      borderRadius: "8px",
                    }}
                  />
                )
            )
          )}
        </div>
      )}

      {/* Dashboard Section */}
      <div className="dashboard-section">
        <h2>Dashboard</h2>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="label">Views</div>
            <div className="value">{dashboard.views}</div>
          </div>
          <div className="dashboard-card">
            <div className="label">Leads</div>
            <div className="value">{dashboard.leads}</div>
          </div>
        </div>
      </div>

      {/* Edit Popup */}
      {showEditPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>Edit Company Profile</h2>
            <form onSubmit={handleEditSubmit}>
              Company name{" "}
              <input
                type="text"
                name="companyName"
                value={editForm.companyName || ""}
                onChange={handleEditChange}
                placeholder="Company Name"
                required
              />
              Total Projects{" "}
              <input
                type="text"
                name="totalProjects"
                value={editForm.totalProjects || ""}
                onChange={handleEditChange}
                placeholder="Total Projects"
                required
              />
              Location{" "}
              <input
                type="text"
                name="location"
                value={editForm.location || ""}
                onChange={handleEditChange}
                placeholder="Location"
              />
              Experience(Years){" "}
              <input
                type="number"
                name="experience"
                value={editForm.experience || ""}
                onChange={handleEditChange}
                placeholder="Experience (years)"
              />
              Description{" "}
              <textarea
                name="description"
                value={editForm.description || ""}
                onChange={handleEditChange}
                placeholder="About your company"
              />
              <div className="popup-actions">
                <button type="submit" className="save-btn">
                  💾 Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditPopup(false)}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyProfile;
