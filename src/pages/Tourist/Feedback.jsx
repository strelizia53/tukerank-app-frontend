import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import axios from "axios";

const Feedback = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [ride, setRide] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRide = async () => {
      const rideDoc = await getDoc(doc(db, "rides", rideId));
      if (rideDoc.exists()) {
        setRide({ id: rideDoc.id, ...rideDoc.data() });
      } else {
        setMessage("⚠️ Ride not found.");
      }
    };
    fetchRide();
  }, [rideId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "rides", rideId), {
        feedback: { review, rating },
      });

      const res = await axios.post("https://your-python-api.com/feedback", {
        driverId: ride.driverId,
        rideId: ride.id,
        rating,
        review,
      });

      const { sentiment, updatedElo } = res.data;

      await updateDoc(doc(db, "users", ride.driverId), { elo: updatedElo });

      await addDoc(collection(db, "users", ride.driverId, "eloHistory"), {
        elo: updatedElo,
        date: new Date(),
      });

      setMessage("✅ Feedback submitted successfully!");
      setTimeout(() => navigate("/rides"), 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit feedback. Try again.");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>📝 Give Feedback</h2>
        {ride ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              Rating:
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                style={styles.select}
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    {num} Star{num > 1 && "s"}
                  </option>
                ))}
              </select>
            </label>

            <textarea
              placeholder="Write your review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              style={styles.textarea}
            />

            <button type="submit" style={styles.button}>
              Submit Feedback
            </button>
          </form>
        ) : (
          <p style={styles.loading}>Loading ride details...</p>
        )}
        {message && <div style={styles.message}>{message}</div>}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #e0f7fa, #ffffff)",
    padding: "3rem 1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "2rem",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
  },
  heading: {
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
    color: "#004d40",
    fontWeight: "bold",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#00796b",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    marginTop: "0.5rem",
  },
  textarea: {
    height: "140px",
    fontSize: "1rem",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  button: {
    backgroundColor: "#00796b",
    color: "#fff",
    fontWeight: "bold",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s ease",
  },
  message: {
    marginTop: "1.5rem",
    fontSize: "1rem",
    textAlign: "center",
    fontWeight: "600",
    color: "#00695c",
  },
  loading: {
    fontStyle: "italic",
    color: "#555",
  },
};

export default Feedback;
