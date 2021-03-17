import React, { Component } from "react";
import Navbar from "../layout/Navbar";
import SideBar from "../layout/SideBar";
import { useEffect } from "react";
import { useState } from "react";
import { update_patient } from "../../actions/patient";
import { sendTest } from "../../actions/test";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

function UpdatePatient({
  auth: { user },
  patient: { patient, loading },
  update_patient,
  sendTest,
}) {
  let history = useHistory();

  var stateObject = {
    Tunisia: {
      Tunis: [
        "Tunis",
        "Le Bardo",
        "Le Kram	",
        "La Goulette",
        "Carthage",
        "Sidi Bou Said",
        "La Marsa",
        "Sidi Hassine",
      ],
      Ariana: [
        "Ariana",
        "La Soukra",
        "	Raoued",
        "Kalâat el-Andalous",
        "Sidi Thabet",
        "Ettadhamen-Mnihla",
      ],
      "Ben Arous": [
        "Ben Arous	",
        "El Mourouj",
        "Hammam Lif	",
        "Hammam Chott	",
        "Bou Mhel el-Bassatine",
        "Ezzahra	",
        "Radès",
        "Mégrine",
        "Mohamedia-Fouchana",
        "Mornag",
        "Khalidia",
      ],
    },
  };

  function set_selection_fields() {
    var countySel = document.getElementById("countySel"),
      stateSel = document.getElementById("stateSel"),
      districtSel = document.getElementById("districtSel");
    countySel.length = 1;
    for (var country in stateObject) {
      countySel.options[countySel.options.length] = new Option(
        country,
        country
      );
    }

    countySel.onchange = function () {
      stateSel.length = 1; // remove all options bar first
      districtSel.length = 1; // remove all options bar first
      if (this.selectedIndex < 1) return; // done
      for (var state in stateObject[this.value]) {
        stateSel.options[stateSel.options.length] = new Option(state, state);
      }
    };
    countySel.onchange(); // reset in case page is reloaded
    stateSel.onchange = function () {
      districtSel.length = 1; // remove all options bar first
      if (this.selectedIndex < 1) return; // done
      var district = stateObject[countySel.value][this.value];
      for (var i = 0; i < district.length; i++) {
        districtSel.options[districtSel.options.length] = new Option(
          district[i],
          district[i]
        );
      }
    };
  }

  function set_date_max() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }

    today = yyyy + "-" + mm + "-" + dd;
    document.getElementById("birthday").setAttribute("max", today);
  }

  useEffect(() => {
    set_selection_fields();
    set_date_max();
    set_form();
  }, [patient]);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    city: "",
    governorate: "",
    sex: "Male",
    date_of_birth: "",
    covid19: "Not infected",
  });

  const set_form = () => {
    setFormData({
      firstname: loading ? "" : patient.first_name,
      lastname: loading ? "" : patient.last_name,
      city: loading ? "" : patient.city,
      governorate: loading ? "" : patient.governorate,
      sex: loading ? "" : patient.sex,
      date_of_birth: loading ? "" : patient.date_of_birth,
      covid19: loading ? "" : patient.covid19,
    });

    var countySel = document.getElementById("countySel"),
      stateSel = document.getElementById("stateSel"),
      districtSel = document.getElementById("districtSel");
    /*
    var opts = countySel.options;
    for (var opt, j = 0; opt = opts[j]; j++) {
      if (opt.value == val) {
        countySel.selectedIndex = j;
        break;
      }
    }
    */
    //to change when other countries added
    countySel.selectedIndex = 1;
    for (var state in stateObject["Tunisia"]) {
      stateSel.options[stateSel.options.length] = new Option(state, state);
    }

    var opts = stateSel.options;
    for (var opt, j = 0; (opt = opts[j]); j++) {
      if (opt.value == patient.city) {
        stateSel.selectedIndex = j;
        break;
      }
    }
    var district = stateObject[countySel.value][patient.city];
    for (var i = 0; i < district.length; i++) {
      districtSel.options[districtSel.options.length] = new Option(
        district[i],
        district[i]
      );
    } //////////end of code to change

    var opts = districtSel.options;
    for (var opt, j = 0; (opt = opts[j]); j++) {
      if (opt.value == patient.governorate) {
        districtSel.selectedIndex = j;
        break;
      }
    }
  };

  const {
    firstname,
    lastname,
    city,
    governorate,
    sex,
    date_of_birth,
    covid19,
  } = formData;
  var Data = new FormData();
  var Data1 = new FormData();

  var imagefile = document.querySelector("#file");
  var imagetest = document.querySelector("#testFile");

  const loadPicture = (e) => {
    Data.append("patient_picture", imagefile.files[0]);

    document.getElementById("filename").innerHTML = String(
      imagefile.files[0].name
    );
  };
  const loadPicture1 = (e) => {
    Data1.append("file", imagetest.files[0]);
    document.getElementById("testname").innerHTML = String(
      imagetest.files[0].name
    );
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit1 = async (e) => {
    e.preventDefault();
    sendTest(Data1);
    document.getElementById("testname").innerHTML = String("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    Data.append("first_name", formData.firstname);
    Data.append("last_name", formData.lastname);
    Data.append("city", formData.city);
    Data.append("governorate", formData.governorate);
    Data.append("sex", formData.sex);
    Data.append("date_of_birth", formData.date_of_birth);
    if (user != null) {
      Data.append("account", user.id);
    }

    Data.append("covid19", formData.covid19);

    update_patient(Data, patient.id, history);
    document.getElementById("filename").innerHTML = String("");
  };

  return (
    <div>
      <Navbar />
      <SideBar />
      <div className="content-wrapper" style={{ "padding-top": "15px" }}>
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              {/* left column */}

              {/* mena zedt*/}
              <div className="card" style={{ width: "100%" }}>
                <div
                  className="card-header"
                  style={{ backgroundColor: "#28a745" }}>
                  <h3 className="card-title" style={{ color: "white" }}>
                    Update patient{" "}
                  </h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                      title="Collapse">
                      <i className="fas fa-minus" />
                    </button>
                  </div>
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
                      <div className="row">
                        <div className="col-2">
                          {/* select */}
                          <div className="form-group">
                            <label>Select country</label>
                            <select
                              className="custom-select"
                              id="countySel"
                              name="countySel">
                              <option value="" selected="selected">
                                Select Country
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="col-2">
                          {/* select */}
                          <div className="form-group">
                            <label>Select city </label>
                            <select
                              className="custom-select"
                              id="stateSel"
                              name="city"
                              value={city}
                              onChange={(e) => onChange(e)}
                              size="1">
                              <option value="" selected="selected">
                                Please select Country first
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          {/* select */}
                          <div className="form-group">
                            <label>Select Municipality</label>
                            <select
                              className="custom-select"
                              id="districtSel"
                              name="governorate"
                              value={governorate}
                              onChange={(e) => onChange(e)}
                              size="1">
                              <option value="" selected="selected">
                                Please select city first
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label> Date of birth MM/JJ/AAAA:</label>
                        <div
                          className="col-3"
                          id="reservationdate"
                          data-target-input="nearest">
                          <input
                            type="date"
                            id="birthday"
                            name="date_of_birth"
                            value={date_of_birth}
                            onChange={(e) => onChange(e)}
                            className="form-control"
                            data-date-format="dd/mm/yyyy"
                          />

                          <div
                            className="input-group-append"
                            data-target="#reservationdate"
                            data-toggle="datetimepicker"></div>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="col-2">
                          {/* select */}
                          <div className="form-group">
                            <label>Select sex </label>
                            <select
                              className="custom-select"
                              id="sex"
                              name="sex"
                              value={sex}
                              onChange={(e) => onChange(e)}>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-3">
                          {/* select */}
                          <div className="form-group">
                            <label>Select case </label>
                            <select
                              className="custom-select"
                              id="covid-19"
                              name="covid19"
                              value={covid19}
                              onClick={(e) => onChange(e)}
                              onChange={(e) => onChange(e)}>
                              <option value="Infected">Infected</option>
                              <option value="Recovered">Recovered</option>
                              <option value="Not infected">Not infected</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="exampleInputFile">
                          Patient Picture
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
                    <button type="submit" className="btn btn-success">
                      Submit
                    </button>
                    {/* /.card-body */}
                  </form>

                  {/* 7ot lena el code */}
                </div>
                {/* /.card-body */}

                {/* /.card-footer*/}
              </div>
              <div className="card" style={{ width: "100%" }}>
                <div
                  className="card-header"
                  style={{ backgroundColor: "#28a745" }}>
                  <h3 className="card-title" style={{ color: "white" }}>
                    Add patient xray test{" "}
                  </h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                      title="Collapse">
                      <i className="fas fa-minus" />
                    </button>
                  </div>
                </div>
                <div className="card-body" style={{ display: "block" }}>
                  {/* 7ot lena el code  */}
                  <form onSubmit={(e) => onSubmit1(e)}>
                    <div className="card-body">
                      <div className="form-group">
                        <label htmlFor="exampleInputFile">Patient Test</label>
                        <div className="col-10">
                          <div className="input-group">
                            <div className="custom-file">
                              <input
                                id="testFile"
                                name="file"
                                type="file"
                                onChange={(e) => loadPicture1(e)}
                                className="custom-file-input"></input>
                              <label
                                className="custom-file-label"
                                htmlFor="exampleInputFile"
                                id="testname"></label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-success">
                      Submit
                    </button>
                    {/* /.card-body */}
                  </form>

                  {/* 7ot lena el code */}
                </div>
                {/* /.card-body */}

                {/* /.card-footer*/}
              </div>
              {/* mena zedt */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
UpdatePatient.protoTypes = {
  update_patient: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  patient: PropTypes.object.isRequired,
  test: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  patient: state.patient,
  test: state.test,
});

export default connect(mapStateToProps, { update_patient, sendTest })(
  UpdatePatient
);
