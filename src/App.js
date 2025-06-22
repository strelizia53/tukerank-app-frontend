import React from "react";
import { BrowserRouter } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "react-datepicker/dist/react-datepicker.css";
// import "./style.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <LoadScript
        googleMapsApiKey="AIzaSyAuSrqCjQezJOb8gpmEWi0E3Sc9UCSCrb0"
        libraries={["places"]}
      >
        <AppRoutes />
      </LoadScript>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
