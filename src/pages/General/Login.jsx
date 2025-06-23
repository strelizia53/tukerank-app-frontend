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

      rememberMe
        ? localStorage.setItem("rememberedEmail", email)
        : localStorage.removeItem("rememberedEmail");

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
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          Login to <span style={{ color: "#00796b" }}>TukeRank</span>
        </h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
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

          <p onClick={handlePasswordReset} style={styles.link}>
            Forgot Password?
          </p>

          {error && <p style={styles.error}>{error}</p>}
          {message && <p style={styles.success}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #e0f2f1, #ffffff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "12px",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    animation: "fadeIn 0.8s ease-in-out",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
    fontWeight: "bold",
    fontSize: "1.8rem",
    color: "#004d40",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outlineColor: "#00796b",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    color: "#555",
  },
  button: {
    padding: "12px",
    backgroundColor: "#00796b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "background 0.3s",
  },
  error: {
    color: "#d32f2f",
    fontWeight: "500",
    fontSize: "0.95rem",
  },
  success: {
    color: "#388e3c",
    fontWeight: "500",
    fontSize: "0.95rem",
  },
  link: {
    color: "#00796b",
    textAlign: "right",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.9rem",
    textDecoration: "underline",
  },
};

// Inject keyframes animation if not using a CSS file
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

export default Login;
