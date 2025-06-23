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
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>🚖 Driver Dashboard</h2>

        {user && (
          <div style={styles.profileCard}>
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
                  <span style={{ color: "#888" }}>N/A</span>
                  <button style={styles.initBtn} onClick={initializeElo}>
                    Initialize
                  </button>
                </>
              ) : (
                <span style={{ color: "#00796b", fontWeight: "600" }}>
                  {elo}
                </span>
              )}
            </p>
          </div>
        )}

        <div style={styles.feedbackSection}>
          <h3 style={styles.subheading}>📄 Ride Feedback History</h3>
          {feedbacks.length === 0 ? (
            <p style={styles.noData}>No feedback yet.</p>
          ) : (
            <ul style={styles.feedbackList}>
              {feedbacks.map((fb, i) => (
                <li key={i} style={styles.feedbackCard}>
                  <p>
                    <strong>Date:</strong>{" "}
                    {fb.date ? new Date(fb.date).toLocaleString() : "N/A"}
                  </p>
                  <p>
                    <strong>Rating:</strong> {fb.rating} ⭐
                  </p>
                  <p>
                    <strong>Sentiment:</strong>{" "}
                    <span
                      style={{
                        color:
                          fb.sentiment === "Positive"
                            ? "#2e7d32"
                            : fb.sentiment === "Negative"
                            ? "#c62828"
                            : "#616161",
                        fontWeight: "bold",
                      }}
                    >
                      {fb.sentiment}
                    </span>
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
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #e0f7fa, #ffffff)",
    padding: "2rem",
  },
  container: {
    maxWidth: "900px",
    margin: "auto",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },
  heading: {
    fontSize: "1.9rem",
    color: "#004d40",
    marginBottom: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#e0f2f1",
    padding: "1.5rem",
    borderRadius: "10px",
    marginBottom: "2rem",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
  },
  subheading: {
    fontSize: "1.4rem",
    color: "#00796b",
    marginBottom: "1rem",
  },
  feedbackSection: {
    backgroundColor: "#f5f5f5",
    padding: "1.5rem",
    borderRadius: "10px",
  },
  feedbackList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  feedbackCard: {
    backgroundColor: "#ffffff",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
  },
  initBtn: {
    marginLeft: "1rem",
    padding: "5px 12px",
    backgroundColor: "#00796b",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  noData: {
    textAlign: "center",
    color: "#888",
    fontSize: "1rem",
  },
};
