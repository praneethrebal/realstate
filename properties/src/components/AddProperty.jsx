import React, { useState } from "react";
import "../styles/addProperty.css";
import NavBar from "../components/NavBar";
import { useAuth } from "../hooks/useAuth";
import Step1Basic from "../components/addPropertyes/Step1Basic";
import Step2Details from "../components/addPropertyes/Step2Details";
import Step3Final from "../components/addPropertyes/Step3Final";
import Step4Media from "../components/addPropertyes/Step4Media";
import { BaseUrl } from "../api/BaseUrl";

const AddProperty = () => {
  const [step, setStep] = useState(1);
  const { username, token } = useAuth();

  const [formData, setFormData] = useState({
    lookingTo: "",
    propertyType: "",
    projectName: "",
    extent: "",
    facing: "",
    roadSize: "",
    units: "",
    dimensions: "",
    numberOfFloors: "",
    numberOfBHK: "",
    builtUpArea: "",
    carpetArea: "",
    openArea: "",
    rentalIncome: "",
    floorNo: "",
    communityType: "",
    roadFacing: false,
    price: 0,
    waterSource: "",
    unitType: "",
    zone: "",
    developmentType: "",
    expectedAdvance: "",
    ratio: "",
    propertyId: 0,
    disputeDetails: "",
    lookingToSell: false,
    problemDetails: "",
    actualPrice: "",
    salePrice: "",
    look: "",
    selectProperty: "",
    reraApproved: false,
    approvalType: "",
    amenities: [],
    highlights: "",
    location: "",
    locationUrl: "",
    photos: [],
    video: null,
    documents: [],
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final Data:", formData);
    BaseUrl.post(`/addProperty`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        alert(res.msg.selectProperty);

        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="addProperty">
      <NavBar />
      {/* <div className="form-container"> */}
      {step === 1 && (
        <Step1Basic
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          username={username}
        />
      )}
      {step === 2 && (
        <Step2Details
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {step === 3 && (
        <Step3Final
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {step === 4 && (
        <Step4Media
          formData={formData}
          setFormData={setFormData}
          prevStep={prevStep}
          handleSubmit={handleSubmit}
        />
      )}
      {/* </div> */}
    </div>
  );
};

export default AddProperty;
