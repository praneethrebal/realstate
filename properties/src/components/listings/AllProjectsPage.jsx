import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../company/CompanyProjects.css";
import NavBar from "../NavBar";
import {
  Card,
  Form,
  Button,
  Container,
  Row,
  Col,
  Offcanvas,
} from "react-bootstrap";

export default function AllProjectsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects = [], imageUrls = {} } = location.state || {};

  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    companyName: "",
    location: "",
    experience: "",
    projectName: "",
  });

  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    let updated = [...projects];

    if (filters.name)
      updated = updated.filter((p) =>
        p.ownerName?.toLowerCase().includes(filters.name.toLowerCase())
      );
    if (filters.companyName)
      updated = updated.filter((p) =>
        p.companyName?.toLowerCase().includes(filters.companyName.toLowerCase())
      );
    if (filters.location)
      updated = updated.filter((p) =>
        p.projectLocation
          ?.toLowerCase()
          .includes(filters.location.toLowerCase())
      );
    if (filters.experience)
      updated = updated.filter(
        (p) => String(p.experience) === filters.experience
      );
    if (filters.projectName)
      updated = updated.filter((p) =>
        p.projectName?.toLowerCase().includes(filters.projectName.toLowerCase())
      );

    setFilteredProjects(updated);
  };

  const handleReset = () => {
    setFilters({
      name: "",
      companyName: "",
      location: "",
      experience: "",
      projectName: "",
    });
    setFilteredProjects(projects);
  };

  const handleCardClick = (id) => {
    navigate(`/singleProject/${id}`);
  };

  // 🔍 Sidebar Filter Component
  const FilterSidebar = () => (
    <Card className="p-3 shadow-sm rounded-3">
      <h5 className="fw-bold mb-3">🔍 Filter Projects</h5>

      <Form.Group className="mb-2">
        <Form.Label>Owner Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={filters.name}
          onChange={handleChange}
          placeholder="Enter owner name"
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Company Name</Form.Label>
        <Form.Control
          type="text"
          name="companyName"
          value={filters.companyName}
          onChange={handleChange}
          placeholder="Enter company name"
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Enter location"
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Experience</Form.Label>
        <Form.Control
          type="number"
          name="experience"
          value={filters.experience}
          onChange={handleChange}
          placeholder="Experience in years"
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Project Name</Form.Label>
        <Form.Control
          type="text"
          name="projectName"
          value={filters.projectName}
          onChange={handleChange}
          placeholder="Enter project name"
        />
      </Form.Group>

      <div className="d-flex justify-content-between mt-3">
        <Button variant="primary" size="sm" onClick={applyFilters}>
          Apply
        </Button>
        <Button variant="outline-secondary" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </Card>
  );

  return (
    <>
      <style>{`
        /* === Sidebar Styling === */
        .filter-sidebar {
          position: sticky;
          top: 90px;
          width: 350px;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          z-index: 5;
          height: fit-content;
        }

        /* === Project card styling === */
        .project-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          allign-items: left;
        }

        .project-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .project-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start; /* ⬅ aligns cards to the left */
          gap: 1.5rem;
        }

        .project-grid > div {
          flex: 1 1 calc(33.33% - 1.5rem);
          max-width: calc(33.33% - 1.5rem);
        }

        @media (max-width: 992px) {
          .project-grid > div {
            flex: 1 1 calc(50% - 1.5rem);
            max-width: calc(50% - 1.5rem);
          }
        }

        @media (max-width: 768px) {
          .project-grid > div {
            flex: 1 1 100%;
            max-width: 100%;
          }

          .filter-sidebar {
            position: relative;
            width: 100%;
            box-shadow: none;
          }

          .project-card img {
            height: 180px !important;
          }

          .container {
            padding: 0 1rem !important;
          }

          h2 {
            font-size: 1.4rem;
          }
        }
      `}</style>

      <NavBar />

      <Container fluid className="my-4 px-md-4 px-3" style={{ width: "100vw" }}>
        {/* Mobile Filter Button */}
        <div className="d-md-none mb-3" style={{ marginTop: "70px" }}>
          <Button variant="primary" onClick={() => setShowFilters(true)}>
            Filters
          </Button>
        </div>

        <h2 className="text-center mb-4 fw-bold">All Projects</h2>

        <Row className="g-4">
          {/* Sidebar for Desktop */}
          <Col lg={3} md={4} className="d-none d-md-block">
            <div className="filter-sidebar">
              <FilterSidebar />
            </div>
          </Col>

          {/* Offcanvas for Mobile */}
          <Offcanvas
            show={showFilters}
            onHide={() => setShowFilters(false)}
            placement="start"
            className="d-md-none"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Filter Projects</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <FilterSidebar />
            </Offcanvas.Body>
          </Offcanvas>

          {/* Project Cards Grid */}
          <Col lg={9} md={8}>
            <div className="project-grid">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="project-card"
                    onClick={() => handleCardClick(project.id)}
                    style={{ cursor: "pointer", overflow: "hidden" }}
                  >
                    {imageUrls[project.id] ? (
                      <img
                        src={imageUrls[project.id]}
                        alt={project.projectName}
                        className="project-image"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="no-image d-flex align-items-center justify-content-center"
                        style={{ height: "200px", backgroundColor: "#f0f0f0" }}
                      >
                        No Image Available
                      </div>
                    )}
                    <div className="p-3">
                      <h5 className="fw-semibold mb-2">
                        {project.projectName}
                      </h5>
                      <p className="mb-1">
                        <strong>Owner:</strong> {project.ownerName || "N/A"}
                      </p>
                      <p className="mb-1">
                        <strong>Company:</strong> {project.companyName || "N/A"}
                      </p>
                      <p className="mb-1">
                        <strong>Location:</strong>{" "}
                        {project.projectLocation || "N/A"}
                      </p>
                      <p className="mb-1">
                        <strong>Type:</strong> {project.typeOfProject || "N/A"}
                      </p>
                      <p className="mb-0">
                        <strong>Pricing:</strong> {project.pricing || "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No projects found.</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
