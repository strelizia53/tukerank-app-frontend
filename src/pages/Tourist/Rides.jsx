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
        const q = query(ridesRef, where("touristEmail", "==", user.email));
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
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>🛺 Your Ride History</h2>

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
          <p style={styles.noRides}>No rides match your criteria.</p>
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
                  {new Date(
                    ride.scheduledTime?.seconds * 1000
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color:
                        ride.status === "Completed"
                          ? "#2e7d32"
                          : ride.status === "Cancelled"
                          ? "#c62828"
                          : "#f57c00",
                    }}
                  >
                    {ride.status}
                  </span>
                </p>

                {/* Cancel button */}
                {ride.status === "Scheduled" && (
                  <button
                    onClick={() => cancelRide(ride.id)}
                    style={styles.buttonCancel}
                  >
                    Cancel Ride
                  </button>
                )}

                {/* Feedback button */}
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
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #e0f2f1, #ffffff)",
    padding: "3rem 1rem",
  },
  container: {
    maxWidth: "1000px",
    margin: "auto",
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },
  heading: {
    textAlign: "center",
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#004d40",
    marginBottom: "2rem",
  },
  filters: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "2rem",
    justifyContent: "center",
  },
  select: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minWidth: "160px",
  },
  noRides: {
    textAlign: "center",
    fontSize: "1rem",
    color: "#666",
    marginTop: "2rem",
  },
  rideList: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
  },
  rideCard: {
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    padding: "1.2rem",
    backgroundColor: "#fefefe",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  buttonCancel: {
    marginTop: "10px",
    backgroundColor: "#c62828",
    color: "#fff",
    padding: "10px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  buttonFeedback: {
    marginTop: "10px",
    backgroundColor: "#00796b",
    color: "#fff",
    padding: "10px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Rides;
