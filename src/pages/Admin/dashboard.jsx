import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [adminEmail, setAdminEmail] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return navigate("/admin/login");
      setAdminEmail(user.email);
      await fetchAdminStats();
    });

    return () => unsub();
  }, []);

  const fetchAdminStats = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const driversSnapshot = await getDocs(
      query(collection(db, "users"), where("role", "==", "driver"))
    );
    const feedbacksSnapshot = await getDocs(collection(db, "feedbacks"));

    setTotalUsers(usersSnapshot.size);
    setTotalDrivers(driversSnapshot.size);
    setTotalFeedbacks(feedbacksSnapshot.size);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Welcome, Admin 👑</h2>
        <p style={styles.subtext}>
          Logged in as: <strong>{adminEmail}</strong>
        </p>

        <div style={styles.cardContainer}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Total Users</h3>
            <p style={styles.cardValue}>{totalUsers}</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Total Drivers</h3>
            <p style={styles.cardValue}>{totalDrivers}</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Total Feedbacks</h3>
            <p style={styles.cardValue}>{totalFeedbacks}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #e0f7fa, #ffffff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  container: {
    maxWidth: "900px",
    width: "100%",
    backgroundColor: "#ffffff",
    padding: "2.5rem",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },
  heading: {
    fontSize: "2rem",
    color: "#004d40",
    marginBottom: "0.5rem",
    textAlign: "center",
    fontWeight: "bold",
  },
  subtext: {
    fontSize: "1rem",
    color: "#555",
    textAlign: "center",
    marginBottom: "2rem",
  },
  cardContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1.5rem",
    flexWrap: "wrap",
  },
  card: {
    flex: "1 1 250px",
    backgroundColor: "#e3f2fd",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    textAlign: "center",
    transition: "transform 0.3s",
  },
  cardTitle: {
    fontSize: "1.2rem",
    color: "#00796b",
    marginBottom: "0.5rem",
  },
  cardValue: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#004d40",
  },
};
