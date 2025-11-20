import React, { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import "../../styles/OwnersSection.css";
import { BaseUrl } from "../../api/BaseUrl";
import { useAuth } from "../../hooks/useAuth";
import ProfileImageDefault from "../../assets/Default_profile_picture.jpeg";

const OwnersSection = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchFranchiseOwners = async () => {
      try {
        const res = await BaseUrl.get("/getAllFranchiseOwners", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const usersData = res.data;
        const usersWithImages = {};

        // ✅ Fetch profile images using BaseUrl instead of fetch()
        await Promise.all(
          usersData.map(async (user) => {
            let imageUrl = ProfileImageDefault; // default fallback

            if (user.id) {
              try {
                const imgRes = await BaseUrl.get(`/getProfileImg/${user.id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                  responseType: "blob", // important to get image as binary
                });

                const blobUrl = URL.createObjectURL(imgRes.data);
                imageUrl = blobUrl;
              } catch (err) {
                console.error(
                  `Failed to fetch profile image for user ${user.id}`,
                  err
                );
              }
            }

            usersWithImages[user.id] = {
              username: user.username || "",
              image: imageUrl,
              location: user.location || "",
              experience: user.experience
                ? `${user.experience} Years Experience`
                : "",
            };
          })
        );

        setUsers(Object.values(usersWithImages));
      } catch (err) {
        console.error("Error fetching franchise owners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFranchiseOwners();
  }, [token]);

  const displayedUsers = showAll ? users : users.slice(0, 5);

  return (
    <Container fluid className="owners-section">
      <h3>What Our Owners Say</h3>
      <p>Hear from our satisfied customers about their experiences</p>

      <div
        className={`owners-carousel ${showAll ? "grid-view" : "scroll-view"}`}
      >
        {loading ? (
          <p>Loading owners...</p>
        ) : displayedUsers.length === 0 ? (
          <p>No owners to show yet.</p>
        ) : (
          displayedUsers.map((user, idx) => (
            <Card key={idx} className="owner-card">
              <Card.Img variant="top" src={user.image} />
              <Card.Body>
                <Card.Title>{user.username}</Card.Title>
                {user.location && <p>📍 {user.location}</p>}
                {user.experience && <p>📈 {user.experience}</p>}
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {users.length > 5 && (
        <Button className="see-all-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Less" : "See All"}
        </Button>
      )}
    </Container>
  );
};

export default OwnersSection;
