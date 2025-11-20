import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { BaseUrl } from "../../api/BaseUrl";
import { useAuth } from "../../hooks/useAuth";
import NavBar from "../NavBar";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Form,
  Offcanvas,
} from "react-bootstrap";
import {
  FaBookmark,
  FaRegBookmark,
  FaShareAlt,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaLink,
} from "react-icons/fa";
import axios from "axios";

const SingleCategorie = () => {
  const { categorieName } = useParams();
  const [searchParams] = useSearchParams();
  const locationParam = searchParams.get("location");

  const { token } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [saved, setSaved] = useState({});
  const [loadingIds, setLoadingIds] = useState({});
  const [shareOpenId, setShareOpenId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    location: locationParam || "",
    verified: "",
    minPrice: "",
    maxPrice: "",
    roadFacing: "",
    look: "",
  });

  const nav = useNavigate();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await BaseUrl.get("/saved", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const map = {};
        res.data.forEach((item) => {
          map[item.property.id] = true;
        });
        setSaved(map);
      } catch (err) {
        console.error("Error fetching saved list:", err);
      }
    };
    fetchSaved();
  }, [token]);

  useEffect(() => {
    if (!categorieName) return;
    const url = locationParam
      ? `/search?location=${locationParam}&property=${categorieName}`
      : `/propertys/${categorieName}`;

    BaseUrl.get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setProperties(res.data);
        setFilteredProperties(res.data);
      })
      .catch((err) => console.error("Error fetching properties:", err));
  }, [categorieName, locationParam, token]);

  useEffect(() => {
    if (!properties.length) return;
    const loadImages = async () => {
      const urls = {};
      for (const property of properties) {
        const photo = property.photos?.[0];
        if (!photo?.id) continue;
        try {
          const res = await BaseUrl.get(`/getPropertyImage/${photo.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          });
          urls[property.id] = URL.createObjectURL(res.data);
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
    };
    loadImages();

    return () => {
      Object.values(imageUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [properties, token]);

  const handleSaveToggle = async (propertyId) => {
    const isCurrentlySaved = saved[propertyId];
    setLoadingIds((prev) => ({ ...prev, [propertyId]: true }));
    try {
      const apiBase = BaseUrl.defaults.baseURL.replace(/\/$/, "");
      const headers = { Authorization: `Bearer ${token}` };

      if (isCurrentlySaved) {
        await axios.delete(`${apiBase}/save/${propertyId}`, { headers });
      } else {
        await axios.post(`${apiBase}/save/${propertyId}`, {}, { headers });
      }

      setSaved((prev) => ({ ...prev, [propertyId]: !isCurrentlySaved }));
    } catch (error) {
      console.error("❌ Error toggling save:", error);
      alert("Failed to update save status. Please try again.");
    } finally {
      setLoadingIds((prev) => ({ ...prev, [propertyId]: false }));
    }
  };

  const applyFilters = () => {
    let updated = [...properties];

    if (filters.location)
      updated = updated.filter((p) =>
        p.location?.toLowerCase().includes(filters.location.toLowerCase())
      );

    if (filters.verified)
      updated = updated.filter(
        (p) => String(p._verifiedproperty) === filters.verified
      );

    if (filters.minPrice)
      updated = updated.filter((p) => p.price >= parseFloat(filters.minPrice));

    if (filters.maxPrice)
      updated = updated.filter((p) => p.price <= parseFloat(filters.maxPrice));

    if (filters.roadFacing)
      updated = updated.filter(
        (p) => p.facing?.toLowerCase() === filters.roadFacing.toLowerCase()
      );

    if (filters.look)
      updated = updated.filter(
        (p) => p.look?.toLowerCase() === filters.look.toLowerCase()
      );

    setFilteredProperties(updated);
    setShowFilters(false);
  };

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleReset = () => {
    const reset = {
      location: "",
      verified: "",
      minPrice: "",
      maxPrice: "",
      roadFacing: "",
      look: "",
    };
    setFilters(reset);
    setFilteredProperties(properties);
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

  const handleContactOwnerClick = (e, propertyId) => {
    e.stopPropagation(); // Prevent card navigation
    nav(`/contact-us/${propertyId}`);
  };

  const FilterSidebar = () => (
    <Card className="p-3 shadow-sm rounded-3">
      <h5 className="fw-bold mb-3">🔍 Filter Properties</h5>

      <Form.Group className="mb-3">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Enter location"
          style={{ backgroundColor: "white", color: "black" }}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Verified</Form.Label>
        <Form.Select
          name="verified"
          value={filters.verified}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </Form.Select>
      </Form.Group>

      <div className="d-flex gap-2 mb-3">
        <Form.Control
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleChange}
          placeholder="Min ₹"
          style={{ backgroundColor: "white", color: "black" }}
        />
        <Form.Control
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          placeholder="Max ₹"
          style={{ backgroundColor: "white", color: "black" }}
        />
      </div>

      <Form.Group className="mb-3">
        <Form.Label>Road Facing</Form.Label>
        <Form.Select
          name="roadFacing"
          value={filters.roadFacing}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="north">North</option>
          <option value="south">South</option>
          <option value="east">East</option>
          <option value="west">West</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Look (Sell / Rent)</Form.Label>
        <Form.Select name="look" value={filters.look} onChange={handleChange}>
          <option value="">All</option>
          <option value="Sell">Sell</option>
          <option value="Rent">Rent</option>
        </Form.Select>
      </Form.Group>

      <div className="d-flex justify-content-between">
        <Button variant="primary" onClick={applyFilters}>
          Apply
        </Button>
        <Button variant="outline-secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </Card>
  );

  return (
    <>
      <style>{`
      .filter-sidebar {
  position: sticky;
  top: 90px; /* adjust to match navbar height */
  left: 70;
  width: 350px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  z-index: 5;
  margin-left: 0; /* stays fully left */
  height: calc(90vh - 100px); /* ⬅ fixed visible height */
  overflow-y: auto; /* ⬅ enables scrolling inside sidebar */
}
        .category-card:hover {
          transform: scale(1.01);
          transition: transform 0.2s ease-in-out;
        }
        .custom-blue-btn {
          background-color: #0d6efd;
          color: #fff;
          border: none;
          transition: background-color 0.2s ease-in-out;
        }
        .custom-blue-btn:hover {
          background-color: #0b5ed7;
        }
      `}</style>

      <NavBar />
      <Container fluid className="my-4 px-3" style={{ width: "100vw" }}>
        <div className="d-md-none text-left" style={{ marginTop: "70px" }}>
          <Button variant="primary" onClick={() => setShowFilters(true)}>
            Filters
          </Button>
        </div>

        <h2 className="text-center mb-4 fw-bold">
          {categorieName} {locationParam ? `in ${locationParam}` : ""}
        </h2>

        <Row className="g-4">
          <Col lg={3} md={4} className="d-none d-md-block">
            <div className="filter-sidebar">
              <FilterSidebar />
            </div>
          </Col>

          <Offcanvas
            show={showFilters}
            onHide={() => setShowFilters(false)}
            placement="start"
            className="d-md-none"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Filter Properties</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <FilterSidebar />
            </Offcanvas.Body>
          </Offcanvas>

          <Col lg={9} md={8} style={{ paddingLeft: "20px" }}>
            <Row className="g-4 justify-content-center">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => {
                  const isSaved = saved[property.id];
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
                          <div
                            className="flex-shrink-0"
                            style={{ flex: "0 0 42%", height: "100%" }}
                          >
                            <Card.Img
                              src={
                                imageUrls[property.id] ||
                                "https://via.placeholder.com/400x200?text=No+Image"
                              }
                              style={{
                                height: "100%",
                                objectFit: "cover",
                                borderTopLeftRadius: "0.5rem",
                                borderBottomLeftRadius: "0.5rem",
                              }}
                            />
                          </div>

                          <div className="flex-grow-1 d-flex flex-column">
                            <Card.Header className="d-flex justify-content-between align-items-center bg-transparent border-0 px-3 pt-3">
                              <span className="fw-medium">OWNER</span>
                              <div className="d-flex align-items-center gap-2">
                                {property._verifiedproperty && (
                                  <div className="d-flex align-items-center gap-1">
                                    <img
                                      src="/assets/verified_icon.png"
                                      alt="Verified"
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                      }}
                                    />
                                    <span className="text-success fw-semibold">
                                      Verified
                                    </span>
                                  </div>
                                )}
                                <Badge bg="dark">#{property.id}</Badge>
                              </div>
                            </Card.Header>

                            <Card.Body className="d-flex flex-column px-3">
                              <Card.Title className="fw-semibold mb-3">
                                {property.projectName ||
                                  property.selectProperty ||
                                  "Property"}
                              </Card.Title>
                              <Card.Text className="text-muted mb-4">
                                📍 {property.location || "Unknown"} <br />
                                🏠 {property.selectProperty || "-"} <br />
                                💰 ₹{property.price || "N/A"} <br />✨{" "}
                                {property.highlights || "-"}
                              </Card.Text>

                              <div className="d-flex gap-2 flex-wrap mt-auto">
                                <Button
                                  size="sm"
                                  className="custom-blue-btn flex-fill"
                                  onClick={(e) =>
                                    handleContactOwnerClick(e, property.id)
                                  }
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
                                onClick={() =>
                                  handleCopyLink(shareUrlsObj.link)
                                }
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
                <p className="text-center text-muted">No properties found.</p>
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SingleCategorie;
