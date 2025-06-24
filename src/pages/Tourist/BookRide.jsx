import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookRide = () => {
  const [drivers, setDrivers] = useState([]);
  const [pickupPlace, setPickupPlace] = useState("");
  const [destinationPlace, setDestinationPlace] = useState("");
  const [note, setNote] = useState("");
  const [driverEmail, setDriverEmail] = useState("");
  const [scheduledTime, setScheduledTime] = useState(null);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const pickupRef = useRef(null);
  const destinationRef = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) navigate("/login");
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const driversOnly = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.role === "driver");
      setDrivers(driversOnly);
    };
    fetchDrivers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pickup = pickupRef.current.getPlace()?.formatted_address || "";
    const destination =
      destinationRef.current.getPlace()?.formatted_address || "";

    if (!pickup || !destination || !driverEmail || !scheduledTime) {
      setToast("❌ Please complete all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "rides"), {
        driverEmail,
        pickup,
        destination,
        note,
        scheduledTime,
        touristEmail: auth.currentUser.email,
        createdAt: new Date(),
        status: "Scheduled",
      });

      setToast(
        "✅ Ride booked for " + new Date(scheduledTime).toLocaleString()
      );
      setDriverEmail("");
      setNote("");
      setScheduledTime(null);
    } catch (err) {
      console.error(err);
      setToast("❌ Booking failed. Please try again.");
    }

    setTimeout(() => setToast(""), 4000);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>🚕 Book a Ride</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Select Driver</label>
          <select
            name="driverEmail"
            value={driverEmail}
            onChange={(e) => setDriverEmail(e.target.value)}
            required
            style={styles.input}
          >
            <option value="">-- Choose a Driver --</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.email}>
                {driver.firstName} {driver.lastName} ({driver.email})
              </option>
            ))}
          </select>

          <label style={styles.label}>Pickup Location</label>
          <Autocomplete onLoad={(ref) => (pickupRef.current = ref)}>
            <input
              type="text"
              placeholder="Enter pickup location"
              style={styles.input}
            />
          </Autocomplete>

          <label style={styles.label}>Destination</label>
          <Autocomplete onLoad={(ref) => (destinationRef.current = ref)}>
            <input
              type="text"
              placeholder="Enter destination"
              style={styles.input}
            />
          </Autocomplete>

          <label style={styles.label}>Scheduled Time</label>
          <DatePicker
            selected={scheduledTime}
            onChange={(date) => setScheduledTime(date)}
            showTimeSelect
            dateFormat="Pp"
            placeholderText="Select date & time"
            minDate={new Date()}
            required
            className="date-picker"
            style={styles.input}
          />

          <label style={styles.label}>Note to Driver (Optional)</label>
          <textarea
            name="note"
            placeholder="e.g., I'm carrying heavy luggage"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={styles.textarea}
          ></textarea>

          <button type="submit" style={styles.button}>
            Confirm Booking
          </button>
          {toast && <div style={styles.toast}>{toast}</div>}
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    background: "linear-gradient(to right, #e0f2f1, #ffffff)",
    minHeight: "100vh",
    padding: "3rem 1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    maxWidth: "550px",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    padding: "2rem",
    animation: "fadeIn 0.6s ease-in-out",
  },
  heading: {
    fontSize: "1.8rem",
    color: "#004d40",
    marginBottom: "1.5rem",
    textAlign: "center",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    fontWeight: "500",
    fontSize: "0.95rem",
    color: "#333",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
  },
  textarea: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    resize: "vertical",
  },
  button: {
    padding: "12px",
    backgroundColor: "#00796b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  toast: {
    marginTop: "1rem",
    backgroundColor: "#e0f7fa",
    padding: "10px",
    borderRadius: "6px",
    color: "#00796b",
    textAlign: "center",
    fontWeight: "500",
  },
};

export default BookRide;
