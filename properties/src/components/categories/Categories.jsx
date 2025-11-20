import React from "react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const categories = [
    { name: "Flat", img: "/images/2-bhk apartment.png" },
    { name: "Plot", img: "/images/land-2.png" },
    { name: "Lands", img: "/images/plot-1.png" },
    { name: "House", img: "/images/independent house.png" },
    { name: "Disputelands", img: "/images/disputed land.png" },
    { name: "Developmentlands", img: "/images/development land.png" },
    { name: "Farm", img: "/images/farm land.png" },
    { name: "Villa", img: "/images/villa.png" },
    { name: "Commerciallands", img: "/images/commercial.png" },
  ];

  const nav = useNavigate();

  const handleCatClick = (name) => {
    nav(`/categorie/${name}`);
  };

  return (
    <div className="container text-center my-5">
      <h3 className="fw-bold mb-4 ml-0 d-none d-md-block">
        Beyond Listings – We Make Real Estate Easy!
      </h3>

      <h3 className="fw-bold mb-4 d-block d-md-none">Explore Categories</h3>

      {/* Desktop Carousel */}
      <div
        id="desktopCarousel"
        className="carousel slide d-none d-md-block"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {/* First Slide */}
          <div className="carousel-item active">
            <div className="row justify-content-center">
              {categories.slice(0, 3).map((cat, index) => (
                <div key={index} className="col-md-4">
                  <div
                    className="card shadow-sm border-0"
                    onClick={() => handleCatClick(cat.name)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={cat.img}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                      alt={cat.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{cat.name}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Second Slide */}
          <div className="carousel-item">
            <div className="row justify-content-center">
              {categories.slice(3, 6).map((cat, index) => (
                <div key={index} className="col-md-4">
                  <div
                    className="card shadow-sm border-0"
                    onClick={() => handleCatClick(cat.name)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={cat.img}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                      alt={cat.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{cat.name}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Third Slide */}
          <div className="carousel-item">
            <div className="row justify-content-center">
              {categories.slice(6, 9).map((cat, index) => (
                <div key={index} className="col-md-4">
                  <div
                    className="card shadow-sm border-0"
                    onClick={() => handleCatClick(cat.name)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={cat.img}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                      alt={cat.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{cat.name}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#desktopCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#desktopCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* Mobile View */}
      <div className="row g-4 d-md-none mt-4">
        {categories.map((cat, index) => (
          <div key={index} className="col-4">
            <div
              className="d-flex flex-column align-items-center"
              onClick={() => handleCatClick(cat.name)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="rounded-circle shadow-sm"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
              <p className="mt-2 small fw-medium">{cat.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
