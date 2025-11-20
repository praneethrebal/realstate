import React, { useState } from "react";
import {
  FaPlus,
  FaHome,
  FaSearch,
  FaVideo,
  FaUser,
  FaBars,
  FaSignOutAlt,
  FaSignInAlt,
  FaPlusSquare,
  FaHeart,
  FaList,
  FaTimes, // added for close icon
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../../public/faviconp.png";

const NavBar = () => {
  const navigate = useNavigate();
  const { token, role, logOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // modal state

  const handleLogout = () => {
    logOut();
    navigate("/login/user");
  };

  const handleOptionClick = (path) => {
    navigate(path);
    setShowAddModal(false);
  };

  return (
    <>
      {/* ======= Desktop Navbar (unchanged) ======= */}
      <nav
        className="navbar d-none d-md-flex justify-content-between align-items-center px-4 shadow-sm"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          zIndex: 1000,
          width: "99vw",
        }}
      >
        <div className="navbar-title fw-bold" onClick={() => navigate("/")}>
          <img src={Logo} alt="Logo" style={{ height: "40px" }} />
        </div>

        {token ? (
          <div className="nav-links d-flex gap-3 align-items-center">
            <button className="btn btn-light" onClick={() => navigate("/menu")}>
              <FaList /> Menu
            </button>

            <button
              className="btn btn-light"
              onClick={() => navigate("/saved")}
            >
              <FaHeart /> Saved
            </button>

            <button
              className="btn btn-light"
              onClick={() =>
                role === "COMPANY"
                  ? navigate("/add-project")
                  : navigate("/addProperty")
              }
            >
              <FaPlusSquare /> {role === "COMPANY" ? "Add Project" : "Post"}
            </button>

            <button
              className="btn btn-light"
              onClick={() => navigate("/reelsView")}
            >
              <FaVideo /> Reels
            </button>

            <button
              className="btn btn-light"
              onClick={() => {
                if (role === "COMPANY") {
                  navigate("/companyprofile");
                } else if (role === "FRANCHISE") {
                  navigate("/FranchiseProfile");
                } else {
                  navigate("/profilePage");
                }
              }}
            >
              <FaUser /> Profile
            </button>

            <button className="btn btn-light" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        ) : (
          <div className="nav-links d-flex gap-3">
            <button
              className="btn btn-light"
              onClick={() => navigate("/login/user")}
            >
              <FaSignInAlt /> Login
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/addProperty")}
            >
              Add Property
            </button>
          </div>
        )}
      </nav>

      {/* ======= Mobile Top Navbar (unchanged) ======= */}
      <nav
        className="navbar d-flex d-md-none justify-content-between align-items-center px-3 py-2 shadow-sm"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          zIndex: 1000,
        }}
      >
        <span className="fw-bold" onClick={() => navigate("/")}>
          <img src={Logo} alt="Logo" style={{ height: "40px" }} />
        </span>
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            background: "none",
            border: "1px solid #ccc",
            borderRadius: "6px",
            width: "34px",
            height: "34px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0",
            margin: "0",
            lineHeight: "1",
          }}
        >
          <FaBars size={18} style={{ margin: 0, padding: 0 }} />
        </button>

        {showMenu && (
          <div
            className="position-absolute bg-white border rounded shadow-sm p-2"
            style={{ top: "60px", right: "15px", zIndex: 2000 }}
          >
            {token ? (
              <>
                <button
                  className="btn btn-sm btn-outline-secondary w-100 mb-2"
                  onClick={() => navigate("/menu")}
                >
                  <FaList /> Menu
                </button>

                <button
                  className="btn btn-sm btn-outline-secondary w-100 mb-2"
                  onClick={() => navigate("/saved")}
                >
                  <FaHeart /> Saved
                </button>

                <button
                  className="btn btn-sm btn-outline-primary w-100 mb-2"
                  onClick={() =>
                    role === "COMPANY"
                      ? navigate("/add-project")
                      : navigate("/addProperty")
                  }
                >
                  <FaPlusSquare />{" "}
                  {role === "COMPANY" ? "Add Project" : "Add Property"}
                </button>

                <button
                  className="btn btn-sm btn-outline-danger w-100"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <button
                className="btn btn-sm btn-outline-success w-100"
                onClick={() => navigate("/login/user")}
              >
                <FaSignInAlt /> Login
              </button>
            )}
          </div>
        )}
      </nav>

      {/* ======= Mobile Footer Nav (with modal) ======= */}
      <div
        className="d-flex d-md-none justify-content-around align-items-center shadow-sm"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60px",
          backgroundColor: "#fff",
          borderTop: "1px solid #ccc",
          zIndex: 999,
          color: "black",
        }}
      >
        <div className="text-center" onClick={() => navigate("/")}>
          <FaHome size={20} />
          <div style={{ fontSize: "12px" }}>Home</div>
        </div>

        <div className="text-center" onClick={() => navigate("/search")}>
          <FaSearch size={20} />
          <div style={{ fontSize: "12px" }}>Search</div>
        </div>

        {token ? (
          <>
            {/* Floating Add Button -> opens modal */}
            <div style={{ marginTop: "-35px" }}>
              <div
                className="bg-primary rounded-circle d-flex justify-content-center align-items-center shadow"
                style={{
                  width: "55px",
                  height: "55px",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={() => setShowAddModal(true)}
              >
                <FaPlus size={20} />
              </div>
            </div>

            <div className="text-center" onClick={() => navigate("/reelsView")}>
              <FaVideo size={20} />
              <div style={{ fontSize: "12px" }}>Reels</div>
            </div>

            <div
              className="text-center"
              onClick={() => {
                if (role === "COMPANY") {
                  navigate("/companyprofile");
                } else if (role === "FRANCHISE") {
                  navigate("/FranchiseProfile");
                } else {
                  navigate("/profilePage");
                }
              }}
            >
              <FaUser size={20} />
              <div style={{ fontSize: "12px" }}>Profile</div>
            </div>
          </>
        ) : (
          <div className="text-center" onClick={() => navigate("/login/user")}>
            <FaSignInAlt size={20} />
            <div style={{ fontSize: "12px" }}>Login</div>
          </div>
        )}
      </div>

      {/* ======= Add Modal (centered popup) ======= */}
      {showAddModal && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowAddModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 1500,
            }}
          />

          {/* Modal box */}
          <div
            role="dialog"
            aria-modal="true"
            className="d-flex justify-content-center align-items-center"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1600,
              pointerEvents: "none", // let inner box accept clicks only
            }}
          >
            <div
              style={{
                width: "90%",
                maxWidth: "320px",
                background: "#fff",
                borderRadius: "10px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                padding: "16px",
                position: "relative",
                pointerEvents: "auto",
              }}
            >
              {/* Close button (X) */}
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
                aria-label="Close"
              >
                <FaTimes />
              </button>

              {/* <h5 className="mb-2">Create</h5> */}
              <p style={{ marginTop: 0, marginBottom: 12, color: "#666" }}>
                Choose an action
              </p>

              <div className="d-grid gap-2">
                {role === "COMPANY" && (
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleOptionClick("/add-project")}
                  >
                    ➕ Add Project
                  </button>
                )}

                <button
                  className="btn btn-outline-primary"
                  onClick={() => handleOptionClick("/addProperty")}
                >
                  🏠 Add Property
                </button>
                {role !== "OWNER" && role !== "PROFESSIONAL" && (
                  <>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleOptionClick("/add-reel")}
                    >
                      🎥 Post Reel
                    </button>
                  </>
                )}

                <button
                  className="btn btn-light"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NavBar;
