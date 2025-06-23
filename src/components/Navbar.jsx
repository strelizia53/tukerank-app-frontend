import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUserCircle,
  FaInfoCircle,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [Username, setUsername] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsername(docSnap.data().username || "");
        }
      } else {
        setUsername("");
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logoContainer}>
        <Link to="/" style={styles.logo}>
          🛺 <span style={{ fontWeight: "600" }}>TukeRank</span>
        </Link>
      </div>

      <div style={styles.navLinks}>
        <Link to="/about" style={styles.link}>
          <FaInfoCircle style={styles.icon} /> About
        </Link>

        {user ? (
          <>
            <span style={styles.userText}>
              <FaUserCircle style={{ marginRight: "5px" }} />
              <strong>
                {Username.charAt(0).toUpperCase() + Username.slice(1)}
              </strong>
            </span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              <FaSignOutAlt style={styles.icon} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.authBtn}>
              <FaSignInAlt style={styles.icon} /> Login
            </Link>
            <Link to="/register" style={styles.registerBtn}>
              <FaUserPlus style={styles.icon} /> Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#004d40",
    color: "#fff",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    fontSize: "1.7rem",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  link: {
    color: "#ffffffcc",
    textDecoration: "none",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    transition: "color 0.3s",
  },
  authBtn: {
    padding: "6px 14px",
    backgroundColor: "#00796b",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    transition: "background 0.3s",
  },
  registerBtn: {
    padding: "6px 14px",
    backgroundColor: "#009688",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    transition: "background 0.3s",
  },
  logoutBtn: {
    padding: "6px 14px",
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    transition: "background 0.3s",
  },
  userText: {
    marginRight: "0.5rem",
    fontSize: "0.95rem",
    color: "#ffffffcc",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    fontSize: "1rem",
  },
};

export default Navbar;
