import React, { useEffect, useState } from "react";
import { BaseUrl } from "../../api/BaseUrl";
import DefaultProfile from "../../assets/Default_profile_picture.jpeg";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPhoneAlt } from "react-icons/fa";

const CompanyListing = ({
  apiEndpoint,
  heading,
  showSeeAllButton = true,
  companies: propCompanies, // Accept companies as a prop
}) => {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const nav = useNavigate();

  // Fetch companies and their images
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        let users = [];
        if (propCompanies) {
          users = propCompanies;
        } else if (apiEndpoint) {
          const res = await BaseUrl.get(apiEndpoint);
          users = Array.isArray(res.data) ? res.data : [];
        }

        if (users.length === 0) {
          setError(`No ${heading} found at the moment.`);
          setCompanies([]);
          return;
        }

        // Fetch all images concurrently for better performance
        const companiesWithImages = await Promise.all(
          users.map(async (user) => {
            try {
              const [logoRes, wallpaperRes] = await Promise.all([
                BaseUrl.get(`/free-acess/getLogo/${user.id}`, {
                  responseType: "blob",
                }),
                BaseUrl.get(`/free-acess/getWallPaper/${user.id}`, {
                  responseType: "blob",
                }),
              ]);
              return {
                ...user,
                logoUrl: URL.createObjectURL(logoRes.data),
                wallpaperUrl: URL.createObjectURL(wallpaperRes.data),
              };
            } catch (imgErr) {
              console.error(
                `Failed to load images for user ${user.id}:`,
                imgErr
              );
              return {
                ...user,
                logoUrl: DefaultProfile,
                wallpaperUrl: DefaultProfile,
              };
            }
          })
        );
        setCompanies(companiesWithImages);
        setError("");
      } catch (err) {
        setError("Failed to fetch data.");
        console.error("Error fetching companies:", err);
      }
    };

    fetchCompanies();

    // Cleanup object URLs to prevent memory leaks
    return () => {
      setCompanies((currentCompanies) => {
        currentCompanies.forEach((c) => {
          URL.revokeObjectURL(c.logoUrl);
          URL.revokeObjectURL(c.wallpaperUrl);
        });
        return [];
      });
    };
  }, [apiEndpoint, heading, propCompanies]); // propCompanies dependency is key here

  const handleCall = (phone) => {
    if (phone) {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      if (isMobile) {
        window.location.href = `tel:${phone}`;
      } else {
        // For desktop, open WhatsApp
        const whatsappNumber = phone.replace(/\D/g, ""); // Remove non-digit characters
        console.log("no", whatsappNumber);
        alert(`Mobile number : ${whatsappNumber}`);
        // window.open(`https://wa.me/${whatsappNumber}`, "_blank");
      }
    } else {
      console.error("No phone number available to call.");
    }
  };

  const displayCompanies = showSeeAllButton ? companies.slice(0, 4) : companies;

  return (
    <div
      className={`listing-cards-wrapper ${
        showSeeAllButton ? "preview-mode" : ""
      }`}
      style={{ padding: "20px" }}
    >
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

          {/* ✅ FLEX CONTAINER (LEFT ALIGNED) */}
          <div className="company-cards-container">
            {displayCompanies.map((user) => (
              <div
                key={user.id}
                className="listing-card hover-card p-3 rounded-3 shadow"
                style={{
                  width: "250px",
                  cursor: "pointer",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(5px)",
                }}
                onClick={async () => {
                  try {
                    // ✅ Increase views count before navigating
                    await BaseUrl.put(`/viewsCount/${user.id}`);
                  } catch (error) {
                    console.error("Error updating views:", error);
                  }

                  // ✅ Navigate to company profile page
                  nav(`/companyprofile?userid=${user.id}`);
                }}
              >
                <div
                  className="d-flex justify-content-center mb-2"
                  style={{ flexDirection: "column", position: "relative" }}
                >
                  <img
                    src={user.wallpaperUrl || DefaultProfile}
                    alt={user.name}
                    style={{
                      width: "100%",
                      height: "16%",
                      //   borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #eee",
                    }}
                    onError={(e) => (e.target.src = DefaultProfile)}
                  />
                  <img
                    src={user.logoUrl || DefaultProfile}
                    alt={user.name}
                    style={{
                      width: "4rem",
                      height: "4rem",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #eee",
                      justifyContent: "right",
                      position: "absolute",
                      bottom: "-20px",
                      right: "10px",
                      backgroundColor: "#fff",
                      zIndex: 1,
                    }}
                    onError={(e) => (e.target.src = DefaultProfile)}
                  />
                </div>
                <div style={{ marginTop: "30px", fontSize: "0.8rem" }}>
                  <h5
                    className="text-left mb-1"
                    style={{
                      fontSize: "1rem",
                      minHeight: "24px" /* 2 lines */,
                    }}
                  >
                    {user.companyName.length > 27
                      ? `${user.companyName.slice(0, 27)}...`
                      : user.companyName}
                  </h5>
                  <p className="text-left mb-1">
                    Experience: {user.experience || 0} yrs
                  </p>
                  <p className="text-left mb-2">Deals: {user.deals || 0}</p>
                  <p className="text-left mb-2">📍 {user.location | "N/A"}</p>
                </div>
                <button
                  className="custom-blue-btn w-100"
                  style={{ marginTop: "5px", backgroundColor: "green" }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card navigation
                    handleCall(user.phone);
                  }}
                >
                  <FaPhoneAlt /> Call
                </button>
              </div>
            ))}

            {/* ✅ See All button */}
            {showSeeAllButton && (
              <div
                className="d-flex align-items-center justify-content-center shadow"
                style={{
                  width: "200px",
                  height: "50px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                  borderRadius: "10px",
                  justifyContent: "center",
                  // marginTop: "50x",
                  padding: "0px",
                }}
                onClick={() =>
                  nav(
                    `/all-companies?endpoint=${encodeURIComponent(
                      apiEndpoint
                    )}&heading=${encodeURIComponent(heading)}`
                  )
                }
              >
                See All
              </div>
            )}
          </div>

          <style>
            {`
            .company-cards-container {
              display: flex;
              flex-wrap: wrap;
              justify-content: flex-start; /* LEFT ALIGN */
              gap: 20px;
              align-items: center;
            }
            
            .hover-card {
              transition: transform 0.3s, box-shadow 0.3s;
            }
            .hover-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 20px rgba(0,0,0,0.5);
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

            @media (max-width: 768px) {
              .company-cards-container {
                flex-direction: column;
                align-items: center;
              }
              .listing-card {
                width: 90% !important;
              }
              /* Only hide extra cards in preview mode on mobile */
              .preview-mode .listing-card:not(:first-child) {
                display: none; /* Hide all but the first card on mobile */
              }
            }
          `}
          </style>
        </>
      )}
    </div>
  );
};

export default CompanyListing;
