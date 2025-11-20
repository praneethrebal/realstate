import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavBar from "./NavBar";
import "../styles/MobileViewSearch.css";
import { Form } from "react-bootstrap";

const MobileViewSearch = () => {
  const categoryEnumMap = {
    Plots: "Plot",
    Villas: "Villa",
    Lands: "Land",
    Flats: "Flat",
    Commercial: "Commercial",
  };

  // ✅ useSearchParams before using it
  const [searchParams] = useSearchParams();
  const locationParam = searchParams.get("location");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchCity, setSearchCity] = useState(locationParam || "");
  const [filteredProperties, setFilteredProperties] = useState([]);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    location: locationParam || "",
    verified: "",
    minPrice: "",
    maxPrice: "",
    roadFacing: "",
    look: "",
  });

  // Handle filter changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Search handler
  const handleSearch = () => {
    if (!searchCity || !selectedCategory) {
      alert("Please select a category and enter a city!");
      return;
    }

    const enumCategory = categoryEnumMap[selectedCategory];
    navigate(
      `/categorie/${enumCategory}?location=${encodeURIComponent(searchCity)}`
    );
  };

  return (
    <>
      {/* Navbar at top */}
      <NavBar />

      {/* Mobile Search Section */}
      <div
        className="mobile-search-wrapper md:hidden w-full p-4 bg-white shadow-sm border-t border-gray-200 fixed top-[100px] left-0 z-50"
        style={{ marginTop: "100px", marginLeft: "10px" }}
      >
        <div className="mobile-search-container">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">Select Category</option>
            {Object.keys(categoryEnumMap).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* City */}
          <input
            type="text"
            placeholder="Enter City"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="p-2 border rounded-lg"
          />

          {/* Price Filters */}
          <div className="d-flex gap-2 w-100">
            <Form.Control
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min ₹"
            />
            <Form.Control
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max ₹"
            />
          </div>

          {/* Look (Sell / Rent) */}
          <Form.Group>
            <Form.Label>Look (Sell / Rent)</Form.Label>
            <Form.Select
              name="look"
              value={filters.look}
              onChange={handleChange}
            >
              <option value="">All</option>
              <option value="Sell">Sell</option>
              <option value="Rent">Rent</option>
            </Form.Select>
          </Form.Group>

          {/* Search Button */}
          <button className="search-button" onClick={handleSearch}>
            🔍 Search
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileViewSearch;
