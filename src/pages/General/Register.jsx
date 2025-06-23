import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    firstName: "",
    lastName: "",
    role: "tourist",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      const result = zxcvbn(value);
      setPasswordScore(result.score);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const {
      email,
      password,
      confirmPassword,
      username,
      firstName,
      lastName,
      role,
    } = formData;

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    setError("");

    try {
      // Check unique username
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setLoading(false);
        return setError("Username is already taken. Please choose another.");
      }

      // Register
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        email,
        username,
        firstName,
        lastName,
        role,
        createdAt: new Date(),
      });

      // Redirect
      navigate(role === "tourist" ? "/dashboard/tourist" : "/dashboard/driver");
    } catch (err) {
      let friendlyMessage = "Something went wrong.";
      if (err.code === "auth/email-already-in-use")
        friendlyMessage = "Email already registered.";
      if (err.code === "auth/weak-password")
        friendlyMessage = "Password is too weak.";
      if (err.code === "auth/invalid-email")
        friendlyMessage = "Invalid email format.";
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthLabel = (score) => {
    switch (score) {
      case 0:
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          Create Your <span style={{ color: "#00796b" }}>TukeRank</span> Account
        </h2>

        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="username"
            placeholder="Username (must be unique)"
            value={formData.username}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <div style={styles.strength}>
            <small>
              Password Strength:{" "}
              <strong>{getPasswordStrengthLabel(passwordScore)}</strong>
            </small>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
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
          </div>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="tourist">Tourist</option>
            <option value="driver">Driver</option>
          </select>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #e0f7fa, #ffffff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "2.5rem",
    borderRadius: "12px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    animation: "fadeIn 0.8s ease-in-out",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.8rem",
    fontWeight: "bold",
    fontSize: "1.9rem",
    color: "#004d40",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.1rem",
  },
  input: {
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outlineColor: "#00796b",
  },
  strength: {
    textAlign: "left",
    marginTop: "-10px",
    marginBottom: "-5px",
    fontSize: "0.9rem",
    color: "#555",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    color: "#444",
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
    marginTop: "10px",
  },
};

export default Register;
