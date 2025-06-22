import React from "react";
import { Link } from "react-router-dom";
// import "../style.css"; // Optional: For global styles if needed

const Home = () => {
  return (
    <div className="home-container" style={styles.container}>
      <h1 style={styles.heading}>Welcome to TukeRank 🛺</h1>
      <p style={styles.text}>
        A transparent and smart rating system for tuk-tuk drivers — powered by
        sentiment analysis and Elo ranking.
      </p>

      <div style={styles.buttonGroup}>
        <Link to="" style={styles.button}>
          Login
        </Link>
        <Link to="/" style={styles.buttonOutline}>
          Register
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    padding: "2rem",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "linear-gradient(to right, #e0f7fa, #ffffff)",
  },
  heading: {
    fontSize: "3rem",
    marginBottom: "1rem",
    color: "#004d40",
  },
  text: {
    fontSize: "1.2rem",
    color: "#333",
    marginBottom: "2rem",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  button: {
    backgroundColor: "#00796b",
    color: "#fff",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  buttonOutline: {
    border: "2px solid #00796b",
    color: "#00796b",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Home;
