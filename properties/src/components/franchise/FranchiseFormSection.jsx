import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import FranchiseForm from "../forms/FranchiseForm";
import "../../styles/FranchiseFormSection.css";

const FranchiseFormSection = () => {
  return (
    <Container fluid className="franchise-section">
      <Row className="franchise-row">
        <Col xs={12} md={6} className="franchise-image-col">
          <img src="/images/franchise-form.webp" alt="Franchise Inquiry" />
        </Col>

        <Col xs={12} md={6} className="franchise-form-col">
          <div className="franchise-form-wrapper">
            <FranchiseForm />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FranchiseFormSection;
