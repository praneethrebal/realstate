import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { BaseUrl } from "../../api/BaseUrl";
import { useAuth } from "../../hooks/useAuth";
import NavBar from "../NavBar";
import { FaPersonSwimming, FaDumbbell } from "react-icons/fa6";
import { GiSoccerField, GiParkBench } from "react-icons/gi";
import { MdHolidayVillage } from "react-icons/md";

const SingleProperty = () => {
  const { token } = useAuth();
  const { propId } = useParams();
  const [property, setProperty] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (!token) return;

    BaseUrl.get(`singleProperty/${propId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setProperty(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error("❌ Error fetching property:", err));
  }, [propId, token]);

  useEffect(() => {
    if (!property?.photos?.length) return;

    const loadImages = async () => {
      const urls = [];
      for (const photo of property.photos) {
        try {
          const res = await BaseUrl.get(`/getPropertyImage/${photo.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          });
          const blob = res.data;
          urls.push(URL.createObjectURL(blob));
        } catch {
          urls.push("https://via.placeholder.com/400x200?text=No+Image");
        }
      }
      setImageUrls(urls);
    };

    loadImages();
  }, [property, token]);

  useEffect(() => {
    if (!property?.videos?.length) return;

    const loadVideos = async () => {
      const urls = [];
      for (const video of property.videos) {
        try {
          const res = await BaseUrl.get(`/getPropertyVideo/${video.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          });
          const blob = res.data;
          urls.push(URL.createObjectURL(blob));
        } catch {
          urls.push("https://via.placeholder.com/400x200?text=No+Video");
        }
      }
      setVideoUrls(urls);
    };

    loadVideos();
  }, [property, token]);

  if (!property)
    return <p className="text-center my-5 text-black">Loading...</p>;

  const amenityIcons = {
    "Swimming Pool": <FaPersonSwimming className="text-primary fs-4" />,
    Gym: <FaDumbbell className="text-danger fs-4" />,
    "Play Ground": <GiSoccerField className="text-success fs-4" />,
    Park: <GiParkBench className="text-success fs-4" />,
    "Club House": <MdHolidayVillage className="text-warning fs-4" />,
  };

  const safeSplit = (data) => {
    if (!data) return [];
    return Array.isArray(data) ? data : String(data).split(",");
  };

  // New function to handle the navigation to Contact Us page
  const handleContactOwnerClick = () => {
    navigate(`/contact-us/${propId}`); // Navigate to Contact-us with the propId
  };

  return (
    <div
      className="container-fluid min-vh-100 py-5"
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        width: "100vw",
        marginTop: "80px",
      }}
    >
      <NavBar />

      <div className="container mb-5" style={{ maxWidth: "1100px" }}>
        {/* Property Image */}
        <div className="position-relative mb-4">
          {imageUrls.length > 0 ? (
            <img
              src={imageUrls[0]}
              alt="Property"
              className="img-fluid w-100 rounded-4 shadow-lg"
              style={{ maxHeight: "600px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center bg-light rounded-4 shadow-sm"
              style={{ height: "600px" }}
            >
              <p>No Image Available</p>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="mt-4">
          <h2 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2">
            {property.projectName}
            {property._verifiedproperty && (
              <span
                className="badge bg-success text-white px-3 py-2 rounded-pill shadow-sm"
                style={{ fontSize: "0.9rem" }}
              >
                ✅ Verified Property
              </span>
            )}
          </h2>

          <div className="d-flex flex-wrap gap-3">
            {[
              ["Looking To", property.look],
              ["Extent", property.extent],
              ["Dimensions", property.dimensions],
              ["Facing", property.facing],
              ["RERA", property.reraApproved ? "Yes" : "No"],
            ].map(([label, value], i) => (
              <div
                key={i}
                className="p-3 bg-white border rounded-4 shadow-sm flex-fill text-center"
                style={{ minWidth: "150px", transition: "all 0.3s ease" }}
              >
                <p className="mb-1 fw-semibold text-secondary">{label}</p>
                <p className="mb-1 fw-bold text-dark">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 row">
          <div
            className="col-lg-8 col-md-7 pe-lg-4"
            style={{
              maxHeight: "85vh",
              overflowY: "auto",
              scrollbarWidth: "thin",
            }}
          >
            {/* Price Card */}
            <div className="p-4 bg-white border rounded-4 shadow-sm text-center mb-4">
              <h4 className="fw-bold text-primary mb-1">
                ₹{property.price?.toLocaleString()}
              </h4>
              <p className="text-muted mb-0">EMI options available</p>
            </div>

            {/* Highlights */}
            <div className="mb-4">
              <h5 className="fw-semibold mb-3 text-dark">Highlights</h5>
              {safeSplit(property.highlights).length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {safeSplit(property.highlights).map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-white border rounded-pill shadow-sm text-dark"
                      style={{
                        display: "inline-block",
                        fontSize: "0.95rem",
                        lineHeight: "1.4",
                        width: "fit-content",
                      }}
                    >
                      {item.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-white border rounded-4 shadow-sm">
                  No highlights available.
                </div>
              )}
            </div>

            {/* Amenities */}
            <div className="mb-4">
              <h5 className="fw-semibold mb-3 text-dark">Amenities</h5>
              {safeSplit(property.amenities).length > 0 ? (
                <div className="d-flex flex-wrap gap-3">
                  {safeSplit(property.amenities).map((item, index) => {
                    const trimmed = item.trim();
                    return (
                      <div
                        key={index}
                        className="d-flex align-items-center gap-2 px-3 py-2 bg-white border rounded-4 shadow-sm"
                        style={{
                          fontSize: "0.95rem",
                          lineHeight: "1.4",
                          width: "fit-content",
                        }}
                      >
                        <div
                          className="rounded-circle d-flex justify-content-center align-items-center"
                          style={{
                            width: "35px",
                            height: "35px",
                            backgroundColor: "#f8f9fa",
                          }}
                        >
                          {amenityIcons[trimmed] || (
                            <MdHolidayVillage className="text-secondary fs-5" />
                          )}
                        </div>
                        <span className="fw-medium text-dark">{trimmed}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-white border rounded-4 shadow-sm">
                  No amenities available.
                </div>
              )}
            </div>

            {/* Videos */}
            {videoUrls.length > 0 && (
              <div className="mb-4">
                <h5 className="fw-semibold mb-3 text-dark">Property Video</h5>
                <div className="rounded-4 overflow-hidden shadow-sm">
                  <video
                    controls
                    className="w-100 rounded-4"
                    style={{ maxHeight: "450px", objectFit: "cover" }}
                  >
                    <source src={videoUrls[0]} type="video/mp4" />
                  </video>
                </div>
              </div>
            )}

            {/* Map */}
            {property.locationUrl && (
              <div className="mb-5">
                <h5 className="fw-semibold mb-3 text-dark">Map</h5>
                <div className="rounded-4 overflow-hidden shadow-sm">
                  <iframe
                    src={property.locationUrl}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Property Location Map"
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Contact Button */}
          <div
            className="col-lg-4 col-md-5 d-flex justify-content-end align-items-start"
            style={{
              position: "sticky",
              top: "100px",
              alignSelf: "flex-start",
            }}
          >
            <button
              className="btn px-4 py-2 fw-semibold shadow-sm text-white"
              style={{
                background: "linear-gradient(90deg, #007bff 0%, #6610f2 100%)",
                borderRadius: "10px",
                fontSize: "1rem",
                transition: "all 0.3s ease",
              }}
              onClick={handleContactOwnerClick} // Add the click handler
            >
              📞 Contact Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProperty;
