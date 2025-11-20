import React, { useEffect, useState } from "react";
import { BaseUrl } from "../../api/BaseUrl";
import DefaultProfile from "../../assets/Default_profile_picture.jpeg";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ListingCards = ({
  apiEndpoint,
  heading,
  showSeeAllButton = true,
  users: propUsers,
  images: propImages,
}) => {
  const [users, setUsers] = useState(propUsers || []);
  const [images, setImages] = useState(propImages || {});
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleCall = (phone) => {
    if (phone) {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      if (isMobile) {
        window.location.href = `tel:${phone}`;
      } else {
        const whatsappNumber = phone.replace(/\D/g, "");
        alert(`Mobile number: ${whatsappNumber}`);
      }
    } else {
      console.error("No phone number available to call.");
    }
  };

  // ✅ Fetch user list
  useEffect(() => {
    if (propUsers) {
      setUsers(propUsers);
      if (propUsers.length === 0)
        setError(`No ${heading} found at the moment.`);
      else setError("");
      return;
    }

    if (apiEndpoint) {
      BaseUrl.get(apiEndpoint)
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setUsers(res.data);
            setError("");
          } else {
            setUsers([]);
            setError(`No ${heading} found at the moment.`);
          }
        })
        .catch(() => setError("Failed to fetch data."));
    }
  }, [apiEndpoint, heading, propUsers]);

  // ✅ Fetch user images
  useEffect(() => {
    if (propImages) {
      setImages(propImages);
      return;
    }

    if (!users.length) return;

    const fetchUserImages = async () => {
      const newImageMap = {};
      await Promise.all(
        users.map(async (user) => {
          try {
            const res = await BaseUrl.get(
              `/free-acess/getProfileImg/${user.id}`,
              { responseType: "blob" }
            );
            newImageMap[user.id] = URL.createObjectURL(res.data);
          } catch {
            newImageMap[user.id] = DefaultProfile;
          }
        })
      );
      setImages(newImageMap);
    };

    fetchUserImages();

    return () => {
      Object.values(images).forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [users, propImages]);

  const displayUsers = showSeeAllButton ? users.slice(0, 6) : users;

  return (
    <div className="listing-cards-wrapper" style={{ padding: "20px" }}>
      {error ? (
        <div
          style={{
            padding: "40px",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            color: "#555",
            fontSize: "16px",
          }}
        >
          ⚠️ {error}
        </div>
      ) : (
        <>
          <h3 className="mb-4" style={{ fontSize: "22px", fontWeight: 600 }}>
            Meet our {heading}
          </h3>

          {/* ✅ Card container */}
          <div className="listing-cards-container">
            {displayUsers.map((user) => (
              <div
                key={user.id}
                className="listing-card hover-card p-3 rounded-3 shadow"
                style={{
                  cursor: "pointer",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(5px)",
                  flex: "0 0 auto",
                }}
                onClick={() => nav(`/profile/${user.id}`)}
              >
                <div className="d-flex justify-content-center mb-2">
                  <img
                    src={images[user.id] || DefaultProfile}
                    alt={user.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #eee",
                    }}
                    onError={(e) => (e.target.src = DefaultProfile)}
                  />
                </div>

                <h5 className="text-left mb-1">{user.username}</h5>
                <p className="text-left mb-1">
                  Experience: {user.experience || 0} yrs
                </p>
                <p className="text-left mb-2">Deals: {user.deals || 0}</p>
                <p className="text-left mb-2">
                  Category: {user.category || "N/A"}
                </p>

                <button
                  className="custom-blue-btn w-100"
                  style={{ marginTop: "5px" }}
                  onClick={(e) => {
                    handleCall(user.phone);
                    e.stopPropagation();
                  }}
                >
                  Call
                </button>
              </div>
            ))}
          </div>

          {/* ✅ See All Button */}
          {showSeeAllButton && (
            <div
              className="see-all-btn shadow"
              onClick={() =>
                nav(
                  `/all-profiles?endpoint=${encodeURIComponent(
                    apiEndpoint
                  )}&heading=${encodeURIComponent(heading)}`
                )
              }
            >
              See All
            </div>
          )}

          {/* ✅ Styles */}
          <style>
            {`
            .listing-cards-container {
              display: flex;
              flex-wrap: wrap;
              gap: 20px;
            }

            .listing-card {
              width: 250px;
              transition: transform 0.3s, box-shadow 0.3s;
            }

            .hover-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            }

            .custom-blue-btn {
              background-color: #0d6efd;
              padding: 8px;
              color: white;
              border: none;
              border-radius: 10px;
              transition: transform 0.2s, box-shadow 0.2s;
            }

            .custom-blue-btn:hover {
              background-color: #0b5ed7;
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            }

            .see-all-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 120px;
              height: 45px;
              background-color: #28a745;
              color: #fff;
              cursor: pointer;
              font-weight: 600;
              font-size: 16px;
              border-radius: 10px;
              margin: 30px auto 0;
              transition: background-color 0.3s ease;
            }

            .see-all-btn:hover {
              background-color: #218838;
            }

            /* ✅ Mobile: Horizontal Scroll Fix */
            @media (max-width: 768px) {
              html, body {
                overflow-x: hidden;
              }

              .listing-cards-wrapper {
                max-width: 100vw;
                overflow: hidden;
              }

              .listing-cards-container {
                flex-wrap: nowrap;
                overflow-x: auto;
                overflow-y: hidden;
                scroll-snap-type: x mandatory;
                -webkit-overflow-scrolling: touch;
                padding-bottom: 10px;
                width: 100%;
                box-sizing: border-box;
              }

              .listing-card {
                flex: 0 0 80%;
                scroll-snap-align: start;
                margin-right: 15px;
                box-sizing: border-box;
              }

              .listing-cards-container::-webkit-scrollbar {
                display: none;
              }

              .listing-cards-container {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }

              .see-all-btn {
                width: 80%;
                height: 45px;
                margin: 20px auto 0;
              }
            }
          `}
          </style>
        </>
      )}
    </div>
  );
};

export default ListingCards;
