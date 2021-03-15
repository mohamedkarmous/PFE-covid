import React, { Component } from "react";
import Navbar from "../layout/Navbar";
import SideBar from "../layout/SideBar";
import addPatient from "./addPatient";
import Dashboard from "../layout/Dashboard";
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
