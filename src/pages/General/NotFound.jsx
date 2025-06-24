import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <FaExclamationTriangle size={60} color="#c62828" />
        <h1 style={styles.heading}>404 - Page Not Found</h1>
        <p style={styles.message}>
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <Link to="/" style={styles.homeButton}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #fce4ec, #ffffff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  card: {
    textAlign: "center",
    backgroundColor: "#fff",
    padding: "3rem",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    fontSize: "2rem",
    margin: "1rem 0 0.5rem",
    color: "#c62828",
  },
  message: {
    fontSize: "1.1rem",
    color: "#666",
    marginBottom: "1.5rem",
  },
  homeButton: {
    backgroundColor: "#c62828",
    color: "#fff",
    padding: "0.75rem 1.5rem",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "bold",
  },
};
