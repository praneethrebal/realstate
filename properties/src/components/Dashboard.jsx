import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Forms from "../components/forms/Forms";
import "../styles/dashboard.css";
import { FaPlusSquare } from "react-icons/fa";
import house1 from "../assets/house1.png";
import house2 from "../assets/house2.png";
import house3 from "../assets/house3.png";
import { useNavigate } from "react-router-dom";
import Categories from "./categories/Categories";
import ListingCards from "./listings/ListingCards";
import FranchiseMain from "../components/franchise/FranchiseMain";
import CompanyProjects from "./listings/CompanyProjects";
import CompanyListing from "./listings/CompanyListing";
import { Link } from "react-router-dom";
import Services from "./Services";
import Footer from "./Footer";
import MyRequirementsForm from "./MyRequirementsForm";
const images = [house1, house2, house3];

const categoryEnumMap = {
  Plots: "Plot",
  Villas: "Villa",
  Lands: "Land",
  Flats: "Flat",
  Commercial: "Commercial",
};

const Dashboard = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const navigate = useNavigate();

  // Auto background image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const backgroundImageStyle = {
    backgroundImage: `url(${images[currentImageIndex]})`,
  };

  // ✅ Updated handleSearch
  const handleSearch = () => {
    if (!searchCity || !selectedCategory) {
      alert("Please select a category and enter a city!");
      return;
    }

    const enumCategory = categoryEnumMap[selectedCategory];

    // Pass location as query param to match /search endpoint
    navigate(
      `/categorie/${enumCategory}?location=${encodeURIComponent(searchCity)}`
    );
  };

  // Optional: clicking category card navigates without location (shows all of that category)
  const handleCategoryClick = (category) => {
    const enumCategory = categoryEnumMap[category];
    navigate(`/categorie/${enumCategory}`);
  };

  return (
    <>
      <NavBar />
      <div className="dashboard" style={backgroundImageStyle}>
        <section className="hero">
          <div className="hero-overlay">
            <h1>Explore, Buy, Rent - All In One Place!</h1>

            {/* Category Buttons */}
            <div className="category-buttons">
              {Object.keys(categoryEnumMap).map((item) => (
                <button
                  key={item}
                  className={selectedCategory === item ? "active" : ""}
                  onClick={() => setSelectedCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="search-bar">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ height: "100%" }}
              >
                <option value="">Select Category</option>
                {Object.keys(categoryEnumMap).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Enter City"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />

              <button className="search-button" onClick={handleSearch}>
                🔍 Search
              </button>
            </div>

            <hr className="divider" />
            <p className="owner-text">Are You A Property Owner?</p>
            <button
              className="post-property"
              onClick={() => navigate("/addProperty")}
            >
              <FaPlusSquare /> Post Property Ad
            </button>
          </div>
        </section>
      </div>
      <div
        style={{
          backgroundColor: "#f0f8ff",
          padding: "2.5rem",
          margin: "3rem auto",
          borderRadius: "15px",
          textAlign: "center",
          maxWidth: "800px",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e0e0e0",
          width: "80%",
        }}
      >
        <h2
          style={{
            color: "#0056b3",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          🎉 Check Your Luck! 🎉
        </h2>
        <p style={{ fontSize: "1.1rem", color: "#495057" }}>
          Feeling lucky? Participate in our property lottery for a chance to win
          amazing properties.
        </p>
        <Link to="/lottery" className="btn btn-lg btn-primary mt-3">
          Get Lucky Properties
        </Link>
      </div>

      {/* Categories section for quick click */}
      <Categories handleCategoryClick={handleCategoryClick} />
      {/* Premium Projects */}
      <section className="projects-section">
        <h2 className="section-title" style={{ marginLeft: "10px" }}>
          High-Demand project for Investment!
        </h2>
        <CompanyProjects endpoint="COMPANY_PRO" limit={4} />
      </section>

      {/* Normal Projects */}
      <section className="projects-section">
        <h2 className="section-title" style={{ marginLeft: "10px" }}>
          Latest Projects!
        </h2>
        <CompanyProjects endpoint="COMPANY_NORMAL" limit={4} />
      </section>

      <Forms />
      <CompanyListing
        apiEndpoint="/free-acess/getCompanyPro"
        heading="company Premium Profiles"
      />
      <CompanyListing
        apiEndpoint="/free-acess/getCompanyNormal"
        heading="company Profiles"
      />
      <ListingCards
        apiEndpoint="/free-acess/getExportPros"
        heading="Marketing ExportPros"
      />
      <ListingCards
        apiEndpoint="/free-acess/getExports"
        heading="Marketing Exports"
      />
      <ListingCards
        apiEndpoint="/free-acess/getConstructionProfessionals"
        heading="Construction Professionals"
      />
      <FranchiseMain />
      <MyRequirementsForm />
      <Services />

      <div className="d-none d-md-block">
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
