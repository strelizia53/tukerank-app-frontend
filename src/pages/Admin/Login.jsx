import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.endsWith("@admin.com")) {
      return setErrorMsg("❌ Only @admin.com emails are allowed.");
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) {
        return setErrorMsg("❌ No user record found.");
      }

      const userData = userDoc.data();
      if (userData.role !== "admin") {
        return setErrorMsg("❌ You are not authorized as an admin.");
      }

      navigate("/admin/dashboard");
    } catch (error) {
      setErrorMsg("❌ Invalid email or password.");
      console.error("Admin login error:", error);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login 🔐</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
          {errorMsg && <p style={styles.error}>{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #e8eaf6, #ffffff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "2.5rem",
    borderRadius: "12px",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    animation: "fadeIn 0.8s ease-in-out",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.8rem",
    fontWeight: "bold",
    fontSize: "1.8rem",
    color: "#1a237e",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  input: {
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outlineColor: "#3949ab",
  },
  button: {
    padding: "12px",
    backgroundColor: "#1a237e",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background 0.3s",
  },
  error: {
    color: "#d32f2f",
    marginTop: "1rem",
    fontWeight: "500",
    fontSize: "0.95rem",
    textAlign: "center",
  },
};
