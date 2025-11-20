import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../styles/HeroSection.css";

const HeroSection = ({ onGetFranchise }) => {
  return (
    <Container fluid className="hero-container">
      <Row className="hero-row">
        {/* Left Content */}
        <Col xs={12} md={6} className="hero-left">
          <h1>Own A Business, <br /> Shape Your Future</h1>
          <p>Submit Your Inquiry And Explore Top Franchise Opportunities Hassle-Free</p>
          <Button className="hero-btn" variant="primary" onClick={onGetFranchise}>
            Get Franchise
          </Button>
        </Col>

        {/* Right Image */}
        <Col xs={12} md={6} className="hero-right">
          <img src="/images/franchise-office.jpg" alt="Franchise Office" />
        </Col>
      </Row>
    </Container>
  );
};

export default HeroSection;
