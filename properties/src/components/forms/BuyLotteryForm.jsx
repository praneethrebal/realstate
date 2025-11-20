import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BaseUrl } from "../../api/BaseUrl";
import NavBar from "../NavBar";
import QR from "../../assets/payment_QR.jpeg";
import Footer from "../Footer";

const BuyLotteryForm = () => {
  const { id } = useParams(); // Lottery ID
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [purchaseData, setPurchaseData] = useState({
    name: "",
    mobileNumber: "",
    altNumber: "",
    transcation_id: "",
    postalAddressCode: "",
    State: "",
    Distict: "",
    areaAndCity: "",
    toMail: "",
  });

  const [lottery, setLottery] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchLottery = async () => {
      try {
        const res = await BaseUrl.get(`/lottery/getAlllottry/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLottery(res.data);
      } catch (error) {
        console.error("Error fetching lottery:", error);
        alert("Failed to load lottery details.");
      } finally {
        setLoading(false);
      }
    };
    fetchLottery();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPurchaseData({ ...purchaseData, [name]: value });
  };

  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!screenshot || !lottery) {
      alert("Please upload your payment screenshot!");
      return;
    }

    const formData = new FormData();
    // Append purchase data
    for (const key in purchaseData) {
      formData.append(key, purchaseData[key]);
    }
    // Append other necessary data
    formData.append("amount", lottery.ticketPrice);
    formData.append("screenShot", screenshot); // Changed from "file" to "screenShot" to be more descriptive
    formData.append("file", screenshot); // ✅ Changed to "file" to match backend expectations

    // The backend will get addPropertyModel (lottery) from the URL id and user from the token.

    setSubmitting(true);
    try {
      await BaseUrl.post(`/buylottryTicket/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // alert("🎟️ Ticket purchased successfully!");
      // navigate("/"); // or back to lottery list
    } catch (err) {
      console.error("Error buying ticket:", err);
      alert("Failed to complete purchase. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-dark"></div>
        <p>Loading Lottery Info...</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw" }}>
      <NavBar />
      <div
        className="container "
        style={{ marginTop: "100px", marginBottom: "100px" }}
      >
        <h2 className="text-center mb-4">🎫 Buy Lucky Ticket</h2>
        <div className="card p-4 shadow rounded-4">
          <form onSubmit={handleSubmit}>
            {/* Personal Details */}
            <h5 className="mb-3">👤 Personal Details</h5>
            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Full Name<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={purchaseData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Mobile Number<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  className="form-control"
                  value={purchaseData.mobileNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  WhatsApp No.<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="tel"
                  name="altNumber"
                  className="form-control"
                  value={purchaseData.altNumber}
                  onChange={handleInputChange}
                />
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Email<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="toMail"
                    className="form-control"
                    value={purchaseData.toMail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Details */}
            <h5 className="mb-3 mt-3">📍 Address Details</h5>
            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label">
                  Area and City<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="areaAndCity"
                  className="form-control"
                  value={purchaseData.areaAndCity}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  District<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="Distict"
                  className="form-control"
                  value={purchaseData.Distict}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  State<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="State"
                  className="form-control"
                  value={purchaseData.State}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Postal Code<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="postalAddressCode"
                  className="form-control"
                  value={purchaseData.postalAddressCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Payment Details */}
            <h5 className="mb-3 mt-3">💳 Payment Details</h5>
            <div className="text-center my-3">
              <p>
                Scan the QR code and pay{" "}
                <strong>₹{lottery?.ticketPrice || 0}</strong>
              </p>
              <img
                src={QR}
                alt="Payment QR"
                style={{ width: "250px", height: "250px" }}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                Upload Payment Screenshot<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="file"
                name="screenshotFile" // ✅ Added name attribute for clarity
                className="form-control"
                onChange={handleFileChange}
                accept="image/*"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                Transaction ID<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="transcation_id"
                className="form-control"
                value={purchaseData.transcation_id}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>
                <input type="checkbox" required />
              </span>
              <span>
                <Link to="/LotteryTerms">Terms & Conditions </Link>
              </span>
            </div>
            <p>Help-Line: 9618411291</p>
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={submitting}
            >
              {submitting ? "Processing..." : "✅ Confirm Purchase"}
            </button>
            {submitting && (
              <h3 style={{ color: "red", padding: "10px" }}>
                Thank you for your purchase! ,Plece wait for verificaton,for
                Contact for more info <b>9618411291</b>{" "}
              </h3>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyLotteryForm;
