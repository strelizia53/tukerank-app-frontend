import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Rides = () => {
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const ridesRef = collection(db, "rides");
        const q = query(ridesRef, where("touristId", "==", user.uid));
        const snapshot = await getDocs(q);

        const rideList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRides(rideList);
      } else {
        navigate("/login");
      }
    });

    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    let filtered = [...rides];

    if (statusFilter !== "All") {
      filtered = filtered.filter((ride) => ride.status === statusFilter);
    }

    if (selectedDate) {
      const selected = new Date(selectedDate).toDateString();
      filtered = filtered.filter((ride) => {
        const rideDate = new Date(
          ride.scheduledTime?.seconds * 1000
        ).toDateString();
        return rideDate === selected;
      });
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.scheduledTime?.seconds * 1000);
      const dateB = new Date(b.scheduledTime?.seconds * 1000);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredRides(filtered);
  }, [rides, statusFilter, sortOrder, selectedDate]);

  const cancelRide = async (rideId) => {
    try {
      await updateDoc(doc(db, "rides", rideId), {
        status: "Cancelled",
      });
      setRides((prev) =>
        prev.map((ride) =>
          ride.id === rideId ? { ...ride, status: "Cancelled" } : ride
        )
      );
    } catch (err) {
      alert("Failed to cancel ride.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Your Rides</h2>

      {/* Filters */}
      <div style={styles.filters}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="All">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={styles.select}
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={styles.select}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {filteredRides.length === 0 ? (
        <p>No rides match your criteria.</p>
      ) : (
        <div style={styles.rideList}>
          {filteredRides.map((ride) => (
            <div key={ride.id} style={styles.rideCard}>
              <p>
                <strong>Pickup:</strong> {ride.pickup}
              </p>
              <p>
                <strong>Destination:</strong> {ride.destination}
              </p>
              <p>
                <strong>Scheduled:</strong>{" "}
                {new Date(ride.scheduledTime?.seconds * 1000).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {ride.status}
              </p>

              {/* Cancel ride if still scheduled */}
              {ride.status === "Scheduled" && (
                <button
                  onClick={() => cancelRide(ride.id)}
                  style={styles.buttonCancel}
                >
                  Cancel Ride
                </button>
              )}

              {/* Feedback link if completed and no feedback yet */}
              {ride.status === "Completed" && !ride.feedback && (
                <button
                  onClick={() => navigate(`/feedback/${ride.id}`)}
                  style={styles.buttonFeedback}
                >
                  Give Feedback
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "auto",
    padding: "2rem",
  },
  filters: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1rem",
  },
  select: {
    padding: "8px",
    fontSize: "1rem",
  },
  rideList: {
    display: "grid",
    gap: "1rem",
  },
  rideCard: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 0 6px rgba(0,0,0,0.05)",
  },
  buttonCancel: {
    marginTop: "10px",
    backgroundColor: "#c62828",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonFeedback: {
    marginTop: "10px",
    backgroundColor: "#00796b",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Rides;
