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
    <div style={styles.container}>
      <h2>Welcome, Admin 👑</h2>
      <p>
        Email: <strong>{adminEmail}</strong>
      </p>

      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>
        <div style={styles.card}>
          <h3>Total Drivers</h3>
          <p>{totalDrivers}</p>
        </div>
        <div style={styles.card}>
          <h3>Total Feedbacks</h3>
          <p>{totalFeedbacks}</p>
        </div>
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
  cardContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "2rem",
    gap: "1rem",
    flexWrap: "wrap",
  },
  card: {
    flex: "1",
    backgroundColor: "#e3f2fd",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
};
