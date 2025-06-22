import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFirstName(docSnap.data().firstName || "");
        }
      } else {
        setFirstName("");
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
      <div style={styles.logo}>
        <Link to="/" style={styles.link}>
          TukeRank 🛺
        </Link>
      </div>
      <div style={styles.navLinks}>
        <Link to="/about" style={styles.link}>
          About
        </Link>

        {user ? (
          <>
            <span style={styles.userText}>Welcome, {firstName}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/register" style={styles.link}>
              Register
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
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "500",
  },
  logoutBtn: {
    background: "transparent",
    color: "#fff",
    border: "1px solid #fff",
    borderRadius: "5px",
    padding: "5px 10px",
    cursor: "pointer",
  },
  userText: {
    fontWeight: "500",
    marginRight: "1rem",
  },
};

export default Navbar;
