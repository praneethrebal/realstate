import React from "react";
import { IoNutritionOutline, IoPaperPlaneOutline } from "react-icons/io5";

const Step2Details = ({ formData, setFormData, nextStep, prevStep }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  return (
    <form className="step">
      <h2>Additional Information</h2>

      {formData.selectProperty === "Plot" && (
        <div>
          <input
            type="text"
            name="projectName"
            placeholder="Project/Venture Name"
            value={formData.projectName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="extent"
            placeholder="Extent (sqft)"
            value={formData.extent}
            onChange={handleChange}
          />
          <select
            name="units"
            style={{ width: "100%" }}
            value={formData.units}
            onChange={handleChange}
          >
            <option value="">units</option>
            <option value="sqyd">sqyd</option>
            <option value="sft">sft</option>
          </select>
          <input
            type="text"
            name="facing"
            placeholder="Facing (East, West...)"
            value={formData.facing}
            onChange={handleChange}
          />
          <input
            type="text"
            name="roadSize"
            placeholder="Road Size (ft)"
            value={formData.roadSize}
            onChange={handleChange}
          />
          <input
            type="text"
            name="dimensions"
            placeholder="Dimensions"
            value={formData.dimensions}
            onChange={handleChange}
          />
        </div>
      )}

      {formData.selectProperty === "House" && (
        <div>
          <input
            type="text"
            name="projectName"
            placeholder="Project/Venture Name"
            value={formData.projectName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="extent"
            placeholder="Extent (sqft)"
            value={formData.extent}
            onChange={handleChange}
          />
          <select
            name="units"
            style={{ width: "100%" }}
            value={formData.units}
            onChange={handleChange}
          >
            <option value="">units</option>
            <option value="sqyd">sqyd</option>
            <option value="sft">sft</option>
          </select>
          <input
            type="number"
            name="numberOfBHK"
            placeholder="No. of BHK"
            value={formData.numberOfBHK}
            onChange={handleChange}
          />
          <input
            type="number"
            name="numberOfFloors"
            placeholder="No. of Floors"
            value={formData.numberOfFloors}
            onChange={handleChange}
          />
          <input
            type="text"
            name="facing"
            placeholder="Facing (East, West...)"
            value={formData.facing}
            onChange={handleChange}
          />
          <input
            type="text"
            name="roadSize"
            placeholder="Road Size (ft)"
            value={formData.roadSize}
            onChange={handleChange}
          />
          <input
            type="text"
            name="dimensions"
            placeholder="Dimensions (e.g. 30x40)"
            value={formData.dimensions}
            onChange={handleChange}
          />
          <input
            type="text"
            name="builtUpArea"
            placeholder="Built-up Area (sqft)"
            value={formData.builtUpArea}
            onChange={handleChange}
          />
          <input
            type="text"
            name="carpetArea"
            placeholder="Carpet Area (sqft)"
            value={formData.carpetArea}
            onChange={handleChange}
          />
          <input
            type="text"
            name="openArea"
            placeholder="Open Area (sqft)"
            value={formData.openArea}
            onChange={handleChange}
          />
          <input
            type="number"
            name="floorNo"
            placeholder="Floor No."
            value={formData.floorNo}
            onChange={handleChange}
          />
          <input
            type="text"
            name="rentalIncome"
            placeholder="Rental Income"
            value={formData.rentalIncome}
            onChange={handleChange}
          />
          <select
            value={formData.roadFacing}
            onChange={(e) =>
              setFormData({ ...formData, roadFacing: e.target.value })
            }
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      )}

      {formData.selectProperty === "Flat" && (
        <div>
          <input
            type="text"
            name="projectName"
            placeholder="Project/Venture Name"
            value={formData.projectName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="communityType"
            placeholder="Community Type"
            value={formData.communityType}
            onChange={handleChange}
          />
          <input
            type="text"
            name="facing"
            placeholder="Facing (East, West...)"
            value={formData.facing}
            onChange={handleChange}
          />
          <input
            type="text"
            name="extent"
            placeholder="Extent (sqft)"
            value={formData.extent}
            onChange={handleChange}
          />
          <select
            name="units"
            style={{ width: "100%" }}
            value={formData.units}
            onChange={handleChange}
          >
            <option value="">units</option>
            <option value="sqyd">sqyd</option>
            <option value="sft">sft</option>
          </select>
          <input
            type="text"
            name="builtUpArea"
            placeholder="Built-up Area (sqft)"
            value={formData.builtUpArea}
            onChange={handleChange}
          />
          <input
            type="text"
            name="carpetArea"
            placeholder="Carpet Area (sqft)"
            value={formData.carpetArea}
            onChange={handleChange}
          />
          <input
            type="number"
            name="numberOfBHK"
            placeholder="No. of BHK"
            value={formData.numberOfBHK}
            onChange={handleChange}
          />
          <input
            type="number"
            name="floorNo"
            placeholder="Floor No."
            value={formData.floorNo}
            onChange={handleChange}
          />
        </div>
      )}

      {formData.selectProperty === "Villa" && (
        <div>
          <input
            type="text"
            name="projectName"
            placeholder="Project/Venture Name"
            value={formData.projectName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="facing"
            placeholder="facing(east,west...)"
            value={formData.facing}
            onChange={handleChange}
          />
          <input
            type="number"
            name="numberOfBHK"
            placeholder="No. of BHK"
            value={formData.numberOfBHK}
            onChange={handleChange}
          />
          <input
            type="text"
            name="dimensions"
            placeholder="Dimensions (e.g. 30x40)"
            value={formData.dimensions}
            onChange={handleChange}
          />
          <input
            type="text"
            name="roadSize"
            placeholder="Road Size (ft)"
            value={formData.roadSize}
            onChange={handleChange}
          />
          <input
            type="text"
            name="extent"
            placeholder="Extent (sqft)"
            value={formData.extent}
            onChange={handleChange}
          />
          <select
            name="units"
            style={{ width: "100%" }}
            value={formData.units}
            onChange={handleChange}
          >
            <option value="">units</option>
            <option value="sqyd">sqyd</option>
            <option value="sft">sft</option>
          </select>
          <input
            type="text"
            name="builtUpArea"
            placeholder="Built-up Area (sqft)"
            value={formData.builtUpArea}
            onChange={handleChange}
          />
          <input
            type="text"
            name="openArea"
            placeholder="open Area"
            value={formData.openArea}
            onChange={handleChange}
          />
          <input
            type="number"
            name="rentalIncome"
            placeholder="Rental Income"
            value={formData.rentalIncome}
            onChange={handleChange}
          />
        </div>
      )}

      {formData.selectProperty === "Farm" && (
        <div>
          <input
            type="text"
            name="projectName"
            placeholder="Project/Venture Name"
            value={formData.projectName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="extent"
            placeholder="Extent "
            value={formData.extent}
            onChange={handleChange}
          />
          <select
            name="units"
            style={{ width: "100%" }}
            value={formData.units}
            onChange={handleChange}
          >
            <option value="">units</option>
            <option value="sqyd">sqyd</option>
            <option value="sft">sft</option>
          </select>
          <input
            type="text"
            name="facing"
            placeholder="facing(east,west...)"
            value={formData.facing}
            onChange={handleChange}
          />
          <input
            type="text"
            name="dimensions"
            placeholder="Dimensions (e.g. 30x40)"
            value={formData.dimensions}
            onChange={handleChange}
          />
        </div>
      )}
      {formData.selectProperty === "Lands" && (
        <div>
          <input
            type="text"
            name="landType"
            placeholder="Type Of Land"
            value={formData.landType}
            onChange={handleChange}
          />
          <input
            type="text"
            name="extent"
            placeholder="Extent (sqft)"
            value={formData.extent}
            onChange={handleChange}
          />
          <select
            name="units"
            style={{ width: "100%" }}
            value={formData.units}
            onChange={handleChange}
          >
            <option value="">units</option>
            <option value="Guntas">Guntas</option>
            <option value="Acres">Acres</option>
          </select>
          <input
            type="text"
            name="soilType"
            placeholder="Type Of Soil"
            value={formData.soilType}
            onChange={handleChange}
          />
          <input
            type="text"
            name="waterSource"
            placeholder="Water Source"
            value={formData.waterSource}
            onChange={handleChange}
          />
          <input
            type="text"
            name="roadSize"
            placeholder="Road Size (ft)"
            value={formData.roadSize}
            onChange={handleChange}
          />
          <select
            value={formData.roadFacing}
            onChange={(e) =>
              setFormData({ ...formData, roadFacing: e.target.value })
            }
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      )}

      {formData.selectProperty === "Developmentlands" && (
        <div>
          <input
            type="text"
            name="landType"
            placeholder="Type Of Land"
            value={formData.landType}
            onChange={handleChange}
          />
          <input
            type="text"
            name="extent"
            placeholder="Extent (sqft)"
            value={formData.extent}
            onChange={handleChange}
          />
          <select
            name="units"
            style={{ width: "100%" }}
            value={formData.units}
            onChange={handleChange}
          >
            <option value="">units</option>
            <option value="Guntas">Guntas</option>
            <option value="Acres">Acres</option>
          </select>
          <input
            type="text"
            name="soilType"
            placeholder="Type Of Soil"
            value={formData.soilType}
            onChange={handleChange}
          />
          <input
            type="text"
            name="zone"
            placeholder="zone"
            value={formData.zone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="roadSize"
            placeholder="Road Size (ft)"
            value={formData.roadSize}
            onChange={handleChange}
          />
          <input
            type="text"
            name="developmentType"
            placeholder="Type Of Development"
            value={formData.developmentType}
            onChange={handleChange}
          />
          <input
            type="text"
            name="expectedAdvance"
            placeholder="Expecting Advance"
            value={formData.expectedAdvance}
            onChange={handleChange}
          />
          <input
            type="text"
            name="ratio"
            placeholder="Ratio  (Land Owner/Developer)"
            value={formData.ratio}
            onChange={handleChange}
          />
          <select
            value={formData.roadFacing}
            onChange={(e) =>
              setFormData({ ...formData, roadFacing: e.target.value })
            }
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      )}

      {formData.selectProperty === "Disputelands" && (
        <div>
          <input
            type="text"
            name="landType"
            placeholder="Type Of Land"
            value={formData.landType}
            onChange={handleChange}
          />
          <input
            type="text"
            name="extent"
            placeholder="Extent (sqft)"
            value={formData.extent}
            onChange={handleChange}
          />
          <select
            name="units"
            style={{ width: "100%" }}
            value={formData.units}
            onChange={handleChange}
          >
            <option value="">units</option>
            <option value="Guntas">Guntas</option>
            <option value="Acres">Acres</option>
          </select>
          <input
            type="text"
            name="soilType"
            placeholder="Type Of Soil"
            value={formData.soilType}
            onChange={handleChange}
          />
          <input
            type="text"
            name="zone"
            placeholder="zone"
            value={formData.zone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="roadSize"
            placeholder="Road Size (ft)"
            value={formData.roadSize}
            onChange={handleChange}
          />
          <input
            type="text"
            name="disputeDetails"
            placeholder="what is the dispute?(Explain here)"
            value={formData.disputeDetails}
            onChange={handleChange}
          />
          <input
            type="text"
            name="problemDetails"
            placeholder="looking for sell or solve problem"
            value={formData.problemDetails}
            onChange={handleChange}
          />
          <input
            type="text"
            name="actualPrice"
            placeholder="Actual price"
            value={formData.actualPrice}
            onChange={handleChange}
          />
          <input
            type="text"
            name="salePrice"
            placeholder="Sale Price"
            value={formData.salePrice}
            onChange={handleChange}
          />
          <select
            value={formData.roadFacing}
            onChange={(e) =>
              setFormData({ ...formData, roadFacing: e.target.value })
            }
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      )}

      {formData.selectProperty === "Commerciallands" && (
        <div>
          <input
            type="text"
            name="landType"
            placeholder="Type Of Land"
            value={formData.landType}
            onChange={handleChange}
          />
          <input
            type="text"
            name="extent"
            placeholder="Extent (sqft)"
            value={formData.extent}
            onChange={handleChange}
          />
          <select
            name="units"
            style={{ width: "100%" }}
            value={formData.units}
            onChange={handleChange}
          >
            <option value="">units</option>
            <option value="Guntas">Guntas</option>
            <option value="Acres">Acres</option>
          </select>
          <input
            type="text"
            name="soilType"
            placeholder="Type Of Soil"
            value={formData.soilType}
            onChange={handleChange}
          />
          <input
            type="text"
            name="waterSource"
            placeholder="Water Source"
            value={formData.waterSource}
            onChange={handleChange}
          />
          <input
            type="text"
            name="roadSize"
            placeholder="Road Size (ft)"
            value={formData.roadSize}
            onChange={handleChange}
          />
          <select
            value={formData.roadFacing}
            onChange={(e) =>
              setFormData({ ...formData, roadFacing: e.target.value })
            }
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      )}

      <div className="buttons">
        <button type="button" onClick={prevStep}>
          ← Back
        </button>
        <button type="button" onClick={nextStep}>
          Next →
        </button>
      </div>
    </form>
  );
};

export default Step2Details;
