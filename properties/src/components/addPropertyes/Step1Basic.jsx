// const Step1Basic = ({ formData, setFormData, nextStep, username }) => {
//   return (
//     <form>
//       <h2>Welcome {username}</h2>

//       <div className="form-section">
//         <h3>Looking to</h3>
//         <div className="options">
//           <button
//             type="button"
//             className={`option ${formData.look === "Sell" ? "active" : ""}`}
//             onClick={() => setFormData({ ...formData, look: "Sell" })}
//           >
//             Sell
//           </button>
//           <button
//             type="button"
//             className={`option ${formData.look === "Rent" ? "active" : ""}`}
//             onClick={() => setFormData({ ...formData, look: "Rent" })}
//           >
//             Rent / Lease
//           </button>
//         </div>
//       </div>

//       <div className="form-section">
//         <h3>What is your Property</h3>
//         <div className="options">
//           {["Plot", "House", "Flat"].map((type) => (
//             <button
//               key={type}
//               type="button"
//               className={`option ${
//                 formData.selectProperty === type ? "active" : ""
//               }`}
//               onClick={() => setFormData({ ...formData, selectProperty: type })}
//             >
//               {type}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="buttons">
//         <button type="button" className="next" onClick={nextStep}>
//           Next →
//         </button>
//       </div>
//     </form>
//   );
// };

// export default Step1Basic;

const Step1Basic = ({ formData, setFormData, nextStep, username }) => {
  return (
    <form className="step">
      <h2>Welcome {username}</h2>

      <div className="form-section">
        <h3>Looking to</h3>
        <div className="options">
          <button
            type="button"
            className={`option ${formData.look === "Sell" ? "active" : ""}`}
            onClick={() => setFormData({ ...formData, look: "Sell" })}
          >
            Sell
          </button>
          <button
            type="button"
            className={`option ${formData.look === "Rent" ? "active" : ""}`}
            onClick={() => setFormData({ ...formData, look: "Rent" })}
          >
            Rent / Lease
          </button>
        </div>
      </div>

      <div className="form-section">
        <h3>What is your Property</h3>
        <div className="options">
          {[
            "Plot",
            "House",
            "Flat",
            "Villa",
            "Farm",
            "Lands",
            "Developmentlands",
            "Disputelands",
            "Commerciallands",
          ].map((type) => (
            <button
              key={type}
              type="button"
              className={`option ${
                formData.selectProperty === type ? "active" : ""
              }`}
              onClick={() => setFormData({ ...formData, selectProperty: type })}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="buttons">
        <button type="button" className="next" onClick={nextStep}>
          Next →
        </button>
      </div>
    </form>
  );
};

export default Step1Basic;
