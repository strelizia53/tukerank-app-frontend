import React from "react";
import { Routes, Route } from "react-router-dom";

// General Pages
import Home from "../pages/General/Home";
import Login from "../pages/General/Login";
import Register from "../pages/General/Register";
// import About from "../pages/General/About";

// Add other routes as you go...

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* <Route path="/about" element={<About />} /> */}
    </Routes>
  );
};

export default AppRoutes;
