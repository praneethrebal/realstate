import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
import "../../styles/LotteryPage.css";
import { BaseUrl } from "../../api/BaseUrl";

const LotteryPage = () => {
  const navigate = useNavigate();
  const [lotteryData, setLotteryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLotteries = async () => {
      setLoading(true);
      try {
        const res = await BaseUrl.get("free-acess/lottery/getAlllottry");

        const lotteries = Array.isArray(res.data) ? res.data : [res.data];

        // Fetch all images concurrently for better performance
        const lotteriesWithImages = await Promise.all(
          lotteries.map(async (item) => {
            const imagePath = item.imagePaths?.[0];
            let previewImage = null;

            if (imagePath) {
              try {
                const filename = imagePath.split(/[\\/]/).pop();
                const imgRes = await BaseUrl.get(
                  `free-acess/lottery/image/${filename}`,
                  { responseType: "blob" }
                );
                previewImage = URL.createObjectURL(imgRes.data);
              } catch (imgErr) {
                console.error(
                  `Failed to load image for lottery ${item.id}:`,
                  imgErr
                );
              }
            }
            return { ...item, previewImage };
          })
        );

        setLotteryData(lotteriesWithImages);
      } catch (err) {
        console.error("Error fetching lotteries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLotteries();

    // Correct cleanup function to avoid memory leaks
    return () => {
      lotteryData.forEach((item) => {
        if (item.previewImage) URL.revokeObjectURL(item.previewImage);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleImageError = (e) => {
    e.target.src = "/fallback.png"; // use a local static image
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="container text-center mt-5">
          <div className="spinner-border text-dark" role="status"></div>
          <p className="mt-3">Loading properties...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container lottery-page-container mt-4 mb-5">
        <h2 className="text-center mb-4">🎟️ Lucky Properties</h2>

        <div className="row justify-content-center">
          {lotteryData.length === 0 ? (
            <p className="text-center">No properties found.</p>
          ) : (
            lotteryData.map((item) => (
              <div key={item.id} className="col-md-8 mb-4">
                <div className="lottery-card shadow-sm">
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img
                        src={item.previewImage || "/fallback.png"}
                        alt={item.name || "Property"}
                        onError={handleImageError}
                        className="lottery-image"
                        loading="lazy"
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="lottery-details">
                        {/* <h5 className="lottery-title">
                          {item.name || "Lottery Property"}
                        </h5> */}
                        <p className="lottery-location">
                          <strong>Location:</strong> {item.address || "N/A"}
                        </p>
                        <p className="lottery-description">
                          {item.description || "No description available."}
                        </p>
                        <div className="lottery-meta">
                          <span>
                            <strong>Value:</strong> ₹
                            {item.property_value || "N/A"}
                          </span>
                          <span className="text-success">
                            <strong>Available:</strong>{" "}
                            {item.avaliableTickets || 0}
                          </span>
                        </div>
                        <button
                          className="btn btn-primary btn-sm mt-2"
                          onClick={() =>
                            navigate(`/LotteryPageDetails/${item.id}`)
                          }
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default LotteryPage;
