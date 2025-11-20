import React, { useEffect, useState } from "react";
import "../../styles/ProfilePage.css";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import { BaseUrl } from "../../api/BaseUrl";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [reels, setReels] = useState([]);
  const [editForm, setEditForm] = useState({});
  const [referals, setReferals] = useState([]);
  const [referralImages, setReferralImages] = useState({});
  const [showReferals, setShowReferals] = useState(false);

  const { token: contextToken, role: contextRole } = useAuth();
  const navigate = useNavigate();
  const token = contextToken || localStorage.getItem("token");
  const role = contextRole || localStorage.getItem("role");

  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (role && role.toUpperCase() === "COMPANY") {
      navigate("/companyprofile");
    }
  }, [role, navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (role && role.toUpperCase() === "COMPANY") return;

    const fetchUserAndImage = async () => {
      try {
        const userRes = await BaseUrl.get("/userdetails", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        setEditForm({
          username: userRes.data.username || "",
          email: userRes.data.email || "",
          category: userRes.data.category || "",
          experience: userRes.data.experience || 0,
          location: userRes.data.location || "",
          description: userRes.data.description || "",
          deals: userRes.data.deals || "",
        });

        try {
          const imgRes = await BaseUrl.get(
            `/free-acess/getProfileImg/${userRes.data.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "blob",
            }
          );
          setProfileImg(URL.createObjectURL(imgRes.data));
        } catch {
          setProfileImg("/default-avatar.png");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndImage();
  }, [token, navigate, role]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const res = await BaseUrl.put(`/userdetails`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setActiveSection("");
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const handleEditClick = () => setActiveSection("edit");

  const handleUploadClick = async () => {
    if (!user) return;
    try {
      const res = await BaseUrl.get(`/myUploads/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(res.data);
      setActiveSection("uploaded");
    } catch (err) {
      console.error(err);
      alert("Failed to fetch uploaded properties");
    }
  };

  const handleReelsClick = async () => {
    if (!user) return;
    try {
      const res = await BaseUrl.get(`/getReels/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedReels = res.data.map((reel) => ({
        ...reel,
        reelUrl: `${BaseUrl.defaults.baseURL}/uploads/reels/${reel.reelPath}`,
      }));
      setReels(updatedReels);
      setActiveSection("reels");
    } catch (err) {
      console.error(err);
      alert("Failed to fetch reels");
    }
  };

  const handleReferalClick = async () => {
    try {
      const res = await BaseUrl.get("/myreferals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReferals(res.data);
      setShowReferals(true);
      fetchReferralImages(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch referrals");
    }
  };

  const fetchReferralImages = async (refs) => {
    const images = {};
    await Promise.all(
      refs.map(async (ref) => {
        try {
          const imgRes = await BaseUrl.get(`/getProfileImg/${ref.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          });
          images[ref.id] = URL.createObjectURL(imgRes.data);
        } catch {
          images[ref.id] = "/default-avatar.png";
        }
      })
    );
    setReferralImages(images);
  };

  // ---------- Total Earnings Logic ----------
  const getPackagePrice = (planType) => {
    switch (planType) {
      case "COMPANY_PRO":
        return 19999;
      case "COMPANY_NORMAL":
        return 14999;
      case "MARKETER_EXPORT":
        return 7999;
      case "MARKETER_EXPORT_PRO":
        return 14999;
      case "PROFESSIONAL_SINGLE":
        return 4999;
      default:
        return 0;
    }
  };

  const totalPackage = referals.reduce(
    (acc, ref) => acc + getPackagePrice(ref.planType),
    0
  );
  const totalEarnings = totalPackage * 0.05; // ✅ Updated logic

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error)
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  if (!user) return null;

  return (
    <div className="profile-page">
      <NavBar />

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-top">
            <img
              src={profileImg || "/default-avatar.png"}
              alt="Profile"
              className="profile-img"
            />
            <div className="profile-text">
              <h2>{user.username}</h2>
              <p className="referral-code">
                <strong>Referral Code:</strong> {user.my_referralCode || "N/A"}
              </p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-box">
              <h3>{properties.length}</h3>
              <p>Uploaded</p>
            </div>
          </div>

          <div className="profile-details">
            <div>
              <strong>Category:</strong> {user.category}
            </div>
            <div>
              <strong>📍</strong> {user.location}
            </div>
            <div>
              <strong>Deals:</strong> {user.deals}
            </div>
            <div>
              <strong>Experience:</strong> {user.experience}
            </div>
            <div>
              <strong></strong> {user.description}
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn edit" onClick={handleEditClick}>
              Edit Profile
            </button>
            <button className="btn upload" onClick={handleUploadClick}>
              Uploaded
            </button>
            <button className="btn reels" onClick={handleReelsClick}>
              Reels
            </button>
            <button className="btn referal" onClick={handleReferalClick}>
              My Referrals
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Referrals Dashboard ---------- */}
      {showReferals && (
        <div
          className="referals-dashboard"
          style={{
            maxWidth: "1000px",
            margin: "2rem auto",
            background: "#fff",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "#463271",
              fontWeight: "600",
            }}
          >
            My Referrals
          </h3>

          {referals.length === 0 ? (
            <p style={{ textAlign: "center", color: "#777" }}>
              No referrals found.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {referals.map((ref) => (
                <div
                  key={ref.id}
                  style={{
                    background: "#f9fafb",
                    borderRadius: "12px",
                    padding: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 18px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.08)";
                  }}
                >
                  <img
                    src={referralImages[ref.id] || "/default-avatar.png"}
                    alt={ref.username || "User"}
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #ddd",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#463271",
                        margin: "0 0 0.25rem 0",
                      }}
                    >
                      {ref.username || ref.name || "Unnamed User"}
                    </h4>
                    <p
                      style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}
                    >
                      💰 <strong>Package:</strong> ₹
                      {getPackagePrice(ref.planType)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ---------- Total Earnings Display ---------- */}
          <div
            style={{
              marginTop: "2rem",
              textAlign: "center",
              fontSize: "1.1rem",
              fontWeight: "600",
              color: "#463271",
            }}
          >
            <p>🪙 Total Earnings : ₹{totalEarnings.toLocaleString()}</p>
          </div>
        </div>
      )}
      {activeSection === "edit" && (
        <div
          className="edit-profile-form"
          style={{
            maxWidth: "600px",
            margin: "2rem auto",
            background: "#fff",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              color: "#463271",
              marginBottom: "1rem",
            }}
          >
            Edit Profile
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditSubmit();
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <input
              type="text"
              name="username"
              value={editForm.username || ""}
              onChange={handleEditChange}
              placeholder="Username"
            />
            <input
              type="email"
              name="email"
              value={editForm.email || ""}
              onChange={handleEditChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="category"
              value={editForm.category || ""}
              onChange={handleEditChange}
              placeholder="Category"
            />
            <input
              type="number"
              name="experience"
              value={editForm.experience || ""}
              onChange={handleEditChange}
              placeholder="Experience (Years)"
            />
            <input
              type="text"
              name="location"
              value={editForm.location || ""}
              onChange={handleEditChange}
              placeholder="Location"
            />
            <textarea
              name="description"
              value={editForm.description || ""}
              onChange={handleEditChange}
              placeholder="Description"
              rows="4"
            />
            <input
              type="text"
              name="deals"
              value={editForm.deals || ""}
              onChange={handleEditChange}
              placeholder="Deals"
            />

            <button type="submit" className="btn save">
              Save Changes
            </button>
            <button
              type="button"
              className="btn cancel"
              onClick={() => setActiveSection("")}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
