import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(
    localStorage.getItem("rememberedEmail") || ""
  );
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(
    !!localStorage.getItem("rememberedEmail")
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Auto redirect if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          const role = docSnap.data().role;
          navigate(
            role === "tourist" ? "/dashboard/tourist" : "/dashboard/driver"
          );
        }
      }
    });
    return () => unsub();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          navigate(
            role === "tourist" ? "/dashboard/tourist" : "/dashboard/driver"
          );
        }, 1000);
      } else {
        setError("User record not found.");
      }
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) return setError("Please enter your email to reset password.");
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Reset link sent! Check your inbox.");
    } catch (err) {
      setError("Failed to send reset email.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <div style={styles.row}>
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
            />{" "}
            Show Password
          </label>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe((prev) => !prev)}
            />{" "}
            Remember Me
          </label>
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          onClick={handlePasswordReset}
          style={{ ...styles.link, textAlign: "right" }}
        >
          Forgot Password?
        </p>

        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "2rem",
    marginTop: "4rem",
    backgroundColor: "#f5f5f5",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    color: "#444",
  },
  button: {
    padding: "10px",
    backgroundColor: "#00796b",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  success: {
    color: "green",
    marginTop: "10px",
  },
  link: {
    color: "#00796b",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.9rem",
    marginTop: "-10px",
  },
};

export default Login;
