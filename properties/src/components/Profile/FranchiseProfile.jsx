import React, { useEffect, useState } from "react";
import "../../styles/FranchiseProfile.css";
import ProfileImageDefault from "../../assets/Default_profile_picture.jpeg";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../../api/BaseUrl";

const FranchiseProfile = () => {
  const [franchise, setFranchise] = useState(null);
  const [assignedProps, setAssignedProps] = useState([]);
  const [verifiedProps, setVerifiedProps] = useState([]);
  const [pendingProps, setPendingProps] = useState([]);
  const [showAssigned, setShowAssigned] = useState(false);
  const [showVerified, setShowVerified] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedProp, setSelectedProp] = useState(null);
  const [verifyForm, setVerifyForm] = useState({
    sellerName: "",
    price: "",
    location: "",
    images: [],
    documents: [],
    videos: [],
  });
  const [profileImageUrl, setProfileImageUrl] = useState(ProfileImageDefault);

  const { token } = useAuth();
  const nav = useNavigate();

  // ================= NEW STATES FOR EDIT MODAL =================
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    description: "",
  });

  // ================= Fetch franchise details =================
  useEffect(() => {
    if (!token) return;
    const fetchFranchise = async () => {
      try {
        const res = await BaseUrl.get("/userdetails", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFranchise(res.data);
      } catch (err) {
        console.error("Error fetching franchise details:", err);
      }
    };
    fetchFranchise();
  }, [token]);

  // ================= Fetch assigned / verified / pending properties =================
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [assigned, verified, pending] = await Promise.all([
          BaseUrl.get("/fAssignedProp", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          BaseUrl.get("/verifiedProp", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          BaseUrl.get("/pendingProp", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAssignedProps(assigned.data);
        setVerifiedProps(verified.data);
        setPendingProps(pending.data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };

    fetchData();
  }, [token]);

  // ================= Fetch profile image =================
  useEffect(() => {
    if (!franchise?.id || !token) return;

    const fetchProfileImage = async () => {
      try {
        const res = await BaseUrl.get(`/getProfileImg/${franchise.id}`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // ✅ tell axios to return a blob
        });

        const imageUrl = URL.createObjectURL(res.data);
        setProfileImageUrl(imageUrl);
      } catch (err) {
        console.error("Error fetching profile image:", err);
        setProfileImageUrl(ProfileImageDefault);
      }
    };

    fetchProfileImage();

    return () => {
      if (profileImageUrl && profileImageUrl !== ProfileImageDefault) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };
  }, [franchise?.id, token]);

  // ================= Handle property verification =================
  const handleVerifySubmit = async () => {
    if (!selectedProp) return;

    try {
      const formData = new FormData();
      formData.append("sellerName", verifyForm.sellerName);
      formData.append("price", verifyForm.price);
      formData.append("location", verifyForm.location);
      Array.from(verifyForm.images).forEach((file) =>
        formData.append("images", file)
      );
      Array.from(verifyForm.documents).forEach((file) =>
        formData.append("documents", file)
      );
      Array.from(verifyForm.videos).forEach((file) =>
        formData.append("videos", file)
      );

      await BaseUrl.post(`/verifyProperty/${selectedProp.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Property verified successfully!");
      setShowVerifyModal(false);
      setAssignedProps((prev) => prev.filter((p) => p.id !== selectedProp.id));

      const res = await BaseUrl.get("/verifiedProp", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVerifiedProps(res.data);
    } catch (err) {
      console.error("Error verifying property:", err);
      alert("❌ Verification failed.");
    }
  };

  // ================= NEW HANDLERS FOR EDIT PROFILE =================
  const openEditModal = () => {
    if (franchise) {
      setEditForm({
        username: franchise.username || "",
        email: franchise.email || "",
        phone: franchise.phone || "",
        location: franchise.location || "",
        experience: franchise.experience || "",
        description: franchise.description || "",
      });
      setShowEditModal(true);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await BaseUrl.put(`/franchiseEdit/${franchise.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Profile updated successfully!");
      setFranchise((prev) => ({ ...prev, ...editForm }));
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating franchise profile:", err);
      alert("❌ Failed to update profile.");
    }
  };

  if (!franchise) return <p>Loading...</p>;

  return (
    <div className="franchise-card">
      {/* ================= Header Section ================= */}
      <div className="profile-header">
        <img
          src={profileImageUrl}
          alt="Profile"
          className="franchise-profile-pic"
          onError={(e) => (e.target.src = ProfileImageDefault)}
        />
        <h2>{franchise.username}</h2>
      </div>

      {/* ================= Details Section ================= */}
      <div className="franchise-details">
        <p>
          <strong>Email:</strong> {franchise.email}
        </p>
        <p>
          <strong>Contact:</strong> {franchise.phone}
        </p>
        <p>
          <strong>Location:</strong> {franchise.location || "Not specified"}
        </p>
        <p>
          <strong>Radious:</strong> {franchise.radious || "Not specified"}
        </p>
        <p>
          <strong>Experience:</strong>{" "}
          {franchise.experience
            ? `${franchise.experience} Years`
            : "Not specified"}
        </p>
        {franchise.description && (
          <p style={{ gridColumn: "1 / span 2" }}>
            <strong>Description:</strong> {franchise.description}
          </p>
        )}
      </div>

      {/* ================= Edit Button ================= */}
      <button
        className="edit btn btn-primary"
        onClick={openEditModal}
        style={{ margin: "10px" }}
      >
        Edit Profile
      </button>

      {/* ================= Property Section Cards ================= */}
      <div className="property-sections-grid">
        <div
          className="property-card assigned"
          onClick={() => setShowAssigned(!showAssigned)}
        >
          <h4>Assigned Properties</h4>
          <p>{assignedProps.length}</p>
          <span>{showAssigned ? "Hide List" : "View List"}</span>
        </div>

        <div
          className="property-card verified"
          onClick={() => setShowVerified(!showVerified)}
        >
          <h4>Verified Properties</h4>
          <p>{verifiedProps.length}</p>
          <span>{showVerified ? "Hide List" : "View List"}</span>
        </div>

        <div
          className="property-card pending"
          onClick={() => setShowPending(!showPending)}
        >
          <h4>Pending Properties</h4>
          <p>{pendingProps.length}</p>
          <span>{showPending ? "Hide List" : "View List"}</span>
        </div>
      </div>

      {/* ================= Property Lists ================= */}
      {showAssigned && (
        <div className="property-list-card">
          <h4>Assigned Properties</h4>
          <ul>
            {assignedProps.length > 0 ? (
              assignedProps.map((prop) => (
                <li key={prop.id}>
                  <div
                    className="property-info"
                    onClick={() => nav(`/singleProperty/${prop.id}`)}
                  >
                    <strong>{prop.title || prop.projectName}</strong> —{" "}
                    {prop.location}
                  </div>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      setSelectedProp(prop);
                      setShowVerifyModal(true);
                    }}
                  >
                    Verify
                  </button>
                </li>
              ))
            ) : (
              <p>No assigned properties found.</p>
            )}
          </ul>
        </div>
      )}

      {showVerified && (
        <div className="property-list-card">
          <h4>Verified Properties</h4>
          <ul>
            {verifiedProps.length > 0 ? (
              verifiedProps.map((vProp) => (
                <li
                  key={vProp.id}
                  onClick={() =>
                    nav(`/singleProperty/${vProp.virifiedProperty.id}`)
                  }
                >
                  <strong>{vProp.virifiedProperty.projectName}</strong> —{" "}
                  {vProp.virifiedProperty.location}
                </li>
              ))
            ) : (
              <p>No verified properties found.</p>
            )}
          </ul>
        </div>
      )}

      {showPending && (
        <div className="property-list-card">
          <h4>Pending Properties</h4>
          <ul>
            {pendingProps.length > 0 ? (
              pendingProps.map((pProp) => (
                <li
                  key={pProp.id}
                  onClick={() => nav(`/singleProperty/${pProp.id}`)}
                >
                  <strong>{pProp.projectName}</strong> — {pProp.location}
                </li>
              ))
            ) : (
              <p>No pending properties found.</p>
            )}
          </ul>
        </div>
      )}

      {/* ================= Verify Modal ================= */}
      {showVerifyModal && selectedProp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              Verify Property — {selectedProp.title || selectedProp.projectName}
            </h3>

            <label>Price</label>
            <input
              type="number"
              value={verifyForm.price}
              onChange={(e) =>
                setVerifyForm({ ...verifyForm, price: e.target.value })
              }
            />

            <label>Location</label>
            <input
              type="text"
              value={verifyForm.location}
              onChange={(e) =>
                setVerifyForm({ ...verifyForm, location: e.target.value })
              }
            />

            <label>Reviews</label>
            <input type="text" />

            <label>Videos</label>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={(e) =>
                setVerifyForm({ ...verifyForm, videos: e.target.files })
              }
            />

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowVerifyModal(false)}
              >
                Cancel
              </button>

              <button className="btn btn-primary" onClick={handleVerifySubmit}>
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Edit Profile Modal ================= */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Profile</h3>

            <label>Email</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
            />

            <label>Phone</label>
            <input
              type="text"
              value={editForm.phone}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
            />

            <label>Location</label>
            <input
              type="text"
              value={editForm.location}
              onChange={(e) =>
                setEditForm({ ...editForm, location: e.target.value })
              }
            />

            <label>Experience (Years)</label>
            <input
              type="number"
              value={editForm.experience}
              onChange={(e) =>
                setEditForm({ ...editForm, experience: e.target.value })
              }
            />

            <label>Description</label>
            <input
              type="text"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
            />

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEditSubmit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseProfile;
