import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function Reviews() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [sentiment, setSentiment] = useState("all");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const snapshot = await getDocs(collection(db, "feedbacks"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeedbacks(data);
      setFiltered(data);
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    let result = [...feedbacks];

    if (sentiment !== "all") {
      result = result.filter((fb) => fb.sentiment === sentiment);
    }

    if (search.trim() !== "") {
      result = result.filter(
        (fb) =>
          fb.review?.toLowerCase().includes(search.toLowerCase()) ||
          fb.driverId?.toLowerCase().includes(search.toLowerCase())
      );
    }

    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFiltered(result);
  }, [sentiment, search, feedbacks]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>📝 All Feedback</h2>

        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Search by review or driver ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />
          <select
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Negative">Negative</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p style={styles.noData}>No feedback found.</p>
        ) : (
          <ul style={styles.list}>
            {filtered.map((fb, index) => (
              <li key={index} style={styles.card}>
                <p>
                  <strong>Driver ID:</strong> {fb.driverId}
                </p>
                <p>
                  <strong>Rating:</strong> {fb.rating} ⭐
                </p>
                <p>
                  <strong>Sentiment:</strong>{" "}
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor:
                        fb.sentiment === "Positive"
                          ? "#a5d6a7"
                          : fb.sentiment === "Negative"
                          ? "#ef9a9a"
                          : "#e0e0e0",
                      color:
                        fb.sentiment === "Positive"
                          ? "#2e7d32"
                          : fb.sentiment === "Negative"
                          ? "#c62828"
                          : "#616161",
                    }}
                  >
                    {fb.sentiment}
                  </span>
                </p>
                <p>
                  <strong>Review:</strong> {fb.review}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {fb.date ? new Date(fb.date).toLocaleString() : "N/A"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #e0f7fa, #ffffff)",
    padding: "2rem",
  },
  container: {
    maxWidth: "900px",
    margin: "auto",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },
  heading: {
    fontSize: "1.8rem",
    color: "#004d40",
    marginBottom: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
  },
  filters: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outlineColor: "#00796b",
    minWidth: "250px",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outlineColor: "#00796b",
    minWidth: "180px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  card: {
    background: "#f9f9f9",
    padding: "1.5rem",
    border: "1px solid #ddd",
    marginBottom: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
    transition: "transform 0.2s",
  },
  badge: {
    fontSize: "0.85rem",
    padding: "2px 8px",
    borderRadius: "12px",
    fontWeight: "600",
    display: "inline-block",
  },
  noData: {
    textAlign: "center",
    fontSize: "1rem",
    color: "#888",
    marginTop: "2rem",
  },
};
