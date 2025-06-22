import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Autocomplete } from "@react-google-maps/api";
import DatePicker from "react-datepicker";

const BookRide = () => {
  const [drivers, setDrivers] = useState([]);
  const [pickupPlace, setPickupPlace] = useState("");
  const [destinationPlace, setDestinationPlace] = useState("");
  const [note, setNote] = useState("");
  const [driverId, setDriverId] = useState("");
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

    if (!pickup || !destination || !driverId || !scheduledTime) {
      setToast("❌ Please complete all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "rides"), {
        driverId,
        pickup,
        destination,
        note,
        scheduledTime,
        touristId: auth.currentUser.uid,
        createdAt: new Date(),
        status: "Scheduled",
      });

      setToast(
        "✅ Ride booked for " + new Date(scheduledTime).toLocaleString()
      );
      setDriverId("");
      setNote("");
      setScheduledTime(null);
    } catch (err) {
      console.error(err);
      setToast("❌ Booking failed. Please try again.");
    }

    setTimeout(() => setToast(""), 4000);
  };

  return (
    <div style={styles.container}>
      <h2>Book a Ride</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <select
          name="driverId"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">Select a Driver</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.firstName} {driver.lastName} ({driver.username})
            </option>
          ))}
        </select>

        <Autocomplete onLoad={(ref) => (pickupRef.current = ref)}>
          <input
            type="text"
            placeholder="Pickup Location"
            style={styles.input}
          />
        </Autocomplete>

        <Autocomplete onLoad={(ref) => (destinationRef.current = ref)}>
          <input type="text" placeholder="Destination" style={styles.input} />
        </Autocomplete>

        <DatePicker
          selected={scheduledTime}
          onChange={(date) => setScheduledTime(date)}
          showTimeSelect
          dateFormat="Pp"
          placeholderText="Select Date & Time"
          minDate={new Date()}
          required
          style={styles.input}
          className="date-picker"
        />

        <textarea
          name="note"
          placeholder="Optional Note to Driver"
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
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "auto",
    padding: "2rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    marginTop: "3rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
  },
  textarea: {
    minHeight: "80px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#00796b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
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
