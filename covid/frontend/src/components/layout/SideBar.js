import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import { Link, Redirect } from "react-router-dom";

const SideBar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  if (!isAuthenticated && !loading) {
    return <Redirect to="/login" />;
  }

  var profileImage = "";
  var firstName = "";
  var LastName = "";
  var is_doctor = false;
  var is_admin = false;
  if (user !== null) {
    profileImage = user.account_picture
      .replace("frontend/public", ".")
      .replace("./frontend/public", ".");
    firstName = user.first_name;
    LastName = user.last_name;
    is_doctor = user.is_doctor;
    is_admin = user.is_admin;
  }

  const notActivated = (
    <div>
      <li className="nav-item">
        <Link>
          <a className="nav-link">
            <ion-icon
              name="lock-closed-outline"
              style={{
                fontSize: "20px",
                color: "yellow",
              }}></ion-icon>
            <p style={{ paddingLeft: "10px", color: "yellow" }}>
              <b>Account not active</b>
            </p>
          </a>
        </Link>
      </li>
    </div>
  );
  const doctorLinks = (
    <div>
      <li className="nav-header">
        <ion-icon
          style={{
            fontSize: "20px",
            color: "white",
          }}
          name="medkit"></ion-icon>
        {"   "}
        <b>Doctor routes</b>
      </li>
      <li className="nav-item">
        <Link to="/">
          <a className="nav-link">
            <ion-icon
              name="home-outline"
              style={{
                fontSize: "20px",
                color: "white",
              }}></ion-icon>
            <p style={{ paddingLeft: "10px" }}>Home</p>
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/patient">
          <a className="nav-link">
            <ion-icon
              name="list-outline"
              style={{
                fontSize: "20px",
                color: "white",
              }}></ion-icon>
            <p style={{ paddingLeft: "10px" }}>Patient Table</p>
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/AddPatient">
          <a className="nav-link">
            <ion-icon
              name="add-circle-outline"
              style={{
                fontSize: "20px",
                color: "white",
              }}></ion-icon>
            <p style={{ paddingLeft: "10px" }}>Add Patient</p>
          </a>
        </Link>
      </li>
    </div>
  );

  const adminLinks = (
    <div>
      <li className="nav-header">
        <ion-icon
          style={{
            fontSize: "20px",
            color: "white",
          }}
          name="person"></ion-icon>
        {"  "}
        <b>Admin routes</b>
      </li>
      <li className="nav-item">
        <Link to="/admin">
          <a className="nav-link">
            <ion-icon
              name="bar-chart-outline"
              style={{
                fontSize: "20px",
                color: "white",
              }}></ion-icon>
            <p style={{ paddingLeft: "10px" }}>Admin Dashboard</p>
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/users">
          <a className="nav-link">
            <ion-icon
              name="people-outline"
              style={{
                fontSize: "20px",
                color: "white",
              }}></ion-icon>
            <p style={{ paddingLeft: "10px" }}>Users table</p>
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/addUser">
          <a className="nav-link">
            <ion-icon
              name="person-add-outline"
              style={{
                fontSize: "20px",
                color: "white",
              }}></ion-icon>
            <p style={{ paddingLeft: "10px" }}>Add user</p>
          </a>
        </Link>
      </li>
    </div>
  );

  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="index3.html" className="brand-link">
          <img
            src="dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">COVID 19</span>
        </a>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src={profileImage}
                className="img-circle elevation-2"
                alt="User Image"
              />
            </div>
            <div className="info">
              <a href="#" className="d-block">
                {firstName} {LastName}
              </a>
            </div>
          </div>
          {/* SidebarSearch Form */}
          <div className="form-inline">
            <div className="input-group" data-widget="sidebar-search">
              <input
                className="form-control form-control-sidebar"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw" />
                </button>
              </div>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false">
              {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}

              <li className="nav-header">ROUTES</li>
              {!loading && (is_admin ? adminLinks : null)}
              {!loading && (is_doctor ? doctorLinks : null)}

              {!loading && (!is_admin && !is_doctor ? notActivated : null)}

              <li className="nav-item" onClick={logout}>
                <a className="nav-link">
                  <ion-icon
                    name="log-out-outline"
                    style={{
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                    }}></ion-icon>
                  <p
                    style={{
                      paddingLeft: "10px",
                      cursor: "pointer",
                      color: "red",
                    }}>
                    <b>Logout</b>
                  </p>
                </a>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  );
};

SideBar.protoTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(SideBar);
