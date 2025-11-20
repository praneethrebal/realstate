import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import DefaultImage from "../../assets/Default_profile_picture.jpeg";
import { BaseUrl } from "../../api/BaseUrl";
import "../../styles/LotteryDetailsPage.css";

const LotteryDetailsPage = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [lottery, setLottery] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLottery = async () => {
      setLoading(true);
      try {
        const res = await BaseUrl.get(`free-acess/lottery/getAlllottry/${id}`);

        const data = res.data;
        setLottery(data);

        // Fetch property images
        if (data?.imagePaths && Array.isArray(data.imagePaths)) {
          const urls = await Promise.all(
            data.imagePaths.map(async (path) => {
              try {
                const filename = path.split(/[\\/]/).pop();
                const imgRes = await BaseUrl.get(
                  `free-acess/lottery/image/${filename}`,
                  {
                    responseType: "blob",
                  }
                );
                return URL.createObjectURL(imgRes.data);
              } catch {
                return null;
              }
            })
          );
          setImageUrls(urls.filter(Boolean));
        }
      } catch (error) {
        console.error("Error fetching lottery details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLottery();

    return () => {
      setImageUrls((prevUrls) => {
        prevUrls.forEach((url) => URL.revokeObjectURL(url));
        return [];
      });
    };
  }, [id, token]);

  if (loading && !lottery) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-dark" role="status"></div>
        <p className="mt-3">Loading ...</p>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div
        className="lottery-details-page container"
        style={{ marginTop: "100px", marginBottom: "120px" }}
      >
        <div className="lottery-main-container">
          {/* ------------------- LEFT: LOTTERY DETAILS ------------------- */}
          <div className="lottery-details-section">
            <div className="lottery-details-card">
              {/* ✅ Image Carousel */}
              {imageUrls.length > 0 ? (
                <div
                  id="lotteryImageCarousel"
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-inner">
                    {imageUrls.map((url, index) => (
                      <div
                        key={index}
                        className={`carousel-item ${
                          index === 0 ? "active" : ""
                        }`}
                      >
                        <img
                          src={url}
                          className="d-block w-100 property-image"
                          alt={`Lottery image ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#lotteryImageCarousel"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#lotteryImageCarousel"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              ) : (
                <div className="d-flex justify-content-center align-items-center no-image-placeholder">
                  <p className="text-muted">No Image Available</p>
                </div>
              )}

              {/* ✅ Lottery Details */}
              <div className="details-body">
                <div className="detail-row">
                  <h5>📍 Address:</h5>
                  <p>{lottery.address || "Not available"}</p>
                </div>

                <div className="detail-row">
                  <h5>📝 Description:</h5>
                  <p>{lottery.description || "No description available."}</p>
                </div>

                <div className="detail-row">
                  <h5>💰 Property Value:</h5>
                  <p>
                    {lottery.property_value
                      ? `₹ ${parseInt(
                          lottery.property_value,
                          10
                        ).toLocaleString("en-IN")}`
                      : "N/A"}
                  </p>
                </div>

                <div className="detail-row">
                  <div className="ticket-info-grid">
                    <div>
                      <h5>🎟️ Total Tickets:</h5>
                      <p>{lottery.totalTickets || 0}</p>
                    </div>
                    <div>
                      <h5>✅ Available Tickets:</h5>
                      <p>{lottery.avaliableTickets || 0}</p>
                    </div>
                    <div>
                      <h5 className="text-danger">🔥 Sold Tickets:</h5>
                      <p className="fw-bold text-danger">
                        {lottery.totalTickets - lottery.avaliableTickets || 0}
                      </p>
                    </div>
                    <div>
                      {/* <h5>🗓️ Draw Date:</h5>
                      <p>
                        {lottery.drawDate
                          ? new Date(lottery.drawDate).toLocaleDateString()
                          : "N/A"}
                      </p> */}
                    </div>
                  </div>
                </div>

                {/* ✅ Map */}
                {lottery.adressURL && (
                  <div className="detail-row">
                    <h5>🗺️ Map Location</h5>
                    <div className="map-container">
                      <iframe
                        src={lottery.adressURL}
                        width="100%"
                        height="250"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Property Location Map"
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* ✅ Purchase Section */}
                <div className="purchase-section text-center mt-4">
                  <button
                    className="btn btn-success w-100 py-2 fs-5"
                    onClick={() => navigate(`/buy-lottery/${lottery.id}`)}
                  >
                    🎫 Purchase Ticket for ₹{lottery.ticketPrice}
                  </button>
                </div>

                <div className="note-section mt-3">
                  <h5>📝 Note:</h5>
                  <p>
                    <ul>
                      <li>
                        {" "}
                        The <b>Lucky</b> draw will be held after{" "}
                        <b>all tickets are sold out.</b>
                      </li>
                      <li>
                        {" "}
                        The winner will get property and all the participants
                        will get assured gifts.
                      </li>
                      <li>
                        Any queries feel free to contact <b>9618411291</b>
                      </li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------- RIGHT: WINNER DETAILS ------------------- */}
          <div className="winner-card-container">
            <h3 className="mb-3 text-primary text-center">🏆 Winner</h3>
            <img
              src={lottery.winnerImage ? lottery.winnerImage : DefaultImage}
              alt="Winner"
              className="rounded-circle mb-3 winner-image"
            />
            <h5 className="text-center">
              {lottery.winnerName || "Not Announced Yet"}
            </h5>
            <p className="text-center text-muted mb-0">
              Ticket No:{" "}
              <strong>{lottery.winningTicketNumber || "To be revealed"}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Embedded Responsive Styles */}
      <style>{`
        .lottery-main-container {
          display: flex;
          gap: 30px;
          justify-content: space-between;
        }

        .lottery-details-section {
          flex: 2;
        }

        .winner-card-container {
          flex: 1;
          background-color: #f8f9fa;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          padding: 20px;
          text-align: center;
          height: fit-content;
        }

        .winner-image {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border: 3px solid #007bff;
        }

        /* ✅ Mobile View */
        @media (max-width: 768px) {
          .lottery-main-container {
            flex-direction: column;
          }

          .winner-card-container {
            margin-top: 25px;
            width: 100%;
            text-align: center;
            padding: 20px;
          }

          .winner-image {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>
    </>
  );
};

export default LotteryDetailsPage;
