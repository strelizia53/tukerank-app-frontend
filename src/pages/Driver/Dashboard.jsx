import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export default function DriverDashboard() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [elo, setElo] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await fetchDriverData(u.uid);
        await fetchFeedbacks(u.uid);
      }
    });

    return () => unsub();
  }, []);

  const fetchDriverData = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      setUsername(data.username || "N/A");
      setElo(data.elo || "N/A");
    }
  };

  const initializeElo = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { elo: 100 });
    setElo(100);
  };

  const fetchFeedbacks = async (uid) => {
    const q = query(collection(db, "feedbacks"), where("driverId", "==", uid));
    const querySnap = await getDocs(q);
    const feedbackList = [];
    querySnap.forEach((doc) => feedbackList.push(doc.data()));
    setFeedbacks(feedbackList);
  };

  return (
    <div style={styles.container}>
      <h2>Driver Dashboard</h2>
      {user && (
        <div style={styles.card}>
          <p>
            <strong>Username:</strong> {username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Elo Rating:</strong>{" "}
            {elo === "N/A" ? (
              <>
                N/A{" "}
                <button style={styles.initBtn} onClick={initializeElo}>
                  Initialize Rating
                </button>
              </>
            ) : (
              elo
            )}
          </p>
        </div>
      )}

      <div style={styles.feedbackSection}>
        <h3>Ride Feedback History</h3>
        {feedbacks.length === 0 ? (
          <p>No feedback yet.</p>
        ) : (
          <ul>
            {feedbacks.map((fb, i) => (
              <li key={i} style={styles.feedbackCard}>
                <p>
                  <strong>Date:</strong> {fb.date || "N/A"}
                </p>
                <p>
                  <strong>Rating:</strong> {fb.rating} ⭐
                </p>
                <p>
                  <strong>Sentiment:</strong> {fb.sentiment}
                </p>
                <p>
                  <strong>Review:</strong> {fb.review}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "2rem",
  },
  card: {
    background: "#e0f2f1",
    padding: "1.5rem",
    borderRadius: "10px",
    marginBottom: "2rem",
  },
  feedbackSection: {
    background: "#f9f9f9",
    padding: "1rem",
    borderRadius: "8px",
  },
  feedbackCard: {
    background: "#fff",
    padding: "1rem",
    border: "1px solid #ddd",
    marginBottom: "1rem",
    borderRadius: "6px",
  },
  initBtn: {
    marginLeft: "1rem",
    padding: "5px 10px",
    backgroundColor: "#00796b",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
