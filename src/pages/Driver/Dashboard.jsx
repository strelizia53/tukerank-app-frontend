import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { FaUser, FaStar, FaCheck, FaTimes, FaClock } from "react-icons/fa";

export default function DriverDashboard() {
  const [user, setUser] = useState(null);
  const [elo, setElo] = useState(null);
  const [username, setUsername] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [rideRequests, setRideRequests] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const fetchedUsername = await fetchDriverData(u.email);
        if (fetchedUsername) {
          fetchRideRequests(u.email);
          fetchFeedbacks(fetchedUsername);
        }
      }
    });

    return () => unsub();
  }, []);

  const fetchDriverData = async (email) => {
    const snapshot = await getDocs(
      query(collection(db, "users"), where("email", "==", email))
    );
    if (!snapshot.empty) {
      const driver = snapshot.docs[0].data();
      setElo(driver.elo || "N/A");
      setUsername(driver.username);
      return driver.username;
    }
    return null;
  };

  const initializeElo = async () => {
    if (!user) return;
    const snapshot = await getDocs(
      query(collection(db, "users"), where("email", "==", user.email))
    );
    if (!snapshot.empty) {
      const docId = snapshot.docs[0].id;
      await updateDoc(doc(db, "users", docId), { elo: 100 });
      setElo(100);
    }
  };

  const fetchRideRequests = async (email) => {
    const q = query(
      collection(db, "rides"),
      where("driverEmail", "==", email),
      where("status", "==", "Scheduled")
    );
    const snap = await getDocs(q);
    const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRideRequests(list);
  };

  const fetchFeedbacks = async (driverUsername) => {
    const q = query(
      collection(db, "feedbacks"),
      where("driverId", "==", driverUsername)
    );
    const querySnap = await getDocs(q);
    const feedbackList = querySnap.docs.map((doc) => doc.data());
    setFeedbacks(feedbackList);
  };

  const updateRideStatus = async (rideId, newStatus) => {
    await updateDoc(doc(db, "rides", rideId), { status: newStatus });
    fetchRideRequests(user.email);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>🚖 Driver Dashboard</h2>

        {user && (
          <motion.div
            style={styles.profileCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>
              <FaUser /> <strong>Email:</strong> {user.email}
            </p>
            <p>
              <FaStar /> <strong>Elo Rating:</strong>{" "}
              {elo === "N/A" ? (
                <>
                  <span style={{ color: "#888" }}>N/A</span>
                  <button style={styles.initBtn} onClick={initializeElo}>
                    Initialize
                  </button>
                </>
              ) : (
                <span style={{ color: "#00796b", fontWeight: "bold" }}>
                  {elo}
                </span>
              )}
            </p>
          </motion.div>
        )}

        <div style={styles.feedbackSection}>
          <h3 style={styles.subheading}>🛺 Scheduled Ride Requests</h3>
          {rideRequests.length === 0 ? (
            <p style={styles.noData}>No ride requests found.</p>
          ) : (
            <ul style={styles.feedbackList}>
              {rideRequests.map((ride, i) => (
                <motion.li
                  key={i}
                  style={styles.feedbackCard}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <p>
                    <strong>Tourist ID:</strong> {ride.touristId}
                  </p>
                  <p>
                    <strong>Pickup:</strong> {ride.pickup}
                  </p>
                  <p>
                    <strong>Destination:</strong> {ride.destination}
                  </p>
                  <p>
                    <strong>Note:</strong> {ride.note || "None"}
                  </p>
                  <p>
                    <FaClock /> <strong>Time:</strong>{" "}
                    {new Date(ride.scheduledTime).toLocaleString()}
                  </p>
                  <div style={styles.actionButtons}>
                    <button
                      onClick={() => updateRideStatus(ride.id, "Completed")}
                      style={styles.completeBtn}
                    >
                      <FaCheck /> Complete
                    </button>
                    <button
                      onClick={() => updateRideStatus(ride.id, "Rejected")}
                      style={styles.rejectBtn}
                    >
                      <FaTimes /> Reject
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        <div style={styles.feedbackSection}>
          <h3 style={styles.subheading}>📄 Feedback History</h3>
          {feedbacks.length === 0 ? (
            <p style={styles.noData}>No feedback yet.</p>
          ) : (
            <ul style={styles.feedbackList}>
              {feedbacks.map((fb, i) => (
                <motion.li
                  key={i}
                  style={styles.feedbackCard}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
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
                </motion.li>
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
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  heading: {
    fontSize: "2rem",
    textAlign: "center",
    color: "#004d40",
    fontWeight: "700",
    marginBottom: "1.5rem",
  },
  profileCard: {
    backgroundColor: "#e0f2f1",
    padding: "1.5rem",
    borderRadius: "10px",
    marginBottom: "2rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  subheading: {
    fontSize: "1.5rem",
    color: "#00695c",
    marginBottom: "1rem",
  },
  feedbackSection: {
    marginTop: "2.5rem",
  },
  feedbackList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  feedbackCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  },
  initBtn: {
    marginLeft: "10px",
    padding: "6px 12px",
    backgroundColor: "#00796b",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  actionButtons: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },
  completeBtn: {
    backgroundColor: "#2e7d32",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  rejectBtn: {
    backgroundColor: "#c62828",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  noData: {
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
  },
};
