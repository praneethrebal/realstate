import React, { useEffect, useState } from "react";
import { BaseUrl } from "../../api/BaseUrl";
import { useAuth } from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import "../../styles/Profile.css";

export default function Profile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await BaseUrl.get(`/free-acess/profile/${userId}`);
        setProfile(res.data);

        // fetch profile image separately
        const imgRes = await BaseUrl.get(
          `/free-acess/getProfileImg/${userId}`,
          {
            responseType: "blob",
          }
        );
        const imgUrl = URL.createObjectURL(imgRes.data);
        setProfileImg(imgUrl);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, userId]);

  if (loading) return <p className="loading">Loading profile...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!profile) return null;

  return (
    <div className="profile-container">
      {/* ---------- Profile Header ---------- */}
      <div className="profile-card">
        <div className="profile-top">
          <img
            src={profileImg || "/default-avatar.png"}
            alt="Profile"
            className="profile-img"
          />
          <div className="profile-text">
            <h2>{profile.user.username || "Company Name"}</h2>
            <p className="category">{profile.user.category}</p>
            <p className="email">{profile.user.my_referralCode}</p>
            <p className="location">
              📍 {profile.user.location || "Unknown location"}
            </p>
          </div>
        </div>

        {/* ---------- Stats ---------- */}
        <div className="profile-stats">
          <div className="stat-box">
            <h3>{profile.soldout}</h3>
            <p>Sold</p>
          </div>
          <div className="stat-box">
            <h3>{profile.pending}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-box">
            <h3>{Number(profile.soldout) + Number(profile.pending) || 0}</h3>
            <p>Total</p>
          </div>
        </div>

        {/* ---------- Contact Info ---------- */}
        <div className="profile-details">
          <div>
            <strong>Username:</strong> {profile.user.username}
          </div>
          <div>
            <strong>Email:</strong> {profile.user.email}
          </div>
          <div>
            <strong>Category:</strong> {profile.user.category}
          </div>
          <div>
            <strong>Experience:</strong> {profile.user.experience} Years
          </div>
          <div>
            <strong>Location:</strong> {profile.user.location}
          </div>
          <div>
            <strong>Description:</strong> {profile.user.description}
          </div>
        </div>

        {/* ---------- Action Buttons ---------- */}
        <div className="profile-buttons">
          {/* <button className="btn primary">Upload Property</button>
          <button className="btn secondary">Saved</button> */}
          <button className="btn reels">Contact</button>
        </div>
      </div>
    </div>
  );
}
