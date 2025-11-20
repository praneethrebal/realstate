import React, { useState } from "react";
import { BaseUrl } from "../../api/BaseUrl";
import { useAuth } from "../../hooks/useAuth";
import { FaUpload, FaVideo, FaTimesCircle } from "react-icons/fa";

export default function PostReel() {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !file) {
      setMsg("⚠️ Please fill all fields");
      return;
    }

    setLoading(true);
    setMsg("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("descripation", description);
    formData.append("reel", file);

    try {
      const res = await BaseUrl.post("/postReel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      setMsg("✅ Reel uploaded successfully!");
      setTitle("");
      setDescription("");
      setFile(null);
      setPreview("");
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to upload reel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-reel-page d-flex justify-content-center align-items-center">
      <style>
        {`
          .post-reel-page {
            background-color: #fafafa;
            min-height: 100vh;
            padding: 30px 10px;
          }
          .reel-card {
            background: #fff;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 450px;
          }
          .reel-header {
            font-size: 1.6rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 1rem;
            color: #262626;
          }
          .upload-box {
            border: 2px dashed #ccc;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: 0.3s ease;
          }
          .upload-box:hover {
            border-color: #0095f6;
            background: #f9f9f9;
          }
          .upload-box input {
            display: none;
          }
          .upload-icon {
            font-size: 2rem;
            color: #0095f6;
            margin-bottom: 8px;
          }
          .reel-preview video {
            border-radius: 12px;
            margin-top: 15px;
            width: 100%;
          }
          .alert {
            border-radius: 10px;
            font-weight: 500;
          }
        `}
      </style>

      <form onSubmit={handleSubmit} className="reel-card">
        <div className="reel-header">
          <FaVideo className="me-2" />
          Post a Reel
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter reel title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ backgroundColor: "white", color: "black" }}
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            rows="3"
            placeholder="Write a caption..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div
          className="upload-box mb-3"
          onClick={() => document.getElementById("reelFile").click()}
        >
          <FaUpload className="upload-icon" />
          <div>Click to upload your reel</div>
          <input
            id="reelFile"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
          />
        </div>

        {preview && (
          <div className="reel-preview position-relative">
            <FaTimesCircle
              onClick={() => {
                setPreview("");
                setFile(null);
              }}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                color: "#ff4d4f",
                cursor: "pointer",
                fontSize: "1.5rem",
              }}
            />
            <video src={preview} controls />
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-100 mt-3"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Reel"}
        </button>

        {msg && <div className="alert alert-info text-center mt-3">{msg}</div>}
      </form>
    </div>
  );
}
