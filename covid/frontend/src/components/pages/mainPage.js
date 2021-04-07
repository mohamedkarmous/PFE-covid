import React, { Component } from "react";
import Navbar from "../layout/Navbar";
import SideBar from "../layout/SideBar";
import Dashboard from "../pages/patient/Dashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Footer from "../layout/Footer";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const MainPage = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  useEffect(() => {
    setDashboard();
  }, [user]);

  const setDashboard = () => {
    if (user.is_admin == true && !loading) {
      return <AdminDashboard />;
    } else if (user.is_doctor == true && !loading) {
      return <Dashboard />;
    } else {
      return null;
    }
  };
  return (
    <div>
      <SideBar />
      {setDashboard()}

      <Footer />
    </div>
  );
};
MainPage.protoTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(MainPage);
