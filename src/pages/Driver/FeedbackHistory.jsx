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
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>📊 Feedback History</h2>

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
          <p style={styles.status}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={styles.status}>No matching feedbacks found.</p>
        ) : (
          <div style={styles.list}>
            {filtered.map((fb, index) => (
              <div key={index} style={styles.card}>
                <p>
                  <strong>Date:</strong>{" "}
                  {fb.date ? new Date(fb.date).toLocaleString() : "N/A"}
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
                          ? "#2e7d32"
                          : fb.sentiment === "Negative"
                          ? "#c62828"
                          : "#616161",
                      fontWeight: "bold",
                    }}
                  >
                    {fb.sentiment}
                  </span>
                </p>
                <p>
                  <strong>Review:</strong> {fb.review}
                </p>
              </div>
            ))}
          </div>
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
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
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
  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    minWidth: "160px",
    outlineColor: "#00796b",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    flex: "1",
    minWidth: "200px",
    fontSize: "1rem",
    outlineColor: "#00796b",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  card: {
    backgroundColor: "#f1f8e9",
    padding: "1.2rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
  },
  status: {
    textAlign: "center",
    color: "#888",
    fontSize: "1rem",
  },
};
