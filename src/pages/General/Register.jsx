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
      // 1. Check for unique username
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setLoading(false);
        return setError("Username is already taken. Please choose another.");
      }

      // 2. Register with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // 3. Store user details in Firestore
      await setDoc(doc(db, "users", uid), {
        email,
        username,
        firstName,
        lastName,
        role,
        createdAt: new Date(),
      });

      // 4. Redirect based on role
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
    <div style={styles.container}>
      <h2>Register</h2>
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
        <div style={{ textAlign: "left", marginBottom: "-0.5rem" }}>
          <small>
            Password Strength: {getPasswordStrengthLabel(passwordScore)}
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
        <label style={{ textAlign: "left" }}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((prev) => !prev)}
          />{" "}
          Show Password
        </label>
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
  );
};

const styles = {
  container: {
    maxWidth: "450px",
    margin: "auto",
    padding: "2rem",
    marginTop: "3rem",
    backgroundColor: "#f5f5f5",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
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
};

export default Register;
