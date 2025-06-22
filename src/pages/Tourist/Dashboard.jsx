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
      const driversRef = collection(db, "users");
      const snapshot = await getDocs(driversRef);
      const driversOnly = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.role === "driver");

      setDrivers(driversOnly);
    };

    fetchDrivers();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Your Dashboard</h1>
      <h2 style={styles.subheading}>Top-Rated Drivers</h2>
      <div style={styles.driverGrid}>
        {drivers.map((driver) => (
          <div key={driver.id} style={styles.driverCard}>
            <h3>
              {driver.firstName} {driver.lastName}
            </h3>
            <p>Username: {driver.username}</p>
            <p>Elo Rating: {driver.elo || "Unrated"}</p>
            <button
              style={styles.button}
              onClick={() => alert("Ride feature coming soon!")}
            >
              Book Ride
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "1000px",
    margin: "auto",
  },
  heading: {
    fontSize: "2rem",
    color: "#004d40",
    marginBottom: "1rem",
  },
  subheading: {
    fontSize: "1.25rem",
    color: "#00796b",
    marginBottom: "1rem",
  },
  driverGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  driverCard: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 0 6px rgba(0,0,0,0.1)",
  },
  button: {
    marginTop: "1rem",
    padding: "8px 12px",
    backgroundColor: "#00796b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default TouristDashboard;
