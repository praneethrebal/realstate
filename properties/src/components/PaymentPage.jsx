import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      // Redirect to login if not authenticated
      navigate("/login/user");
    }
  }, [navigate]);

  // Parse user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const price = user.price || 0; // Use user price or 0

  const handlePayment = () => {
    // Replace this with your payment logic
    alert(`Processing payment of ₹${price}`);
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Payment Page</h1>
      <p>Welcome, <strong>{user.username || "User"}</strong>!</p>
      <p>Your payment amount is: <strong>₹{price}</strong></p>
      <button onClick={handlePayment} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Pay Now
      </button>
    </div>
  );
}
