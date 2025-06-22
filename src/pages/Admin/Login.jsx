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
    <div style={styles.container}>
      <h2>Admin Login</h2>
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
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "2rem",
    marginTop: "3rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#1a237e",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "#d32f2f",
    marginTop: "1rem",
    fontWeight: "500",
  },
};
