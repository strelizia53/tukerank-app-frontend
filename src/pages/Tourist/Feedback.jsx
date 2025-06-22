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
        setMessage("Ride not found.");
      }
    };

    fetchRide();
  }, [rideId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Save feedback to the ride
      await updateDoc(doc(db, "rides", rideId), {
        feedback: {
          review,
          rating,
        },
      });

      // Step 2: Send feedback to Python backend
      const res = await axios.post("https://your-python-api.com/feedback", {
        driverId: ride.driverId,
        rideId: ride.id,
        rating,
        review,
      });

      const { sentiment, updatedElo } = res.data;

      // Step 3: Update driver elo in users/{driverId}
      const driverRef = doc(db, "users", ride.driverId);
      await updateDoc(driverRef, {
        elo: updatedElo,
      });

      // Step 4: Log Elo snapshot to users/{driverId}/eloHistory
      await addDoc(collection(db, "users", ride.driverId, "eloHistory"), {
        elo: updatedElo,
        date: new Date(),
      });

      setMessage("✅ Feedback submitted and Elo updated!");
      setTimeout(() => navigate("/rides"), 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to submit feedback.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Give Feedback</h2>
      {ride ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <label>
            Rating:
            <select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              style={styles.input}
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>
                  {num} Star{num > 1 && "s"}
                </option>
              ))}
            </select>
          </label>

          <textarea
            placeholder="Leave a review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
            style={styles.textarea}
          ></textarea>

          <button type="submit" style={styles.button}>
            Submit Feedback
          </button>
        </form>
      ) : (
        <p>Loading ride...</p>
      )}
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "2rem",
    marginTop: "2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "8px",
    fontSize: "1rem",
    width: "100%",
  },
  textarea: {
    padding: "10px",
    fontSize: "1rem",
    height: "120px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#00796b",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  message: {
    marginTop: "1rem",
    color: "#00796b",
    fontWeight: "bold",
  },
};

export default Feedback;
