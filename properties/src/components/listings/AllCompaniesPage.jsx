import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../NavBar";
import CompanyListing from "./CompanyListing";
import { BaseUrl } from "../../api/BaseUrl";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Offcanvas,
} from "react-bootstrap";

const AllCompaniesPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const apiEndpoint = params.get("endpoint");
  const heading = params.get("heading");

  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    experience: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch company data
  useEffect(() => {
    if (!apiEndpoint) return;

    setLoading(true);
    BaseUrl.get(apiEndpoint)
      .then((res) => {
        const companyData = Array.isArray(res.data) ? res.data : [];
        setCompanies(companyData);
        setFilteredCompanies(companyData);
      })
      .catch((err) => {
        console.error("Error fetching companies:", err);
        setError("Failed to fetch companies.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiEndpoint]);

  // 🟢 Handle Filter Input
  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  // 🟢 Apply Filters
  const applyFilters = () => {
    let updated = [...companies];

    if (filters.name)
      updated = updated.filter((c) =>
        c.companyName?.toLowerCase().includes(filters.name.toLowerCase())
      );

    if (filters.location)
      updated = updated.filter((c) =>
        c.location?.toLowerCase().includes(filters.location.toLowerCase())
      );

    if (filters.experience)
      updated = updated.filter((c) =>
        String(c.experience || "")
          .toLowerCase()
          .includes(filters.experience.toLowerCase())
      );

    setFilteredCompanies(updated);
    setShowFilters(false);
  };

  // 🟢 Reset Filters
  const handleReset = () => {
    const reset = { name: "", location: "", experience: "" };
    setFilters(reset);
    setFilteredCompanies(companies);
  };

  const FilterSidebar = () => (
    <Card
      className="p-4 shadow-sm rounded-3"
      style={{
        width: "100%",
        backgroundColor: "#f8f9fa",
      }}
    >
      <h5 className="fw-bold mb-3">🔍 Filter Companies</h5>

      <Form.Group className="mb-3">
        <Form.Label>Company Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={filters.name}
          onChange={handleChange}
          placeholder="Enter company name"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Enter location"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Experience</Form.Label>
        <Form.Control
          type="text"
          name="experience"
          value={filters.experience}
          onChange={handleChange}
          placeholder="Enter experience (e.g. 2 years)"
        />
      </Form.Group>

      <div className="d-flex justify-content-between">
        <Button variant="primary" onClick={applyFilters}>
          Apply
        </Button>
        <Button variant="outline-secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </Card>
  );

  return (
    <>
      <style>{`
      .filter-sidebar {
        position: sticky;
        top: 90px; /* adjust to match navbar height */
        left: 0;
        width: 100%;
        max-width: 350px;
        background-color: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        padding: 1rem;
        z-index: 5;
        margin-left: 0; /* stays fully left */
        height: calc(80vh - 100px); /* fixed visible height */
        overflow-y: hidden; /* enables scrolling inside sidebar */
      }
      `}</style>
      <NavBar />
      <Container fluid className="my-4 px-3" style={{ width: "100vw" }}>
        {/* Mobile Filter Button */}
        <div className="d-md-none text-left" style={{ marginTop: "70px" }}>
          <Button variant="primary" onClick={() => setShowFilters(true)}>
            Search
          </Button>
        </div>

        <h2
          style={{
            textAlign: "center",
            fontSize: "26px",
            fontWeight: "700",
            marginBottom: "30px",
          }}
        >
          All {heading}
        </h2>

        <Row className="g-4">
          {/* Sidebar Filter (Desktop) */}
          <Col lg={3} md={4} className="d-none d-md-block">
            <div className="filter-sidebar">
              <FilterSidebar />
            </div>
          </Col>

          {/* Offcanvas Filter (Mobile) */}
          <Offcanvas
            show={showFilters}
            onHide={() => setShowFilters(false)}
            placement="start"
            className="d-md-none"
            style={{ width: "85%" }}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Search Companies</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <FilterSidebar />
            </Offcanvas.Body>
          </Offcanvas>

          {/* Company Listing */}
          <Col lg={9} md={8}>
            {error && <p className="text-danger text-center">{error}</p>}
            {loading ? (
              <p className="text-center">Loading companies...</p>
            ) : (
              <CompanyListing
                heading={heading}
                showSeeAllButton={false}
                companies={filteredCompanies} // ✅ pass filtered companies
              />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AllCompaniesPage;
