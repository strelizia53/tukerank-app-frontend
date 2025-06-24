import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";

const Feedback = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [ride, setRide] = useState(null);
  const [message, setMessage] = useState("");

  // Get logged-in tourist email
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUserEmail(u.email);
      else navigate("/login");
    });
    return () => unsub();
  }, [navigate]);

  // Fetch ride details
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
    if (!ride || !userEmail) return;

    try {
      // 1. Get the driver's username using their email
      let username = "";
      const userSnap = await getDocs(collection(db, "users"));
      let driverDocId = null;

      userSnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.email === ride.driverEmail) {
          username = data.username;
          driverDocId = docSnap.id;
        }
      });

      if (!username || !driverDocId) {
        setMessage("❌ Driver profile not found.");
        return;
      }

      // 2. Call the Flask API with proper values
      const res = await axios.post("http://127.0.0.1:5000/feedback", {
        username,
        review,
        rating,
      });

      const { sentiment, eloChange, newElo } = res.data;

      const currentDate = new Date();

      // 3. Add feedback document to 'feedbacks'
      await addDoc(collection(db, "feedbacks"), {
        driverId: username,
        review,
        rating,
        sentiment,
        eloChange,
        newElo,
        rideId: ride.id,
        touristEmail: userEmail,
        date: currentDate,
        dateReadable: currentDate.toLocaleString(), // ✅ Human-readable timestamp
      });

      // 4. Update 'rides' to reflect feedback was submitted
      await updateDoc(doc(db, "rides", rideId), {
        feedback: { review, rating },
      });

      // 5. Update user's Elo
      await updateDoc(doc(db, "users", driverDocId), {
        elo: newElo,
      });

      // 6. Add Elo history record
      await addDoc(collection(db, "eloHistory"), {
        driverId: username,
        elo: newElo,
        date: currentDate,
        dateReadable: currentDate.toLocaleString(), // Optional here too
      });

      setMessage("✅ Feedback submitted successfully!");
      setTimeout(() => navigate("/rides"), 2500);
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
