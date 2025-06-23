import React from "react";

const About = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>About TukeRank 🛺</h1>

      <p style={styles.paragraph}>
        <strong>TukeRank</strong> is a transparent and intelligent ride rating
        system designed to enhance trust and safety in the tuk-tuk
        transportation industry. It blends powerful technologies like{" "}
        <strong>Sentiment Analysis</strong> and an{" "}
        <strong>Elo-based rating system</strong> to provide a reliable,
        data-driven reputation for drivers—making tourism smarter and fairer.
      </p>

      <h2 style={styles.subheading}>🧠 How It Works</h2>
      <ul style={styles.list}>
        <li>
          <strong>Sentiment Analysis:</strong> After every ride, tourists leave
          feedback through text or star ratings. Our NLP engine detects tone,
          keywords, and emotional intent to score feedback more meaningfully.
        </li>
        <li>
          <strong>Elo Rating System:</strong> Drivers gain or lose ranking
          points based on the quality and sentiment of reviews—similar to
          competitive games like chess.
        </li>
        <li>
          <strong>Live Dashboards:</strong> Tourists can explore driver profiles
          and ranks, while drivers get insight into their growth, reviews, and
          performance metrics.
        </li>
      </ul>

      <h2 style={styles.subheading}>🎯 Why Choose TukeRank?</h2>
      <ul style={styles.list}>
        <li>✅ Builds mutual trust between tourists and tuk-tuk drivers</li>
        <li>✅ Rewards good service and discourages bad behavior</li>
        <li>✅ Reduces bias by using AI to interpret reviews</li>
        <li>✅ Encourages healthy competition through transparent rankings</li>
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "2rem 1.5rem",
    color: "#333",
    lineHeight: "1.7",
    backgroundColor: "#f9fdfc",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  heading: {
    fontSize: "2.4rem",
    color: "#004d40",
    marginBottom: "1rem",
    textAlign: "center",
  },
  subheading: {
    fontSize: "1.6rem",
    color: "#00796b",
    marginTop: "2rem",
    marginBottom: "0.75rem",
  },
  paragraph: {
    fontSize: "1.1rem",
    marginBottom: "1.5rem",
  },
  list: {
    fontSize: "1.05rem",
    paddingLeft: "1.5rem",
    listStyle: "disc",
  },
};

export default About;
