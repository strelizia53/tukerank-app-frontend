import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
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
        const userRef = collection(db, "users", user.uid, "eloHistory");
        const q = query(userRef, orderBy("date"));
        const snap = await getDocs(q);

        const data = snap.docs.map((doc) => {
          const d = doc.data();
          return {
            elo: d.elo,
            date: new Date(d.date.seconds * 1000).toLocaleDateString(),
          };
        });

        setEloData(data);
        // Optional: Set username
        const userDoc = await getDocs(collection(db, "users"));
        userDoc.forEach((docSnap) => {
          if (docSnap.id === user.uid) {
            setUsername(docSnap.data().username || "");
          }
        });
      }
    });

    return () => unsub();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Performance Overview {username && `– ${username}`}</h2>
      {eloData.length === 0 ? (
        <p>No Elo history yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={eloData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "auto",
    padding: "2rem",
  },
};

export default Performance;
