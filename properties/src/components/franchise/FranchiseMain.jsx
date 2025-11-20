import React from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "./HeroSection";

const FranchiseMain = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/franchise/details");
  };

  return (
    <div>
      <HeroSection onGetFranchise={handleNavigate} />
    </div>
  );
};

export default FranchiseMain;
