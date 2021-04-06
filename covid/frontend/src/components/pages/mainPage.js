import React, { Component } from "react";
import Navbar from "../layout/Navbar";
import SideBar from "../layout/SideBar";
import Dashboard from "../pages/patient/Dashboard";
import Footer from "../layout/Footer";

const mainPage = () => {
  return (
    <div>
      <Navbar />
      <SideBar />
      <Dashboard />
      <Footer />
    </div>
  );
};
export default mainPage;
