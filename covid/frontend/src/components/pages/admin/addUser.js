import React, { Component } from "react";
import Navbar from "../../layout/Navbar";
import SideBar from "../../layout/SideBar";
import { useEffect } from "react";
import { useState } from "react";
import { add_user } from "../../../actions/users";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import setAlert from "../../layout/alert";

function AddUser({
  auth: { loading, user },

  add_user,
}) {
  let history = useHistory();

  useEffect(() => {
    testAdmin();
  }, [loading]);

  const testAdmin = () => {
    if (user) {
      if (!user.is_admin) {
        history.push("/");
      }
    }
  };

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    password2: "",
    username: "",
    is_doctor: "",
    is_admin: "",
    password: "",
    password2: "",
  });

  const {
    firstname,
    lastname,
    username,
    email,
    is_admin,
    is_doctor,
    password,
    password2,
  } = formData;
  var Data = new FormData();

  var imagefile = document.querySelector("#file");

  const loadPicture = (e) => {
    Data.append("account_picture", imagefile.files[0]);

    document.getElementById("filename").innerHTML = String(
      imagefile.files[0].name
    );
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    Data.append("first_name", formData.firstname);
    Data.append("last_name", formData.lastname);
    Data.append("email", formData.email);
    Data.append("username", formData.username);
    Data.append("is_admin", formData.is_admin);
    Data.append("is_doctor", formData.is_doctor);
    Data.append("password", formData.password);
    Data.append("password2", formData.password2);

    add_user(Data, history);
    document.getElementById("filename").innerHTML = String("");
  };

  return (
    <div>
      <SideBar />
      <div className="content-wrapper" style={{ "padding-top": "15px" }}>
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              {/* left column */}

              {/* mena zedt*/}
              <div className="card card-secondary" style={{ width: "100%" }}>
                <div
                  className="card-header"
                  style={{ backgroundColor: "#007bff" }}>
                  <h3 className="card-title" style={{ color: "white" }}>
                    Add User{" "}
                  </h3>

                  {/*<div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                      title="Collapse">
                      <i className="fas fa-minus" />
                    </button>
                  </div> */}
                </div>
                <div className="card-body" style={{ display: "block" }}>
                  {/* 7ot lena el code  */}
                  <form onSubmit={(e) => onSubmit(e)}>
                    <div className="card-body">
                      <div class="row">
                        <div className="form-group">
                          <label htmlFor="exampleInputName">First name</label>
                          <div className="col-12">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="First Name"
                              name="firstname"
                              value={firstname}
                              onChange={(e) => onChange(e)}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputName">Last name</label>
                          <div className="col-12">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Last Name"
                              name="lastname"
                              value={lastname}
                              onChange={(e) => onChange(e)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputName">Username</label>
                        <div className="col-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            name="username"
                            value={username}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputName">Password</label>
                        <div className="col-6">
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputName">
                          Confirm password
                        </label>
                        <div className="col-6">
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Confrirm Password"
                            name="password2"
                            value={password2}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="exampleInputName">Email</label>
                        <div className="col-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        {/* select */}
                        <div className="form-group">
                          <label>Is doctor</label>
                          <select
                            className="custom-select"
                            id="districtSel"
                            name="is_doctor"
                            value={is_doctor}
                            onChange={(e) => onChange(e)}>
                            <option value="false" selected="selected">
                              False
                            </option>
                            <option value="true" selected="selected">
                              True
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="col-3">
                        {/* select */}
                        <div className="form-group">
                          <label>Is Admin</label>
                          <select
                            className="custom-select"
                            id="doctor"
                            name="is_admin"
                            value={is_admin}
                            onChange={(e) => onChange(e)}>
                            <option value="false" selected="selected">
                              False
                            </option>
                            <option value="true" selected="selected">
                              True
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="exampleInputFile">
                          Account Picture :
                        </label>

                        <div className="col-10">
                          <div className="input-group">
                            <div className="custom-file">
                              <input
                                id="file"
                                name="file"
                                type="file"
                                onChange={(e) => loadPicture(e)}
                                className="custom-file-input"></input>
                              <label
                                className="custom-file-label"
                                htmlFor="exampleInputFile"
                                id="filename"></label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Add user
                    </button>
                    {/* /.card-body */}
                  </form>

                  {/* 7ot lena el code */}
                </div>
                {/* /.card-body */}

                {/* /.card-footer*/}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
AddUser.protoTypes = {
  auth: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  add_user: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  users: state.users,
});

export default connect(mapStateToProps, {
  add_user,
})(AddUser);
