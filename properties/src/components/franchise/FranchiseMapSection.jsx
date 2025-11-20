import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../../styles/FranchiseMapSection.css";

const FranchiseMapSection = () => {
  const cities = [
    { name: "Hyderabad", img: "/images/hyd.webp" },
    { name: "Bangalore", img: "/images/bangalore.jpeg" },
    { name: "Mumbai", img: "/images/mumbai.jpeg" },
    { name: "Chennai", img: "/images/chennai.jpg" },
    { name: "Delhi", img: "/images/delhi.jpeg" },
  ];

  return (
    <Container fluid className="franchise-map-section">
      <Row className="franchise-map-row">
        <Col xs={12} md={6} className="map-col mb-4 mb-md-0">
          <iframe
            src="https://www.google.com/maps?q=India&output=embed"
            allowFullScreen
          ></iframe>
        </Col>

        <Col xs={12} md={6} className="cities-col text-center">
          <h5 className="text-muted">Available Franchises</h5>
          <h3>Explore Our Network Of Franchises Across The Country</h3>
          <div className="cities-wrapper">
            {cities.map((city, idx) => (
              <div key={idx} className="city-card text-center">
                <img src={city.img} alt={city.name} />
                <p>{city.name}</p>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FranchiseMapSection;
