import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BaseUrl } from "../../api/BaseUrl";
import "../../styles/ContactUsForm.css";

export default function ContactUsForm() {
  const { id } = useParams();
  console.log("Contact Us Form for User ID:", id);

  const [formData, setFormData] = useState({
    toUser: id,
    name: "",
    number: "",
    email: "",
    address: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const bearerToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (bearerToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      alert("You must be logged in to submit this form.");
      navigate("/login");
    }
  }, [bearerToken, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return;

    try {
      // 1️⃣ Submit Contact Us form
      const res = await BaseUrl.post("/forms/ContactUsForm", formData, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });

      console.log("✅ Submission successful:", res.data);
      alert("Form submitted successfully!");

      // 2️⃣ Increase lead count for the user
      try {
        await BaseUrl.put(
          `/leadsCount/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${bearerToken}` },
          }
        );
        console.log("📈 Lead count updated for user:", id);
      } catch (leadError) {
        console.error("⚠️ Failed to update lead count:", leadError);
      }

      // 3️⃣ Reset form and go back
      setFormData({
        toUser: id,
        name: "",
        number: "",
        email: "",
        address: "",
      });
      navigate(-1);
    } catch (err) {
      console.error("❌ Submission error:", err.response?.data || err.message);
      alert("Error submitting form. Please try again.");
    }
  };

  return (
    <form className="ContactUsForm" onSubmit={handleSubmit}>
      <p className="form-title">Contact Us</p>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="text"
        name="number"
        value={formData.number}
        onChange={handleChange}
        placeholder="Contact Number"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        required
      />
      <button type="submit" disabled={!isLoggedIn}>
        Submit
      </button>
    </form>
  );
}
