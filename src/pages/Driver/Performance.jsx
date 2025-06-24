import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Performance = () => {
  const [eloData, setEloData] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Step 1: Get username
        const userSnapshot = await getDocs(collection(db, "users"));
        let currentUsername = "";

        userSnapshot.forEach((docSnap) => {
          if (docSnap.id === user.uid) {
            currentUsername = docSnap.data().username || "";
            setUsername(currentUsername);
          }
        });

        if (!currentUsername) return;

        // Step 2: Query feedbacks by driverId (username)
        const feedbackQuery = query(
          collection(db, "feedbacks"),
          where("driverId", "==", currentUsername)
        );
        const feedbackSnap = await getDocs(feedbackQuery);

        const feedbackData = feedbackSnap.docs.map((doc, i) => {
          const d = doc.data();
          return {
            elo: d.eloChange || 0,
            date: `Feedback ${i + 1}`, // Since there's no timestamp
          };
        });

        setEloData(feedbackData);
      }
    });

    return () => unsub();
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>
          📈 Performance Overview {username && `– ${username}`}
        </h2>

        {eloData.length === 0 ? (
          <p style={styles.status}>No Elo history available yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={eloData}
              margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="elo"
                stroke="#00796b"
                strokeWidth={3}
                dot={{ r: 5, stroke: "#004d40", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #e0f2f1, #ffffff)",
    padding: "2rem",
  },
  container: {
    maxWidth: "1000px",
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
  status: {
    textAlign: "center",
    color: "#888",
    fontSize: "1.1rem",
    paddingTop: "2rem",
  },
};

export default Performance;
