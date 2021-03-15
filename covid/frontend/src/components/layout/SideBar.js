import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";

const SideBar = ({ auth: { isAuthenticated, loading, user } }) => {
  /*
  if (!isAuthenticated && !loading) {
    return <Redirect to="/login" />;
  }
  */

  var profileImage = "";
  var firstName = "";
  var LastName = "";
  if (user !== null) {
    profileImage = user.account_picture
      .replace("frontend/public", ".")
      .replace("./frontend/public", ".");
    firstName = user.first_name;
    LastName = user.last_name;
  }

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

              <li className="nav-item">
                <Link to="/AddPatient">
                  <a className="nav-link">
                    <i className="nav-icon far fa-calendar-alt" />
                    <p>
                      Add Patient
                      <span className="badge badge-info right">2</span>
                    </p>
                  </a>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/patient">
                  <a className="nav-link">
                    <i className="nav-icon far fa-image" />
                    <p>Patient Table</p>
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <a href="pages/kanban.html" className="nav-link">
                  <i className="nav-icon fas fa-columns" />
                  <p>Kanban Board</p>
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
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(SideBar);
