import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>© {new Date().getFullYear()} TukeRank. All rights reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    textAlign: "center",
    padding: "1rem",
    backgroundColor: "#eeeeee",
    color: "#333",
    marginTop: "3rem",
    position: "relative",
    bottom: 0,
    width: "100%",
  },
};

export default Footer;
