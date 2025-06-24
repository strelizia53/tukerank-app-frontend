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
import { Link } from "react-router-dom";
import { FaChartBar, FaComments } from "react-icons/fa";

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
    const list = [];
    snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
    setRideRequests(list);
  };

  const fetchFeedbacks = async (driverUsername) => {
    const q = query(
      collection(db, "feedbacks"),
      where("driverId", "==", driverUsername)
    );
    const querySnap = await getDocs(q);
    const feedbackList = [];
    querySnap.forEach((doc) => feedbackList.push(doc.data()));
    setFeedbacks(feedbackList);
  };

  const updateRideStatus = async (rideId, newStatus) => {
    const rideRef = doc(db, "rides", rideId);
    await updateDoc(rideRef, { status: newStatus });
    fetchRideRequests(user.email);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>🚖 Driver Dashboard</h2>

        {/* Nav Links */}
        <div style={styles.navLinks}>
          <Link to="/performance" style={styles.navBtn}>
            <FaChartBar style={styles.icon} /> Performance
          </Link>
          <Link to="/feedbackhistory" style={styles.navBtn}>
            <FaComments style={styles.icon} /> Feedback History
          </Link>
        </div>

        {/* Profile Card */}
        {user && (
          <div style={styles.profileCard}>
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

        {/* Ride Requests */}
        <div style={styles.feedbackSection}>
          <h3 style={styles.subheading}>🛺 Ride Requests</h3>
          {rideRequests.length === 0 ? (
            <p style={styles.noData}>No ride requests.</p>
          ) : (
            <ul style={styles.feedbackList}>
              {rideRequests.map((ride, i) => (
                <li key={i} style={styles.feedbackCard}>
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
                    <strong>Status:</strong> {ride.status}
                  </p>
                  <p>
                    <strong>Note:</strong> {ride.note || "None"}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(ride.scheduledTime).toLocaleString()}
                  </p>
                  <button
                    onClick={() => updateRideStatus(ride.id, "Completed")}
                    style={styles.actionBtn}
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => updateRideStatus(ride.id, "Rejected")}
                    style={{ ...styles.actionBtn, backgroundColor: "#c62828" }}
                  >
                    Reject
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Feedback History Inline */}
        <div style={styles.feedbackSection}>
          <h3 style={styles.subheading}>📄 Ride Feedback History</h3>
          {feedbacks.length === 0 ? (
            <p style={styles.noData}>No feedback yet.</p>
          ) : (
            <ul style={styles.feedbackList}>
              {feedbacks.map((fb, i) => (
                <li key={i} style={styles.feedbackCard}>
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
    marginBottom: "1.2rem",
    fontWeight: "bold",
    textAlign: "center",
  },
  navLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "1.5rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  navBtn: {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#004d40",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "0.3s",
  },
  icon: {
    fontSize: "1.1rem",
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
    marginTop: "2rem",
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
  actionBtn: {
    marginTop: "10px",
    backgroundColor: "#00796b",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "0.5rem",
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
