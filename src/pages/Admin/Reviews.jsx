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
          fb.review.toLowerCase().includes(search.toLowerCase()) ||
          fb.driverId.toLowerCase().includes(search.toLowerCase())
      );
    }

    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    setFiltered(result);
  }, [sentiment, search, feedbacks]);

  return (
    <div style={styles.container}>
      <h2>All Feedback</h2>

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
        <p>No feedback found.</p>
      ) : (
        <ul>
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
                    color:
                      fb.sentiment === "Positive"
                        ? "green"
                        : fb.sentiment === "Negative"
                        ? "red"
                        : "#999",
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
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "2rem",
  },
  filters: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  card: {
    background: "#fff",
    padding: "1rem",
    border: "1px solid #ddd",
    marginBottom: "1rem",
    borderRadius: "6px",
  },
};
