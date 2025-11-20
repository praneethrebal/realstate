import React, { useEffect, useState, useRef } from "react";
import { BaseUrl } from "../../api/BaseUrl";
import { useAuth } from "../../hooks/useAuth";
import {
  FaHeart,
  FaComment,
  FaVolumeMute,
  FaVolumeUp,
  FaShareAlt,
  FaLink,
  FaWhatsapp,
} from "react-icons/fa";
import NavBar from "../NavBar";
import default_profile from "../../assets/Default_profile_picture.jpeg";

export default function ReelsViewer() {
  const { token } = useAuth();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsVisible, setCommentsVisible] = useState({});
  const [comments, setComments] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted
  const containerRef = useRef(null);
  const [shareOpenId, setShareOpenId] = useState(null);

  // Responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Close comment box on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside the interactive comment areas, close them.
      if (
        !event.target.closest(".reel-comments-popup") &&
        !event.target.closest(".reel-comment-input-bar") &&
        !event.target.closest(".reel-actions") // Keep it open if comment icon is clicked
      ) {
        setCommentsVisible({});
      }
    };

    // Only add listener if a comment box is open
    if (Object.values(commentsVisible).some(Boolean)) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [commentsVisible]);

  // Fetch reels
  useEffect(() => {
    const fetchReels = async () => {
      if (!token) return setLoading(false);
      try {
        const res = await BaseUrl.get("/getAllReels", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data);

        const reelsWithVideos = await Promise.all(
          res.data.map(async (reel) => {
            const videoRes = await BaseUrl.get(`/getReelVideo/${reel.id}`, {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "blob",
            });
            const videoUrl = URL.createObjectURL(videoRes.data);
            return { ...reel, videoUrl, liked: false };
          })
        );

        setReels(reelsWithVideos);
        console.log(reelsWithVideos);
      } catch (err) {
        console.error("Error fetching reels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, [token]);

  const toggleLike = (id) => {
    BaseUrl.put(`/incressLikes/${id}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch((err) => {
      console.error("Error liking reel:", err);
      alert("Failed to update like status.");
    });

    setReels((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              liked: !r.liked,
              likesCount: r.liked ? r.likesCount - 1 : r.likesCount + 1,
            }
          : r
      )
    );

    BaseUrl.put(`/incressLikes/${id}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch((err) => {
      console.error("Error liking reel:", err);
      // Revert UI on error
      setReels((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                liked: !r.liked,
                likesCount: r.liked ? r.likesCount + 1 : r.likesCount - 1,
              }
            : r
        )
      );
      alert("Failed to update like status.");
    });
  };

  const toggleCommentInput = (id) => {
    setCommentsVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addComment = (id, text) => {
    setComments((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), text],
    }));
  };

  const handleShareClick = (reelId) => {
    setShareOpenId((prev) => (prev === reelId ? null : reelId));
  };

  const shareUrls = (reel) => {
    // Since there's no single reel page, we'll share the main reels viewer page.
    const url = encodeURIComponent(window.location.origin + "/reelsView");
    const text = encodeURIComponent(`Check out this reel: ${reel.title}`);
    return {
      whatsapp: `https://api.whatsapp.com/send?text=${text}%20${url}`,
      link: window.location.origin + "/reelsView",
    };
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
    setShareOpenId(null);
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-black text-white">
        Loading reels...
      </div>
    );

  if (!reels.length)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-black text-white">
        No reels found
      </div>
    );

  return (
    <>
      <NavBar />
      <div className="reels-viewer-container">
        {reels.map((reel) => (
          <div
            key={reel.id}
            className="reel-item"
            onClick={() => setShareOpenId(null)}
          >
            <div key={reel.id} className="reel-item">
              <div
                className="reel-card"
                style={{
                  width: isMobile ? "100%" : "400px",
                  height: isMobile ? "calc(100vh - 120px)" : "700px",
                }}
              >
                {/* Video */}
                <video
                  src={reel.videoUrl}
                  controls={false}
                  loop
                  autoPlay
                  muted={isMuted}
                  className="reel-video"
                  onClick={() => setIsMuted((prev) => !prev)}
                />

                {/* Gradient overlay */}
                <div className="reel-gradient-overlay" />

                {/* Overlay text */}
                <div className="reel-info">
                  <div className="reel-user">
                    <img
                      src={default_profile}
                      alt="profile"
                      className="reel-user-avatar"
                    />
                    <h3 className="reel-title">{reel.title}</h3>
                  </div>
                  <p className="reel-description">{reel.descripation}</p>
                </div>

                {/* Mute/Unmute Icon */}
                <div className="reel-volume-control">
                  <div className="volume-icon-wrapper">
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </div>
                </div>

                {/* Buttons */}
                <div className="reel-actions">
                  <div className="action-item">
                    <FaHeart
                      className={`reel-action-icon ${
                        reel.liked ? "liked" : ""
                      }`}
                      onClick={() => toggleLike(reel.id)}
                    />
                    <span className="action-count">{reel.likesCount || 0}</span>
                  </div>
                  <div className="action-item">
                    <FaComment
                      className="reel-action-icon"
                      onClick={() => toggleCommentInput(reel.id)}
                    />
                  </div>
                  <div className="action-item">
                    <FaShareAlt
                      className="reel-action-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareClick(reel.id);
                      }}
                    />
                  </div>
                </div>

                {/* Share Popup */}
                {shareOpenId === reel.id && (
                  <div
                    className="share-popup"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h6>Share Reel</h6>
                    <button
                      onClick={() => handleCopyLink(shareUrls(reel).link)}
                      style={{
                        backgroundColor: "blue",
                        color: "white",
                        padding: "4px",
                        borderRadius: "5px",
                        border: "1px solid white",
                      }}
                    >
                      <FaLink /> Copy Link
                    </button>
                    <a
                      href={shareUrls(reel).whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button
                        style={{
                          backgroundColor: "blue",
                          color: "white",
                          padding: "4px",
                          borderRadius: "5px",
                          border: "1px solid white",
                        }}
                      >
                        <FaWhatsapp /> WhatsApp
                      </button>
                    </a>
                  </div>
                )}

                {/* Comments Pop-up */}
                {commentsVisible[reel.id] && (
                  <div
                    className="reel-comments-popup"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {comments[reel.id]?.length > 0 ? (
                      comments[reel.id].map((c, i) => (
                        <p key={i} className="comment-text">
                          {c}
                        </p>
                      ))
                    ) : (
                      <p className="no-comments-text">No comments yet</p>
                    )}
                  </div>
                )}

                {/* Comment Input Bar */}
                {commentsVisible[reel.id] && (
                  <div
                    className="reel-comment-input-bar"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="comment-input"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          addComment(reel.id, e.target.value.trim());
                          e.target.value = "";
                        }
                      }}
                    />

                    <button
                      onClick={(e) => {
                        const input = e.target
                          .closest("div")
                          .querySelector("input");
                        if (input && input.value.trim()) {
                          addComment(reel.id, input.value.trim());
                          input.value = "";
                        }
                      }}
                      className="comment-send-btn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0095f6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .reels-viewer-container {
          height: 100vh;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          background-color: black;
          position: relative;
        }

        .reel-item {
          height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          scroll-snap-align: start;
          padding-top: 60px; /* Space for top navbar */
          padding-bottom: 60px; /* Space for bottom navbar */
        }

        .reel-card {
          max-width: 95vw;
          background-color: #111;
          border-radius: 22px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .reel-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 22px;
        }

        .reel-gradient-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          pointer-events: none;
        }

        .reel-info {
          position: absolute;
          bottom: 20px; /* Move user info down */
          left: 20px;
          color: white;
          max-width: 75%;
        }

        .reel-user {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .reel-user-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          border: 2px solid white;
          object-fit: cover;
        }

        .reel-title {
          font-weight: 700;
          font-size: 1.3rem;
          margin: 0;
        }

        .reel-description {
          font-size: 0.95rem;
          opacity: 0.9;
          line-height: 1.4;
        }

        .reel-actions {
          position: absolute;
          right: 15px;
          bottom: 20px; /* Move action buttons down */
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 25px;
        }

        .reel-action-icon {
          font-size: 2.2rem;
          cursor: pointer;
          color: #e0e0e0;
          transition: color 0.2s, transform 0.2s;
        }

        .reel-action-icon:hover {
          transform: scale(1.1);
        }

        .reel-action-icon.liked {
          color: #ff3b5c;
        }

        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .action-count {
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        /* Comments Pop-up */
        .reel-comments-popup {
          position: absolute;
          bottom: 70px; /* Adjust for new input bar position */
          left: 0;
          width: 100%;
          max-height: 200px;
          overflow-y: auto;
          background-color: rgba(255, 255, 255, 0.97);
          border-top-left-radius: 14px;
          border-top-right-radius: 14px;
          box-shadow: 0 -3px 10px rgba(0,0,0,0.1);
          padding: 12px 14px;
          transition: all 0.3s ease;
          animation: slideUp 0.25s ease;
          z-index: 50;
        }

        .comment-text {
          margin: 6px 0;
          font-size: 0.95rem;
          color: #111;
          line-height: 1.4;
        }

        .no-comments-text {
          text-align: center;
          color: #777;
        }

        /* Comment Input Bar */
        .reel-comment-input-bar {
          position: absolute;
          bottom: 0; /* Stick to the very bottom */
          left: 0;
          width: 100%;
          display: flex;
          align-items: center;
          padding: 8px 12px;
          background-color: rgba(255, 255, 255, 0.95);
          border-top: 1px solid #ddd;
          border-bottom-left-radius: 22px; /* Match card radius */
          border-bottom-right-radius: 22px;
          box-shadow: 0 -1px 5px rgba(0,0,0,0.05);
        }

        .comment-input {
          flex: 1;
          padding: 8px 10px;
          border-radius: 20px;
          border: 1px solid #ccc;
          outline: none;
          font-size: 14px;
          background-color: #f9f9f9;
        }

        .comment-send-btn {
          margin-left: 10px;
          background: none;
          border: none;
          cursor: pointer;
        }

        .reel-volume-control {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none; /* Let clicks pass through to the video */
        }

        .volume-icon-wrapper {
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 1.5rem;
          opacity: 0; /* Initially hidden */
          transition: opacity 0.3s ease;
        }
      `}</style>
    </>
  );
}

const sharePopupStyles = `
  .share-popup {
    position: absolute;
    bottom: 80px;
    right: 60px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    padding: 10px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 8px;
    animation: fadeIn 0.2s ease;
  }

  .share-popup h6 {
    margin: 0 0 5px;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
  }

  .share-popup button, .share-popup a button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = sharePopupStyles;
document.head.appendChild(styleSheet);
