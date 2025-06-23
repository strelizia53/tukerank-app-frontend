import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <div style={styles.content}>
          <h1 style={styles.heading}>Welcome to TukeRank 🛺</h1>
          <p style={styles.subtitle}>
            Fair, smart, and transparent ratings for tuk-tuk drivers — powered
            by AI sentiment analysis and Elo-based ranking.
          </p>

          <div style={styles.buttonGroup}>
            <Link to="/login" style={{ ...styles.button, ...styles.fadeIn }}>
              Login
            </Link>
            <Link
              to="/register"
              style={{ ...styles.buttonOutline, ...styles.fadeIn }}
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const backgroundImage =
  "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg";

const styles = {
  container: {
    height: "100vh",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(0, 77, 64, 0.7)", // dark green transparent overlay
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  content: {
    maxWidth: "750px",
    width: "100%",
    padding: "2rem",
    borderRadius: "12px",
    color: "#fff",
    textAlign: "center",
    animation: "fadeIn 1s ease-in-out",
  },
  heading: {
    fontSize: "3rem",
    marginBottom: "1rem",
    fontWeight: "700",
    animation: "slideUp 0.8s ease",
  },
  subtitle: {
    fontSize: "1.3rem",
    lineHeight: "1.6",
    marginBottom: "2rem",
    color: "#e0f2f1",
    animation: "slideUp 1s ease",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  button: {
    backgroundColor: "#26a69a",
    color: "#fff",
    padding: "0.75rem 1.8rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "1rem",
    transition: "all 0.3s ease",
  },
  buttonOutline: {
    border: "2px solid #26a69a",
    color: "#26a69a",
    padding: "0.75rem 1.8rem",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "1rem",
    backgroundColor: "transparent",
    transition: "all 0.3s ease",
  },
  fadeIn: {
    animation: "fadeIn 1.4s ease-in-out",
  },
};

// Injecting keyframe styles globally
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,
  styleSheet.cssRules.length
);
styleSheet.insertRule(
  `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
`,
  styleSheet.cssRules.length
);

export default Home;
