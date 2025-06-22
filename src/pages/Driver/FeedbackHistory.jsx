import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function FeedbackHistory() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    rating: "All",
    sentiment: "All",
    search: "",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const feedbackRef = collection(db, "feedbacks");
        const q = query(feedbackRef, where("driverId", "==", user.uid));
        const querySnap = await getDocs(q);
        const results = [];
        querySnap.forEach((doc) => results.push(doc.data()));
        results.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFeedbacks(results);
        setFiltered(results);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    filterResults();
  }, [filters]);

  const filterResults = () => {
    let temp = [...feedbacks];

    if (filters.rating !== "All") {
      temp = temp.filter((fb) => String(fb.rating) === filters.rating);
    }

    if (filters.sentiment !== "All") {
      temp = temp.filter((fb) => fb.sentiment === filters.sentiment);
    }

    if (filters.search.trim()) {
      temp = temp.filter((fb) =>
        fb.review?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFiltered(temp);
  };

  return (
    <div style={styles.container}>
      <h2>Feedback History</h2>

      <div style={styles.filters}>
        <select
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          style={styles.select}
        >
          <option value="All">All Ratings</option>
          {[5, 4, 3, 2, 1].map((num) => (
            <option key={num} value={String(num)}>
              {num} Stars
            </option>
          ))}
        </select>

        <select
          value={filters.sentiment}
          onChange={(e) =>
            setFilters({ ...filters, sentiment: e.target.value })
          }
          style={styles.select}
        >
          <option value="All">All Sentiments</option>
          <option value="Positive">Positive</option>
          <option value="Neutral">Neutral</option>
          <option value="Negative">Negative</option>
        </select>

        <input
          type="text"
          placeholder="Search review..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={styles.input}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No matching feedbacks found.</p>
      ) : (
        <div style={styles.list}>
          {filtered.map((fb, index) => (
            <div key={index} style={styles.card}>
              <p>
                <strong>Date:</strong> {fb.date || "N/A"}
              </p>
              <p>
                <strong>Rating:</strong> {fb.rating} ⭐
              </p>
              <p>
                <strong>Sentiment:</strong> {fb.sentiment}
              </p>
              <p>
                <strong>Review:</strong> {fb.review}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
    flexWrap: "wrap",
  },
  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  input: {
    padding: "8px",
    flex: 1,
    minWidth: "200px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  card: {
    backgroundColor: "#f1f8e9",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
};
