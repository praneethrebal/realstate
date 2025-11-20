import React, { useState } from "react";
import "../../styles/UserRegisterationFormStyles.css";
import ProfileImageDefault from "../../assets/Default_profile_picture.jpeg";
import { BaseUrl } from "../../api/BaseUrl";
import { useNavigate, Link } from "react-router-dom";
import imageCompression from "browser-image-compression";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    category: "",
    role: "",
    planType: "",
    description: "",
    location: "",
    experience: "",
    referralCode: "",
    deals: "",
    selectedDuration: 1,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [otpValue, setOtpValue] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Loader state

  // ✅ Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role") {
      if (value === "PROFESSIONAL") {
        setFormData((prev) => ({
          ...prev,
          role: value,
          planType: "PROFESSIONAL_SINGLE",
        }));
      } else {
        setFormData((prev) => ({ ...prev, role: value, planType: "" }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle profile image
  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const [error, setError] = useState(null);

  // ✅ Send OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    if (!formData.phone) {
      setError("Please enter your phone number first!");
      return;
    }
    try {
      setLoading(true);
      const res = await BaseUrl.post(`/otp/send?phone=${formData.phone}`);
      // alert(res.data.message || "OTP sent successfully!");
      setIsOtpSent(true);
    } catch (err) {
      console.error("❌ OTP send failed:", err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otpValue) {
      setError("Please enter the OTP!");
      return;
    }

    try {
      setLoading(true);
      const res = await BaseUrl.post(
        `/otp/verify?phone=${formData.phone}&otp=${otpValue}`
      );
      // (res.data || "OTP verified successfully!");
      setIsOtpVerified(true);
    } catch (err) {
      console.error("❌ OTP verification failed:", err);
      setError("Invalid or expired OTP!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Registration Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      setError("Please verify your OTP before registering!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    try {
      setLoading(true);

      // ✅ Compress profile image if available
      if (profileImage) {
        const compressed = await imageCompression(profileImage, {
          maxSizeMB: 0.5,
          useWebWorker: true,
        });
        data.append("profileImage", compressed);
      }

      const res = await BaseUrl.post("/login/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log("Upload Progress:", percent + "%");
        },
      });

      // alert("✅ User registered successfully!");
      console.log("Registration Response:", res.data);
      navigate("/login/user");
    } catch (err) {
      console.error("❌ Registration failed:", err);
      // alert("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form-container">
      <h1 className="formHeading">Register</h1>

      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {/* Profile Section */}
        <div className="profile-Photo">
          <div className="profile-preview-wrapper">
            <img
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : ProfileImageDefault
              }
              alt="Profile Preview"
              className="profile-preview"
            />
          </div>

          <label className="custom-file-upload">
            Upload Profile
            <input type="file" onChange={handleFileChange} />
          </label>
        </div>

        {/* Common Fields */}
        <div className="commonFields">
          <input
            type="text"
            name="username"
            placeholder="Full Name"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Phone + OTP */}
          <div className="otp-section">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="otp-btn"
              onClick={sendOtp}
              disabled={loading || isOtpSent}
            >
              {loading && !isOtpSent ? (
                <div className="spinner"></div>
              ) : isOtpSent ? (
                "OTP Sent"
              ) : (
                "Send OTP"
              )}
            </button>

            {isOtpSent && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                />
                <button
                  type="button"
                  className="otp-btn"
                  onClick={verifyOtp}
                  disabled={loading || isOtpVerified}
                >
                  {loading && !isOtpVerified ? (
                    <div className="spinner"></div>
                  ) : isOtpVerified ? (
                    "Verified ✅"
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </>
            )}
          </div>

          {/* Passwords */}
          <div className="password-field">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Role Dropdown */}
        <div className="role-dropdown">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Profession</option>
            <option value="PROFESSIONAL">Professional</option>
            <option value="OWNER">Citizen</option>
            <option value="MARKETER">Marketer</option>
          </select>
        </div>

        {/* PROFESSIONAL Fields */}
        {formData.role === "PROFESSIONAL" && (
          <div className="role-fields">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Plumber">Plumber</option>
              <option value="Painter">Painter</option>
              <option value="Electrician">Electrician</option>
              <option value="Constructor">Constructor</option>
              <option value="Centring">Centring</option>
              <option value="Interior designer">Interior designer</option>
              <option value="Architecture">Architecture</option>
              <option value="Civil engineer">Civil engineer</option>
              <option value="Tiles works">Tiles works</option>
              <option value="Marble works">Marble works</option>
              <option value="Grinate works">Grinate works</option>
              <option value="Wood works">Wood works</option>
              <option value="Glass works">Glass works</option>
              <option value="Steel railing works">Steel railing works</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Doozer works">Doozer works</option>
              <option value="JCB works">JCB works</option>
              <option value="Borewells">Borewells</option>
              <option value="Material supplier">Material supplier</option>
              <option value="Welding works">Welding works</option>
              <option value="Land scalping">Land scalping</option>
              <option value="Matti supplier">Matti supplier</option>
            </select>

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />

            <input
              type="number"
              name="experience"
              placeholder="Experience (Years)"
              value={formData.experience}
              onChange={handleChange}
            />

            <input
              type="text"
              name="referralCode"
              placeholder="Referral Code"
              value={formData.referralCode}
              onChange={handleChange}
            />

            <div>
              <label>Price (₹)</label>
              <input type="number" value="4999" readOnly />
            </div>
          </div>
        )}

        {/* OWNER Fields */}
        {formData.role === "OWNER" && (
          <div className="role-fields">
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />

            <input
              type="number"
              name="experience"
              placeholder="Experience (Years)"
              value={formData.experience}
              onChange={handleChange}
            />

            <input
              type="text"
              name="referralCode"
              placeholder="Referral Code (Optional)"
              value={formData.referralCode}
              onChange={handleChange}
            />

            <input
              type="text"
              name="deals"
              placeholder="Deals (Optional)"
              value={formData.deals}
              onChange={handleChange}
            />
          </div>
        )}

        {/* MARKETER Fields */}
        {formData.role === "MARKETER" && (
          <div className="role-fields">
            <label>Marketing Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Plumber">Plumber</option>
              <option value="Painter">Painter</option>
              <option value="Electrician">Electrician</option>
              <option value="Constructor">Constructor</option>
              <option value="Centering">Centering</option>
              <option value="Interior designer">Interior designer</option>
              <option value="Architecure">Architecure</option>
              <option value="Civil engineer">Civil engineer</option>
              <option value="Tiles works">Tiles works</option>
              <option value="Marbel works">Marbel works</option>
              <option value="Grinate works">Grinate works</option>
              <option value="Wood works">Wood works</option>
              <option value="Glass works">Glass works</option>
              <option value="Steel railing works">Steel railing works</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Doozer works">Doozer works</option>
              <option value="JCB worksrician">JCB works</option>
              <option value="Borewells">Borewells</option>
              <option value="Material supplier">Material supplier</option>
            </select>

            <label>Choose Plan</label>
            <div>
              <label style={{ color: "black" }}>
                <input
                  className="marketer-paln"
                  type="radio"
                  name="planType"
                  value="MARKETER_EXPORT"
                  checked={formData.planType === "MARKETER_EXPORT"}
                  onChange={handleChange}
                />{" "}
                Exports (₹7999)
              </label>
              <label style={{ color: "black" }}>
                <input
                  type="radio"
                  name="planType"
                  value="MARKETER_EXPORT_PRO"
                  className="marketer-paln"
                  checked={formData.planType === "MARKETER_EXPORT_PRO"}
                  onChange={handleChange}
                />{" "}
                Exports Pro (₹14999)
              </label>
            </div>

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />

            <input
              type="number"
              name="experience"
              placeholder="Experience (Years)"
              value={formData.experience}
              onChange={handleChange}
            />

            <input
              type="text"
              name="referralCode"
              placeholder="Referral Code (Optional)"
              value={formData.referralCode}
              onChange={handleChange}
            />

            <input
              type="text"
              name="deals"
              placeholder="Deals (Optional)"
              value={formData.deals}
              onChange={handleChange}
            />
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>
            <input type="checkbox" required />
          </span>
          <span>
            <Link to="/TermsAndConditions">Terms & Conditions</Link>
          </span>
        </div>
        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="spinner"></div> Registering...
            </>
          ) : (
            "Register"
          )}
        </button>

        <button
          className="company"
          type="button"
          onClick={() => navigate("/companyRegister")}
          disabled={loading}
        >
          Register as Company
        </button>
      </form>
    </div>
  );
}
