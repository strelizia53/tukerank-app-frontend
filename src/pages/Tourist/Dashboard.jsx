import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const TouristDashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
      } else {
        navigate("/login");
      }
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const driversOnly = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.role === "driver");
      setDrivers(driversOnly);
    };
    fetchDrivers();
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.heading}>
          👋 Welcome{user?.displayName ? `, ${user.displayName}` : ""}!
        </h1>
        <h2 style={styles.subheading}>🚖 Top-Rated Tuk Drivers</h2>

        <div style={styles.driverGrid}>
          {drivers.map((driver) => (
            <div key={driver.id} style={styles.driverCard}>
              <h3 style={styles.driverName}>
                {driver.firstName} {driver.lastName}
              </h3>
              <p style={styles.driverInfo}>
                <strong>Username:</strong> {driver.username}
              </p>
              <p style={styles.driverInfo}>
                <strong>Elo Rating:</strong> {driver.elo || "Unrated"}
              </p>
              <button
                style={styles.button}
                onClick={() => alert("🚧 Ride feature coming soon!")}
              >
                Book Ride
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    background: "linear-gradient(to right, #e0f2f1, #ffffff)",
    minHeight: "100vh",
    padding: "3rem 1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  container: {
    width: "100%",
    maxWidth: "1100px",
  },
  heading: {
    fontSize: "2.2rem",
    color: "#004d40",
    marginBottom: "0.5rem",
    fontWeight: "bold",
  },
  subheading: {
    fontSize: "1.5rem",
    color: "#00796b",
    marginBottom: "2rem",
    fontWeight: "500",
  },
  driverGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "2rem",
  },
  driverCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
    padding: "1.5rem",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  driverName: {
    fontSize: "1.2rem",
    color: "#004d40",
    marginBottom: "0.5rem",
    fontWeight: "600",
  },
  driverInfo: {
    fontSize: "0.95rem",
    color: "#555",
    margin: "0.2rem 0",
  },
  button: {
    marginTop: "1rem",
    padding: "10px 16px",
    backgroundColor: "#00796b",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default TouristDashboard;
