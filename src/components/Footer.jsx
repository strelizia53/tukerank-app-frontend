import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.left}>
          <p style={styles.copyText}>
            © {new Date().getFullYear()} <strong>TukeRank</strong>. All rights
            reserved.
          </p>
        </div>

        <div style={styles.right}>
          <Link to="/privacy" style={styles.link}>
            Privacy Policy
          </Link>
          <span style={styles.separator}>|</span>
          <Link to="/terms" style={styles.link}>
            Terms of Service
          </Link>
          <span style={styles.separator}>|</span>
          <Link to="/contact" style={styles.link}>
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#004d40",
    color: "#ffffffcc",
    padding: "1.2rem 2rem",
    fontSize: "0.9rem",
    width: "100%",
    boxSizing: "border-box",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  left: {
    marginBottom: "0.5rem",
    flex: 1,
    minWidth: "250px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    flex: 1,
    minWidth: "250px",
  },
  link: {
    color: "#ffffffcc",
    textDecoration: "none",
    transition: "color 0.3s",
  },
  separator: {
    color: "#ffffff66",
  },
  copyText: {
    margin: 0,
  },
};

export default Footer;
