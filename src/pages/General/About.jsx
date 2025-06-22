import React from "react";

const About = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>About TukeRank</h1>

      <p style={styles.paragraph}>
        <strong>TukeRank</strong> is a smart ride rating system designed to
        bring transparency, trust, and safety to tuk-tuk transportation. By
        combining advanced technologies like <strong>Sentiment Analysis</strong>{" "}
        and a dynamic <strong>Elo-based ranking system</strong>, we ensure both
        tourists and drivers experience fair and reliable interactions.
      </p>

      <h2 style={styles.subheading}>🧠 How It Works</h2>
      <ul style={styles.list}>
        <li>
          <strong>Sentiment Analysis</strong>: After each ride, tourists can
          submit feedback through text or star ratings. Our system analyzes the
          sentiment behind each review using Natural Language Processing (NLP).
        </li>
        <li>
          <strong>Elo Rating Algorithm</strong>: Drivers receive a live ranking
          score similar to chess ratings. It adjusts fairly based on review tone
          and rating patterns.
        </li>
        <li>
          <strong>Dashboard Insights</strong>: Tourists can view driver
          performance; drivers can see their own improvement trends.
        </li>
      </ul>

      <h2 style={styles.subheading}>🎯 Why TukeRank?</h2>
      <ul style={styles.list}>
        <li>✅ Builds trust between tourists and local drivers</li>
        <li>✅ Reduces bias and manual errors in feedback</li>
        <li>✅ Encourages good service with fair competition</li>
        <li>✅ Promotes smarter tourism experiences</li>
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "2rem",
    lineHeight: "1.8",
    color: "#333",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#004d40",
    marginBottom: "1rem",
    textAlign: "center",
  },
  subheading: {
    fontSize: "1.5rem",
    color: "#00796b",
    marginTop: "2rem",
    marginBottom: "0.75rem",
  },
  paragraph: {
    fontSize: "1.1rem",
    marginBottom: "1.5rem",
  },
  list: {
    listStyleType: "disc",
    paddingLeft: "1.5rem",
    fontSize: "1.05rem",
  },
};

export default About;
