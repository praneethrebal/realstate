import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation
import "bootstrap/dist/css/bootstrap.min.css";
import pickers from "../../assets/pickers.avif";
import constraction from "../../assets/constraction.jpg";
import loan from "../../assets/loan.jpg";

const Forms = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation

  const sections = [
    {
      img: pickers,
      title: "Move Smart, Move Safe",
      text: "From Packing To Unpacking, Our Trusted Packers & Movers Ensure A Smooth, Safe, And Hassle-Free Relocation Experience. So You Can Focus On Settling Into Your New Home.",
      button: "Check Now",
      reverse: false,
      path: "/pickers-and-movers", // ✅ Added route
    },
    {
      img: constraction,
      title: "Build With Confidence, Source With Ease",
      text: "Another description text goes here. This section is also responsive and will adjust according to the screen size.",
      button: "Learn More",
      reverse: true,
      path: "/build-with-confidence", // ✅ Added route
    },
    {
      img: loan,
      title: "Best Offers, Lowest Interest Rates",
      text: "One place to compare best offers from all the best banks in the country.",
      button: "Apply for Loan",
      reverse: false,
      path: "/loan-application", // ✅ Added route
    },
  ];

  return (
    <div
      className="container-fluid py-5"
      style={{ backgroundColor: "#dce7fb" }}
    >
      {sections.map((sec, i) => (
        <div
          key={i}
          className={`row align-items-center justify-content-center mb-5 ${
            sec.reverse ? "flex-row-reverse" : ""
          }`}
        >
          {/* Image */}
          <div className="col-md-6 text-center">
            <img
              src={sec.img}
              alt={sec.title}
              className="img-fluid rounded-3 shadow-sm"
              style={{ height: "300px", objectFit: "cover", width: "90%" }}
            />
          </div>

          {/* Text */}
          <div className="col-md-5 mt-3 mt-md-0">
            <h3 className="fw-bold mb-3 text-dark">{sec.title}</h3>
            <p className="text-secondary">{sec.text}</p>
            <button
              className="btn btn-primary px-4 py-2 mt-2"
              onClick={() => navigate(sec.path)} // ✅ Button redirects
            >
              {sec.button}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Forms;
