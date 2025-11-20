import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { BaseUrl } from "../../api/BaseUrl";
import DefaultProfile from "../../assets/Default_profile_picture.jpeg";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../Footer";
import NavBar from "../NavBar";

export default function AllProfilesPage() {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [images, setImages] = useState({});
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    username: "",
    category: "",
    experience: "",
  });

  const queryParams = new URLSearchParams(location.search);
  const apiEndpoint = queryParams.get("endpoint");
  const heading = queryParams.get("heading");

  // ✅ Fetch user data
  useEffect(() => {
    if (!apiEndpoint) return;

    BaseUrl.get(apiEndpoint.startsWith("/") ? apiEndpoint : `/${apiEndpoint}`)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setUsers(res.data);
          setFilteredUsers(res.data);
          setError("");
        } else {
          setError(`No ${heading} found.`);
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Failed to fetch data.");
      });
  }, [apiEndpoint]);

  // ✅ Fetch user images
  useEffect(() => {
    if (!users.length) return;

    const fetchImages = async () => {
      const newImageMap = {};
      await Promise.all(
        users.map(async (user) => {
          try {
            const res = await BaseUrl.get(
              `/free-acess/getProfileImg/${user.id}`,
              {
                responseType: "blob",
              }
            );
            newImageMap[user.id] = URL.createObjectURL(res.data);
          } catch {
            newImageMap[user.id] = DefaultProfile;
          }
        })
      );
      setImages(newImageMap);
    };

    fetchImages();
  }, [users]);

  // ✅ Handle input change
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // ✅ Apply filters
  const applyFilters = () => {
    let filtered = [...users];

    if (filters.username) {
      filtered = filtered.filter((u) =>
        u.username?.toLowerCase().includes(filters.username.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter((u) =>
        u.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.experience) {
      filtered = filtered.filter((u) =>
        String(u.experience || "")
          .toLowerCase()
          .includes(filters.experience.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  // ✅ Reset filters
  const resetFilters = () => {
    setFilters({ username: "", category: "", experience: "" });
    setFilteredUsers(users);
  };

  // ✅ Handle profile card click to redirect
  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`); // Redirect to /profile/:userId with userId in URL
  };

  return (
    <div style={{ padding: "30px", width: "100vw", marginTop: "100px" }}>
      <NavBar />
      <h3 className="mb-4 text-center">All {heading}</h3>

      {/* 🔍 Filter Section */}
      <div
        className="d-flex justify-content-center gap-3 flex-wrap mb-4"
        style={{ maxWidth: "700px", margin: "0 auto" }}
      >
        <input
          type="text"
          name="username"
          placeholder="Search by name"
          value={filters.username}
          onChange={handleFilterChange}
          className="form-control w-25"
        />
        <input
          type="text"
          name="category"
          placeholder="Search by category"
          value={filters.category}
          onChange={handleFilterChange}
          className="form-control w-25"
        />
        <input
          type="text"
          name="experience"
          placeholder="Experience"
          value={filters.experience}
          onChange={handleFilterChange}
          className="form-control w-25"
        />
        <button className="btn btn-primary" onClick={applyFilters}>
          Apply
        </button>
        <button className="btn btn-outline-secondary" onClick={resetFilters}>
          Reset
        </button>
      </div>

      {/* 🧑 Profile Listing */}
      {error ? (
        <div className="text-center text-danger">{error}</div>
      ) : (
        <div
          className="d-flex flex-wrap gap-3 justify-content-center"
          style={{ padding: "30px" }}
        >
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-3 shadow rounded-3 text-center"
              style={{
                width: "250px",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(5px)",
                cursor: "pointer",
              }}
              onClick={() => handleProfileClick(user.id)} // Handle card click
            >
              <img
                src={images[user.id] || DefaultProfile}
                alt={user.username}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #eee",
                }}
                onError={(e) => (e.target.src = DefaultProfile)}
              />
              <h5 className="mt-2">{user.username}</h5>
              <p>Experience: {user.experience || 0} yrs</p>
              <p>Deals: {user.deals || 0}</p>
              <p>Category: {user.category || "N/A"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
