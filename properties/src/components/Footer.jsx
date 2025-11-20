import React from "react";
import "../styles/Fotter.css";
import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Search Section */}
        <div className="footer-section">
          <h3>SEARCH</h3>
          <div className="search-box">
            <input type="text" placeholder="Search For State" />
            <button>Search</button>
          </div>
        </div>

        {/* Find Property & List Property */}
        <div className="footer-section">
          <h3>FIND PROPERTY</h3>
          <p>Select From Thousands Of Options, Without Brokerage.</p>
          <button className="action-button">
            <a href="Future_Requirements.php">Enquiry Now</a>
          </button>

          <h3 style={{ marginTop: "10px" }}>LIST YOUR PROPERTY</h3>
          <button className="action-button">
            <a href="./broker/addproperty_1.php">Post Now</a>
          </button>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h3>CONTACT US</h3>
          <p>Toll Free - 99099</p>
          <p>9:30 AM To 6:30 PM (Mon-Sun)</p>
          <p>Email - feedback@sr.com</p>

          <h3>FOLLOW US</h3>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/share/1CJRy48Zat/"
              style={{ textDecoration: "none", color: "#666" }}
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/weekdays_properties_official?igsh=MTF0Yjh2bG56eW8wdg=="
              style={{ textDecoration: "none", color: "#666" }}
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/company/propertysr-com/"
              style={{ textDecoration: "none", color: "#666" }}
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div className="footer-section">
          <h3>COMPANY</h3>
          <p>
            <a href="careers.html">Careers</a>
          </p>
          <p>
            <a href="aboutus.html">About Us</a>
          </p>
          <p>
            <a href="franchise.php">For Partners</a>
          </p>
          <p>
            <a href="terms.html">Terms and Conditions</a>
          </p>
          <p>
            <a href="refund.html">Refund Policy</a>
          </p>
          <p>
            <a href="privacy.html">Privacy Policy</a>
          </p>
          <p>
            <a href="contact.php">Contact Us</a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="left">
          <b>
            <a href="https://propertysr.com/" target="_blank" rel="noreferrer">
              ©WEEKDAYS PROPERTIES,
            </a>
          </b>{" "}
          All Rights Reserved.
        </span>
        <span className="right">
          Designed By{" "}
          <b>
            <a
              href="https://www.ygrgobalitservices.com/"
              target="_blank"
              rel="noreferrer"
            >
              YGR GOBAL IT SERVICES Pvt. Ltd,2023.
            </a>
          </b>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
