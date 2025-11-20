import React from "react";
import "../styles/Services.css";
import img1 from "../assets/verification.jpg";
import img2 from "../assets/house.jpg";
import img3 from "../assets/property.jpg";
import img4 from "../assets/cleaning.jpg";
import img5 from "../assets/boundary.jpg";
import img6 from "../assets/drafting.jpg";
import img7 from "../assets/packers.jpg";

const services = [
  {
    image: img1,
    title: "Document Verification",
    description:
      "We check the legality in the documentation and how the property has inherited the past.",
  },
  {
    image: img3,
    title: "Property Qualifying",
    description:
      "Here we check the physical position of the property border, if everything is the same according to the document.",
  },
  {
    image: img4,
    title: "Property Cleaning",
    description:
      "We clean and handover the property to the buyer. If it is an open plot we clean trees, plants etc. if it is a house we will water wash it.",
  },
  {
    image: img5,
    title: "Property Boundary",
    description:
      "here we give boundaries to the open plots and lands with cement pillars or stone pillars.",
  },
  {
    image: img6,
    title: "Document Drafting",
    description:
      "here we take care of the new document preparation on behalf of the buyer and we will be responsible for the safe registration and we will bare the documentation charges.",
  },
  {
    image: img7,
    title: "Packers and Movers",
    description:
      "we give packers and movers to our customers both seller and buyer. They can use this once in a lifetime.",
  },
  {
    image: img2,
    title: "Investment security",
    description:
      "here we give security to their investment if in case they face any legal issues on the property in future we are complete responsible. If they lose the property we them present market value of the property.",
  },
];

export default function Services() {
  return (
    <div className="services-container">
      <h2 className="services-title">What We Serve Our Sellers and Buyers</h2>
      <h3 className="class">
        We offer complete assistance for smooth real estate transactions.
      </h3>
      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <img
              src={service.image}
              alt={service.title}
              className="service-icon"
            />
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
