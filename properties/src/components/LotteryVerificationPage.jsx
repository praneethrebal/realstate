import React, { useEffect, useState } from "react";

import { BaseUrl } from "../api/BaseUrl";

export default function LotteryVerificationPage() {
  const [lotteries, setLotteries] = useState([]);
  const [transactionInputs, setTransactionInputs] = useState({});
  const [activeView, setActiveView] = useState("pending"); // 'pending' or 'verified'
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLotteries();
  }, []);

  const fetchLotteries = async () => {
    try {
      const res = await BaseUrl.get(`/getAllLotteryPayments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLotteries(res.data);
    } catch (err) {
      console.error("Error fetching lotteries:", err);
    }
  };

  const handleInputChange = (id, value) => {
    setTransactionInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleVerify = async (id, backendTransactionId) => {
    const enteredId = transactionInputs[id];
    if (enteredId !== backendTransactionId) {
      alert("Transaction ID does not match!");
      return;
    }

    try {
      await BaseUrl.put(
        `/makeVerifed/${id}/${enteredId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Lottery verified successfully!");
      fetchLotteries();
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  const pending = lotteries.filter((item) => !item.verified);
  const verified = lotteries.filter((item) => item.verified);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🎟️ Lottery Verification Dashboard</h2>

      {/* Toggles */}
      <div className="d-flex justify-content-center gap-2 mb-4">
        <button
          className={`btn ${
            activeView === "pending" ? "btn-danger" : "btn-outline-danger"
          }`}
          onClick={() => setActiveView("pending")}
        >
          ⏳ Pending
        </button>
        <button
          className={`btn ${
            activeView === "verified" ? "btn-success" : "btn-outline-success"
          }`}
          onClick={() => setActiveView("verified")}
        >
          ✅ Verified
        </button>
      </div>

      {/* Pending Section */}
      {activeView === "pending" && (
        <div className="card p-3 mb-4 shadow-sm">
          <h4 className="mb-3 text-danger">⏳ Pending Verification</h4>
          {pending.length === 0 ? (
            <p>No pending lotteries.</p>
          ) : (
            <div className="row">
              {pending.map((lottery) => (
                <div key={lottery.id} className="col-md-4 mb-3">
                  <div className="card p-3 h-100 border-danger">
                    <p>
                      <strong>Name:</strong> {lottery.name}
                    </p>
                    <p>
                      <strong>Amount:</strong> ₹{lottery.amount}
                    </p>
                    <p>
                      <strong>Ticket No:</strong> {lottery.ticketNo}
                    </p>
                    <p>
                      <strong>Mobile No:</strong> {lottery.mobileNumber}
                    </p>
                    <p>
                      <strong>Email:</strong> {lottery.toMail}
                    </p>
                    <p>
                      <strong>Transcation ID:</strong> {lottery.transcation_id}
                    </p>

                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter Transaction ID"
                      value={transactionInputs[lottery.id] || ""}
                      onChange={(e) =>
                        handleInputChange(lottery.id, e.target.value)
                      }
                    />
                    <button
                      className="btn btn-primary w-100"
                      disabled={
                        transactionInputs[lottery.id] !== lottery.transcation_id
                      }
                      onClick={() =>
                        handleVerify(lottery.id, lottery.transcation_id)
                      }
                    >
                      Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Verified Section */}
      {activeView === "verified" && (
        <div className="card p-3 shadow-sm">
          <h4 className="mb-3 text-success">✅ Verified Lotteries</h4>
          {verified.length === 0 ? (
            <p>No verified lotteries yet.</p>
          ) : (
            <div className="row">
              {verified.map((lottery) => (
                <div key={lottery.id} className="col-md-4 mb-3">
                  <div className="card p-3 h-100 border-success">
                    <p>
                      <strong>Name:</strong> {lottery.name}
                    </p>
                    <p>
                      <strong>Amount:</strong> ₹{lottery.amount}
                    </p>
                    <p>
                      <strong>Ticket No:</strong> {lottery.ticketNo}
                    </p>
                    <span className="badge bg-success">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
