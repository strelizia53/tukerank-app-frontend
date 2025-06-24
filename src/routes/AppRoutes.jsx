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

//driver stuff
import DriverDashboard from "../pages/Driver/Dashboard";
import Performance from "../pages/Driver/Performance";
import FeedbackHistory from "../pages/Driver/FeedbackHistory";

//admin stuff
import AdminLogin from "../pages/Admin/Login";
import AdminDashboard from "../pages/Admin/dashboard";
import Reviews from "../pages/Admin/Reviews";

// Add other routes as you go...

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />

      {/* Tourist Routes */}
      <Route path="/dashboard/tourist" element={<TouristDashboard />} />
      <Route path="/book" element={<BookRide />} />
      <Route path="/rides" element={<Rides />} />
      <Route path="/feedback/:rideId" element={<Feedback />} />

      {/* Driver Routes */}
      <Route path="/dashboard/driver" element={<DriverDashboard />} />
      <Route path="/performance" element={<Performance />} />
      <Route path="/feedbackhistory" element={<FeedbackHistory />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/reviews" element={<Reviews />} />
    </Routes>
  );
};

export default AppRoutes;
