import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import NavBar from "../NavBar";
import { FaPersonSwimming, FaDumbbell } from "react-icons/fa6";
import { GiSoccerField, GiParkBench } from "react-icons/gi";
import { MdHolidayVillage, MdDownload } from "react-icons/md";
import { BaseUrl } from "../../api/BaseUrl";

const BASE_URL = BaseUrl;

const SingleProject = () => {
  const { propId } = useParams(); // updated param
  const token = localStorage.getItem("token");

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [imageUrls, setImageUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);
  const [brochureUrls, setBrochureUrls] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const amenityIcons = {
    "Swimming Pool": <FaPersonSwimming className="text-primary fs-4" />,
    Gym: <FaDumbbell className="text-danger fs-4" />,
    Playground: <GiSoccerField className="text-success fs-4" />,
    Park: <GiParkBench className="text-success fs-4" />,
    "Club House": <MdHolidayVillage className="text-warning fs-4" />,
  };

  const safeSplit = (data) =>
    data ? (Array.isArray(data) ? data : String(data).split(",")) : [];

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
  // Fetch project data
  useEffect(() => {
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        const res = await BaseUrl.get(`/free-acess/singleProject/${propId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProject(res.data);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.response?.data?.message || "Failed to fetch project.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [propId, token]);

  // Fetch images, videos, brochures as blobs
  useEffect(() => {
    if (!project) return;

    const fetchMedia = async () => {
      try {
        // Images
        const imgs = await Promise.all(
          (project.images || []).map(async (img) => {
            try {
              const res = await BaseUrl.get(
                `/free-acess/getProjectImage/${img.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                  responseType: "blob",
                }
              );
              return URL.createObjectURL(res.data);
            } catch {
              return "https://via.placeholder.com/400x200?text=No+Image";
            }
          })
        );
        setImageUrls(imgs);

        // Videos
        const vids = await Promise.all(
          (project.videos || []).map(async (vid) => {
            try {
              const res = await BaseUrl.get(
                `/free-acess/getProjectVideo/${vid.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                  responseType: "blob",
                }
              );
              return URL.createObjectURL(res.data);
            } catch {
              return null;
            }
          })
        );
        setVideoUrls(vids);

        // Brochures
        const bros = await Promise.all(
          (project.brochures || []).map(async (bro) => {
            try {
              const res = await BaseUrl.get(
                `/free-acess/getProjectBrochure/${bro.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                  responseType: "blob",
                }
              );
              return {
                url: URL.createObjectURL(res.data),
                name: bro.fileName || `brochure_${bro.id}`,
              };
            } catch {
              return null;
            }
          })
        );
        setBrochureUrls(bros.filter(Boolean));
      } catch (err) {
        console.error("Error fetching media:", err);
      }
    };

    fetchMedia();
  }, [project, token]);

  if (loading) return <p className="text-center my-5">Loading project...</p>;
  if (error) return <p className="text-center my-5 text-danger">{error}</p>;
  if (!project)
    return <p className="text-center my-5">No project data found.</p>;

  return (
    <div
      className="container-fluid min-vh-100 py-5"
      style={{ backgroundColor: "#fff", color: "#000" }}
    >
      <NavBar />

      <div
        className="container mb-5"
        style={{
          maxWidth: "1100px",
          marginTop: "80px",
          marginBottom: "100px",
        }}
      >
        {/* Images */}
        <div className="position-relative mb-4">
          {imageUrls.length > 0 ? (
            <div className="d-flex overflow-auto gap-3">
              {imageUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Project ${idx}`}
                  className="img-fluid rounded-4 shadow-sm"
                  style={{
                    maxHeight: "400px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => setFullscreenImage(url)}
                />
              ))}
            </div>
          ) : (
            <div
              className="d-flex justify-content-center align-items-center bg-light rounded-4"
              style={{ height: "400px" }}
            >
              <p>No Images Available</p>
            </div>
          )}
        </div>

        {/* Project Details */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span
            className="fw-bold mb-3 text-dark"
            style={{ fontWeight: "300" }}
          >
            {project.projectName}
          </span>
          <span>
            <button
              className="fw-bold mb-3 text-dark"
              style={{
                padding: "7px",
                borderRadius: "10px",
                backgroundColor: "green",
              }}
            >
              <span
                style={{ color: "white" }}
                onClick={() => handleCall("1111111111")}
              >
                Contact
              </span>
            </button>
          </span>
        </div>
        <div className="d-flex flex-wrap gap-3 mb-4">
          {[
            ["No of Units", project.numberOfUnits],
            ["Available Sizes", project.availableSizes],
            ["Project Area", project.totalProjectArea],
            ["Price", project.pricing],
            ["Available Units", project.availableUnits],
            ["RERA", project.reraApproved ? "Yes" : "No"],
            ["Facing", project.availableFacings],
            ["Location", project.projectLocation || "N/A"],
          ].map(([label, value], i) => (
            <div
              key={i}
              className="p-3 bg-white border rounded-4 shadow-sm flex-fill text-center"
              style={{ minWidth: "150px" }}
            >
              <p className="mb-1 fw-semibold text-secondary">{label}</p>
              <p className="mb-1 fw-bold text-dark">{value || "N/A"}</p>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="mb-4">
          <h5 className="fw-semibold mb-3 text-dark">Highlights</h5>
          {safeSplit(project.highlights).length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
              {safeSplit(project.highlights).map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-2 bg-white border rounded-pill shadow-sm text-dark"
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
          {safeSplit(project.amenities).length > 0 ? (
            <div className="d-flex flex-wrap gap-3">
              {safeSplit(project.amenities).map((item, i) => (
                <div
                  key={i}
                  className="d-flex align-items-center gap-2 px-3 py-2 bg-white border rounded-4 shadow-sm"
                >
                  {amenityIcons[item.trim()] || (
                    <MdHolidayVillage className="text-secondary fs-5" />
                  )}
                  <span className="fw-medium text-dark">{item.trim()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-white border rounded-4 shadow-sm">
              No amenities available
            </div>
          )}
        </div>

        {/* Brochures */}
        {brochureUrls.length > 0 && (
          <div className="mb-4">
            <h5 className="fw-semibold mb-3 text-dark">Brochures</h5>
            {brochureUrls.map((bro, i) => (
              <a
                key={i}
                href={bro.url}
                download={bro.name}
                className="btn btn-outline-primary d-flex align-items-center gap-2 mb-2"
              >
                <MdDownload /> {bro.name}
              </a>
            ))}
          </div>
        )}

        {/* Videos */}
        {videoUrls.length > 0 && (
          <div className="mb-4">
            <h5 className="fw-semibold mb-3 text-dark">Project Videos</h5>
            {videoUrls.map((url, i) =>
              url ? (
                <div
                  key={i}
                  className="rounded-4 overflow-hidden shadow-sm mb-3"
                >
                  <video
                    controls
                    className="w-100 rounded-4"
                    style={{ maxHeight: "450px", objectFit: "cover" }}
                  >
                    <source src={url} type="video/mp4" />
                  </video>
                </div>
              ) : (
                <p key={i} className="text-muted">
                  Video not available
                </p>
              )
            )}
          </div>
        )}

        {/* Map */}
        {project.locationUrl && (
          <div className="mb-5">
            <h5 className="fw-semibold mb-3 text-dark">Project Location</h5>
            <iframe
              src={project.locationUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Project Location Map"
            ></iframe>
          </div>
        )}
      </div>

      {fullscreenImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
            cursor: "pointer",
          }}
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
          <button
            style={{ position: "absolute", top: "20px", right: "30px" }}
            className="btn-close btn-close-white fs-3"
          ></button>
        </div>
      )}
    </div>
  );
};

export default SingleProject;
