import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../../api/BaseUrl";
import { useAuth } from "../../hooks/useAuth";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import {
  FaBookmark,
  FaRegBookmark,
  FaShareAlt,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaLink,
} from "react-icons/fa";
import NavBar from "../../components/NavBar";

const Saved = () => {
  const { token } = useAuth();
  const [savedProperties, setSavedProperties] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [loadingIds, setLoadingIds] = useState({});
  const [shareOpenId, setShareOpenId] = useState(null);

  const nav = useNavigate();

  // Fetch saved properties
  const fetchSaved = async () => {
    try {
      const res = await BaseUrl.get("/saved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedProperties(res.data);

      const map = {};
      res.data.forEach((item) => {
        map[item.property.id] = true;
      });
      setSavedMap(map);

      const urls = {};
      for (const item of res.data) {
        const property = item.property;
        const photo = property.photos?.[0];
        if (!photo?.id) continue;

        try {
          const imageRes = await BaseUrl.get(`/getPropertyImage/${photo.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          });
          urls[property.id] = URL.createObjectURL(imageRes.data);
        } catch (err) {
          console.error(
            `Failed to load image for property ${property.id}:`,
            err
          );
          urls[property.id] =
            "https://via.placeholder.com/400x200?text=No+Image";
        }
      }
      setImageUrls(urls);
    } catch (err) {
      console.error("Error fetching saved properties:", err);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, [token]);

  // ✅ Save / Unsave toggle logic
  const handleSaveToggle = async (propertyId) => {
    const isCurrentlySaved = savedMap[propertyId];
    setLoadingIds((prev) => ({ ...prev, [propertyId]: true }));

    try {
      const apiBase = BaseUrl.defaults.baseURL.replace(/\/$/, "");
      const headers = { Authorization: `Bearer ${token}` };

      if (isCurrentlySaved) {
        await BaseUrl.delete(`${apiBase}/save/${propertyId}`, { headers });
      } else {
        await BaseUrl.post(`${apiBase}/save/${propertyId}`, {}, { headers });
      }

      // Refresh saved list
      fetchSaved();
    } catch (error) {
      console.error("Error toggling save:", error);
      alert("Failed to update save status. Please try again.");
    } finally {
      setLoadingIds((prev) => ({ ...prev, [propertyId]: false }));
    }
  };

  const handleShareClick = (propertyId) => {
    setShareOpenId((prev) => (prev === propertyId ? null : propertyId));
  };

  const shareUrls = (property) => {
    const url = encodeURIComponent(
      window.location.origin + `/singleProperty/${property.id}`
    );
    return {
      whatsapp: `https://api.whatsapp.com/send?text=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      instagram: `https://www.instagram.com/?url=${url}`,
      link: window.location.origin + `/singleProperty/${property.id}`,
    };
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  return (
    <Container className="my-4" style={{ marginTop: "100px" }}>
      <NavBar />
      <h2 className="text-center fw-bold mb-4">Saved Properties</h2>
      <Row className="g-4">
        {savedProperties.length > 0 ? (
          savedProperties.map((item) => {
            const property = item.property;
            const isSaved = savedMap[property.id];
            const isLoading = loadingIds[property.id];
            const shareUrlsObj = shareUrls(property);

            return (
              <Col key={property.id} xs={12}>
                <Card
                  className="shadow-sm border-0 rounded-3 hover-card category-card"
                  style={{ cursor: "pointer", position: "relative" }}
                  onClick={() => nav(`/singleProperty/${property.id}`)}
                >
                  <div className="d-flex flex-column flex-md-row">
                    {/* Left Image */}
                    <div
                      className="flex-shrink-0"
                      style={{ flex: "0 0 40%", minHeight: "250px" }}
                    >
                      {imageUrls[property.id] ? (
                        <Card.Img
                          src={imageUrls[property.id]}
                          style={{ height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            height: "100%",
                            background: "rgba(255,255,255,0.05)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span className="text-muted">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Right Info */}
                    <div className="flex-grow-1 d-flex flex-column">
                      <Card.Header className="d-flex justify-content-between align-items-center bg-transparent border-0">
                        <span className="fw-medium">OWNER</span>
                        <Badge bg="dark">#{property.id}</Badge>
                      </Card.Header>

                      <Card.Body className="d-flex flex-column flex-grow-1">
                        <Card.Title className="fw-semibold">
                          {property.projectName ||
                            property.selectProperty ||
                            "Property"}
                        </Card.Title>
                        <Card.Text className="text-muted flex-grow-1">
                          📍 {property.location || "Unknown"} <br />
                          🏠 {property.selectProperty || "-"} <br />
                          💰 ₹{property.price || "N/A"} <br />✨{" "}
                          {property.highlights || "-"}
                        </Card.Text>

                        {/* Buttons */}
                        <div className="d-flex gap-2 mt-auto flex-wrap">
                          <Button
                            size="sm"
                            className="custom-blue-btn flex-fill"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(
                                "Call button clicked for",
                                property.id
                              );
                            }}
                          >
                            📞 Call
                          </Button>

                          <Button
                            size="sm"
                            className="custom-blue-btn flex-fill d-flex justify-content-center align-items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShareClick(property.id);
                            }}
                          >
                            <FaShareAlt /> Share
                          </Button>

                          {/* ✅ Save / Unsave Toggle */}
                          <Button
                            size="sm"
                            className={`custom-blue-btn flex-fill d-flex justify-content-center align-items-center ${
                              isSaved ? "saved" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveToggle(property.id);
                            }}
                            disabled={isLoading}
                            style={{ gap: "4px" }}
                          >
                            {isLoading ? (
                              "..."
                            ) : isSaved ? (
                              <>
                                <FaBookmark /> Unsave
                              </>
                            ) : (
                              <>
                                <FaRegBookmark /> Save
                              </>
                            )}
                          </Button>
                        </div>
                      </Card.Body>
                    </div>
                  </div>

                  {/* Share Popup */}
                  {shareOpenId === property.id && (
                    <div
                      className="share-popup p-2 shadow rounded bg-white"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                        minWidth: "200px",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h6 className="mb-2">Share Property</h6>
                      <div className="d-flex flex-column gap-2">
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => handleCopyLink(shareUrlsObj.link)}
                        >
                          <FaLink /> Copy Link
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-success"
                          href={shareUrlsObj.whatsapp}
                          target="_blank"
                        >
                          <FaWhatsapp /> WhatsApp
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          href={shareUrlsObj.facebook}
                          target="_blank"
                        >
                          <FaFacebookF /> Facebook
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          href={shareUrlsObj.instagram}
                          target="_blank"
                        >
                          <FaInstagram /> Instagram
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setShareOpenId(null)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </Col>
            );
          })
        ) : (
          <p className="text-center text-muted">No saved properties yet.</p>
        )}
      </Row>

      <style>
        {`
          .hover-card {
            transition: transform 0.3s, box-shadow 0.3s;
            background-color: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(5px);
          }
          .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          }
          .category-card {
            min-height: 280px;
          }
          @media (max-width: 768px) {
            .hover-card {
              flex-direction: column !important;
              transform: none !important;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
          }

          .custom-blue-btn {
            background-color: #0d6efd;
            color: white;
            border: none;
            transition: all 0.2s ease-in-out;
          }

          .custom-blue-btn:hover {
            background-color: #0b5ed7;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          }

          .custom-blue-btn.saved {
            background-color: #dc3545 !important;
            color: white !important;
          }

          .custom-blue-btn.saved:hover {
            background-color: #bb2d3b !important;
          }

          .custom-blue-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        `}
      </style>
    </Container>
  );
};

export default Saved;
