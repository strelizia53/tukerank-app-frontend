import React from "react";
import { Routes, Route } from "react-router-dom";

// General Pages
import Home from "../pages/General/Home";
import Login from "../pages/General/Login";
import Register from "../pages/General/Register";
import About from "../pages/General/About";

//tourist stuff
import TouristDashboard from "../pages/Tourist/Dashboard";
import BookRide from "../pages/Tourist/BookRide";
import Rides from "../pages/Tourist/Rides";
import Feedback from "../pages/Tourist/Feedback";

// Add other routes as you go...

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/dashboard/tourist" element={<TouristDashboard />} />
      <Route path="/book" element={<BookRide />} />
      <Route path="/rides" element={<Rides />} />
      <Route path="/feedback/:rideId" element={<Feedback />} />
    </Routes>
  );
};

export default AppRoutes;
