import React, { useState } from "react";
import { BaseUrl } from "../../api/BaseUrl";
import NavBar from "../NavBar";

const WinnerAnnouncement = () => {
  const [ticketNo, setTicketNo] = useState("");
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleSearch = () => {
    if (!ticketNo) {
      setError("Please enter a ticket number.");
      return;
    }
    setLoading(true);
    setError("");
    setWinner(null);

    BaseUrl.get(`/getWinner/${ticketNo}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setWinner(res.data);
      })
      .catch(() => {
        setError("❌ No winner found for this ticket number!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <NavBar />
      <div className="container " style={{ marginTop: "100px" }}>
        <h2 className="text-center mb-4">🎉 Winner Announcement</h2>

        <div className="d-flex justify-content-center mb-4">
          <input
            type="text"
            placeholder="Enter Winning Ticket Number"
            value={ticketNo}
            onChange={(e) => setTicketNo(e.target.value)}
            className="form-control w-50"
          />
          <button className="btn btn-success ms-2" onClick={handleSearch}>
            Announce Winner
          </button>
        </div>

        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Searching for winner...</p>
          </div>
        )}

        {error && <p className="text-danger text-center">{error}</p>}

        {winner && (
          <div
            className="card mx-auto p-3 shadow-lg"
            style={{ width: "24rem" }}
          >
            <img
              src={`${BaseUrl.defaults.baseURL}free-acess/getProfileImg/${winner.userId}`}
              alt="Winner"
              className="card-img-top rounded-circle mx-auto mt-3"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <div className="card-body text-center">
              <h4 className="card-title text-success">{winner.winnerName}</h4>
              <p>
                <strong>Ticket No:</strong> {winner.winningTicketNumber}
              </p>
              {/* <p>
                <strong>Lottery Name:</strong> {winner.lotteryName}
              </p> */}
              <p>
                <strong>Contact:</strong> {winner.mobileNumber}
              </p>
              <p>
                <strong>Location:</strong> {winner.areaAndCity},{" "}
                {winner.district}, {winner.state}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WinnerAnnouncement;
