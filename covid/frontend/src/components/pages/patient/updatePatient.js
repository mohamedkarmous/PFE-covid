import React, { Component } from "react";
import Navbar from "../../layout/Navbar";
import SideBar from "../../layout/SideBar";

import { useEffect } from "react";
import { useState } from "react";
import { update_patient } from "../../../actions/patient";
import {
  sendTest,
  getTests,
  deleteTest,
  updateTest,
} from "../../../actions/test";

import {
  sendDiagnostic,
  getDiagnostics,
  deleteDiagnostic,
  updateDiagnostic,
} from "../../../actions/diagnostic";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

//react grid table importation
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { stateNames } from "../../../utils/LocalVariables";

function UpdatePatient({
  auth: { user, loading },
  patient: { patient },
  test: { tests },
  diagnostic: { diagnostics },
  update_patient,
  sendTest,
  getTests,
  deleteTest,
  updateTest,
  sendDiagnostic,
  getDiagnostics,
  deleteDiagnostic,
  updateDiagnostic,
}) {
  let history = useHistory();

  var stateObject = stateNames;

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

  const testPatient = () => {
    if (!loading && patient == null) {
      history.push("/");
    }
  };

  useEffect(() => {
    testPatient();
    setPage();
  }, [loading]);

  var patientPiture = "";
  function setPage() {
    if (!loading && patient) {
      getTests(patient.id);
      getDiagnostics(patient.id);
      set_selection_fields();
      set_date_max();
      set_form();
    }
  }

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

  const [formDataDiag, setFormDataDiag] = useState({
    cough: "false",
    fever: "false",
    sore_throat: "false",
    shortness_of_breath: "false",
    head_ache: "false",
  });
  const {
    cough,
    fever,
    sore_throat,
    shortness_of_breath,
    head_ache,
  } = formDataDiag;

  var Data = new FormData();
  var Data1 = new FormData();
  var DataDiagnostic = new FormData();

  var imagefile = document.querySelector("#file");
  var imagetest = document.querySelector("#testFile");

  const loadPicture = (e) => {
    Data.append("patient_picture", imagefile.files[0]);

    document.getElementById("filename").innerHTML = String(
      imagefile.files[0].name
    );
  };
  const loadPicture1 = (e) => {
    Data1.append("xray_image", imagetest.files[0]);
    document.getElementById("testname").innerHTML = String(
      imagetest.files[0].name
    );
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onChangeDiag = (e) => {
    setFormDataDiag({ ...formDataDiag, [e.target.name]: e.target.value });
    console.log(formDataDiag);
  };
  const onSubmit1 = async (e) => {
    e.preventDefault();
    Data1.append("patient", patient.id);
    Data1.append("account", user.id);
    sendTest(Data1);
    document.getElementById("testname").innerHTML = String("");

    setTimeout(() => {
      getTests(patient.id);
    }, 1000);
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

  const onSubmitDiagnostic = async (e) => {
    e.preventDefault();
    console.log(formDataDiag);
    DataDiagnostic.append("cough", formDataDiag.cough);
    DataDiagnostic.append("fever", formDataDiag.fever);
    DataDiagnostic.append("sore_throat", formDataDiag.sore_throat);
    DataDiagnostic.append(
      "shortness_of_breath",
      formDataDiag.shortness_of_breath
    );
    DataDiagnostic.append("head_ache", formDataDiag.head_ache);
    if (user != null) {
      DataDiagnostic.append("account", user.id);
    }
    if (patient != null) {
      DataDiagnostic.append("patient", patient.id);
      DataDiagnostic.append("gender", patient.sex);
    }

    setTimeout(() => {
      getDiagnostics(patient.id);
    }, 1000);

    sendDiagnostic(DataDiagnostic);
  };
  //table code
  var [selected, setSelected] = React.useState(null);
  function remove(e, id) {
    setSelected((selected = id));
    /*
    deleteTest(id.id);

    setTimeout(() => {
      getTests(patient.id);
    }, 500);
    */
  }
  function confirmDelete() {
    deleteTest(selected.id);
  }

  function update(e, id) {
    let d = new FormData();
    if (id.validated == true) {
      d.append("validated", false);
    } else {
      d.append("validated", true);
    }

    updateTest(d, id.id);
    setTimeout(() => {
      getTests(patient.id);
    }, 750);
  }

  const dynamicCellStyleCovid = (e) => {
    if (e.value[0] == "C") {
      return { backgroundColor: "#f08080" };
    } else if (e.value[0] == "N") {
      return { backgroundColor: "#90ee90" };
    } else if (e.value[0] == "P") {
      return { backgroundColor: "#fad1d1" };
    }
  };
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi.columnApi);
  };

  ////////////////code of diagnostic table//////

  var [selected1, setSelected1] = React.useState(null);
  function remove1(e, id) {
    setSelected1((selected1 = id));
    /*
    deleteTest(id.id);

    setTimeout(() => {
      getTests(patient.id);
    }, 500);
    */
  }
  function confirmDelete1() {
    deleteDiagnostic(selected1.id);
  }

  function update1(e, id) {
    let d = new FormData();
    if (id.validated == true) {
      d.append("validated", false);
    } else {
      d.append("validated", true);
    }

    updateDiagnostic(d, id.id);
    setTimeout(() => {
      getDiagnostics(patient.id);
    }, 750);
  }

  const updateButton1 = (props) => {
    return (
      <button
        type="button"
        class="btn btn-block btn-secondary"
        style={{ width: "30px", borderRadius: "4px", height: "30px" }}
        onClick={(e) => update1(e, props.data)}>
        <ion-icon style={{ "font-size": "20px" }} name="create"></ion-icon>
      </button>
    );
  };
  const deleteButton1 = (props) => {
    return (
      <button
        data-toggle="modal"
        data-target="#exampleModal1"
        type="button"
        class="btn btn-block btn-secondary"
        style={{ width: "30px", borderRadius: "4px", height: "30px" }}
        onClick={(e) => remove1(e, props.data)}>
        <ion-icon
          style={{ "font-size": "20px" }}
          name="trash-outline"></ion-icon>
      </button>
    );
  };

  ////////////end of diagnostic table code //////

  const updateButton = (props) => {
    return (
      <button
        type="button"
        class="btn btn-block btn-secondary"
        style={{ width: "30px", borderRadius: "4px", height: "30px" }}
        onClick={(e) => update(e, props.data)}>
        <ion-icon style={{ "font-size": "20px" }} name="create"></ion-icon>
      </button>
    );
  };
  const deleteButton = (props) => {
    return (
      <button
        data-toggle="modal"
        data-target="#exampleModal"
        type="button"
        class="btn btn-block btn-secondary"
        style={{ width: "30px", borderRadius: "4px", height: "30px" }}
        onClick={(e) => remove(e, props.data)}>
        <ion-icon
          style={{ "font-size": "20px" }}
          name="trash-outline"></ion-icon>
      </button>
    );
  };

  const xrayImage = (props) => {
    const str = props.data.xray_image.replace(
      "http://localhost:8000/api/test/frontend/public",
      "."
    );

    return <img src={str} width="500" height="600"></img>;
  };

  const [rowData, setRowData] = useState(tests);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  /////diagnostic table code

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
                            <label>Select sex : </label>
                            <select
                              className="custom-select"
                              id="sex"
                              name="sex"
                              value={sex}
                              onChange={(e) => onChange(e)}>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-3">
                          {/* select */}
                          <div className="form-group">
                            <label>Select case :</label>
                            <select
                              className="custom-select"
                              id="covid-19"
                              name="covid19"
                              value={covid19}
                              onClick={(e) => onChange(e)}
                              onChange={(e) => onChange(e)}>
                              <option value="Unknown">Unknown</option>
                              <option value="Covid19">Covid19</option>
                              <option value="Pneumonia">Pneumonia</option>
                              <option value="Recovered">Recovered</option>
                              <option value="Not infected">Not infected</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="exampleInputFile">
                          Patient Picture :
                        </label>
                        <div className="col-10">
                          <img
                            src={
                              (patientPiture = patient.patient_picture.replace(
                                "http://localhost:8000/api/patient/frontend/public",
                                "."
                              ))
                            }
                            width="600"
                            height="500"
                          />
                        </div>
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

              {/*diagnostic  */}
              <div className="card" style={{ width: "100%" }}>
                <div
                  className="card-header"
                  style={{ backgroundColor: "#28a745" }}>
                  <h3 className="card-title" style={{ color: "white" }}>
                    Add patient diagnostic{" "}
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
                  <form onSubmit={(e) => onSubmitDiagnostic(e)}>
                    <div className="card-body">
                      <div className="row">
                        {" "}
                        <div className="form-group">
                          <div className="col-10">
                            {/* select */}
                            <div className="form-group">
                              <label>Cough : </label>
                              <select
                                className="custom-select"
                                id="cough"
                                name="cough"
                                value={cough}
                                onChange={(e) => onChangeDiag(e)}>
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="col-10">
                            {/* select */}
                            <div className="form-group">
                              <label>Fever : </label>
                              <select
                                className="custom-select"
                                id="fever"
                                name="fever"
                                value={fever}
                                onChange={(e) => onChangeDiag(e)}>
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="col-10">
                            {/* select */}
                            <div className="form-group">
                              <label>Sore Throat : </label>
                              <select
                                className="custom-select"
                                id="sore_throat"
                                name="sore_throat"
                                value={sore_throat}
                                onChange={(e) => onChangeDiag(e)}>
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="col-10">
                            {/* select */}
                            <div className="form-group">
                              <label>Shortness Of Breath : </label>
                              <select
                                className="custom-select"
                                id="shortness_of_breath"
                                name="shortness_of_breath"
                                value={shortness_of_breath}
                                onChange={(e) => onChangeDiag(e)}>
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="col-10">
                            {/* select */}
                            <div className="form-group">
                              <label>Headache : </label>
                              <select
                                className="custom-select"
                                id="head_ache"
                                name="head_ache"
                                value={head_ache}
                                onChange={(e) => onChangeDiag(e)}>
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
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
                  {/* 7ot lena el code end*/}
                  {/* tests table */}
                  <br />

                  <div
                    className="ag-theme-alpine"
                    style={{ height: 500, width: "100%" }}>
                    <AgGridReact
                      rowData={diagnostics}
                      onGridReady={onGridReady}
                      sideBar={"filters"}
                      // rowSelection="multiple"
                      pagination={true}
                      paginationPageSize={20}
                      frameworkComponents={{
                        update: updateButton1,
                        delete: deleteButton1,
                      }}
                      enableCharts={true}>
                      <AgGridColumn
                        field="id"
                        sortable={true}
                        filter={true}
                        //checkboxSelection={true}
                        width={80}></AgGridColumn>
                      <AgGridColumn
                        headerName="cough"
                        field="cough"
                        sortable={true}
                        filter={true}
                        floatingFilter={true}
                        width={110}></AgGridColumn>
                      <AgGridColumn
                        headerName="fever"
                        field="fever"
                        sortable={true}
                        filter={true}
                        floatingFilter={true}
                        width={110}></AgGridColumn>
                      <AgGridColumn
                        headerName="sore throat"
                        field="sore_throat"
                        sortable={true}
                        filter={true}
                        floatingFilter={true}
                        width={130}></AgGridColumn>
                      <AgGridColumn
                        headerName="shortness of breath"
                        field="shortness_of_breath"
                        sortable={true}
                        filter={true}
                        floatingFilter={true}
                        width={180}></AgGridColumn>
                      <AgGridColumn
                        headerName="headache"
                        field="head_ache"
                        sortable={true}
                        filter={true}
                        floatingFilter={true}
                        width={130}></AgGridColumn>
                      <AgGridColumn
                        headerName="date added"
                        field="date_added"
                        sortable={true}
                        filter={true}
                        width={150}></AgGridColumn>
                      <AgGridColumn
                        field="result"
                        sortable={true}
                        filter={true}
                        width={130}
                        floatingFilter={true}
                        cellStyle={(e) =>
                          dynamicCellStyleCovid(e)
                        }></AgGridColumn>

                      <AgGridColumn
                        cellRenderer="update"
                        width={50}
                        colId="params"></AgGridColumn>
                      <AgGridColumn
                        cellRenderer="delete"
                        width={50}
                        colId="params"></AgGridColumn>
                    </AgGridReact>
                  </div>

                  {/* tests table end  */}
                </div>
                {/* /.card-body */}

                {/*lena diagnostic */}

                {/* /.card-footer*/}
              </div>
              {/* mena zedt */}

              {/**end of diagnostic  */}
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
                            <button type="submit" className="btn btn-success">
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* /.card-body */}
                  </form>
                  {/* 7ot lena el code end*/}
                  {/* tests table */}
                  <div
                    className="ag-theme-alpine"
                    style={{ height: 800, width: "100%" }}>
                    <AgGridReact
                      rowHeight={600}
                      rowData={tests}
                      //  onFirstDataRendered={onFirstDataRendered}
                      onGridReady={onGridReady}
                      sideBar={"filters"}
                      // rowSelection="multiple"
                      pagination={true}
                      paginationPageSize={1}
                      frameworkComponents={{
                        update: updateButton,
                        delete: deleteButton,
                        xray: xrayImage,
                      }}
                      enableCharts={true}>
                      <AgGridColumn
                        headerName="Xray"
                        cellRenderer="xray"
                        width={550}></AgGridColumn>
                      <AgGridColumn
                        headerName="date added"
                        field="date_added"
                        sortable={true}
                        filter={true}
                        floatingFilter={true}
                        width={150}></AgGridColumn>
                      <AgGridColumn
                        headerName="Result"
                        field="result"
                        sortable={true}
                        filter={true}
                        floatingFilter={true}
                        cellStyle={(e) => dynamicCellStyleCovid(e)}
                        width={175}></AgGridColumn>
                      <AgGridColumn
                        headerName="Validated"
                        field="validated"
                        sortable={true}
                        filter={true}
                        floatingFilter={true}
                        cellStyle={(e) => dynamicCellStyleCovid(e)}
                        width={120}></AgGridColumn>
                      <AgGridColumn
                        cellRenderer="update"
                        width={50}
                        colId="params"></AgGridColumn>
                      <AgGridColumn
                        cellRenderer="delete"
                        width={50}
                        colId="params"></AgGridColumn>
                    </AgGridReact>
                  </div>

                  {/* tests table end  */}
                </div>
                {/* /.card-body */}

                {/*lena diagnostic */}

                {/**end of diagnostic  */}
                {/* /.card-footer*/}
              </div>
              {/* mena zedt */}
            </div>
          </div>
        </section>
      </div>
      {/* modal code  */}

      <div>
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-content bg-danger">
                <div class="modal-header">
                  <h4 class="modal-title">Delete confirmation</h4>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>Are you sure ? </p>
                </div>
                <div class="modal-footer justify-content-between">
                  <button
                    data-dismiss="modal"
                    type="button"
                    class="btn btn-outline-light"
                    data-dismiss="modal">
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-light"
                    onClick={confirmDelete1}
                    data-dismiss="modal">
                    Yes delete this Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* modal code  */}

      {/* modal code for diagnosstic */}

      <div>
        <div
          class="modal fade"
          id="exampleModal1"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-content bg-danger">
                <div class="modal-header">
                  <h4 class="modal-title">Delete confirmation</h4>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>Are you sure ? </p>
                </div>
                <div class="modal-footer justify-content-between">
                  <button
                    data-dismiss="modal"
                    type="button"
                    class="btn btn-outline-light"
                    data-dismiss="modal">
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-light"
                    onClick={confirmDelete1}
                    data-dismiss="modal">
                    Yes delete this diagnostic
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* modal code for diagnostic */}
    </div>
  );
}
UpdatePatient.protoTypes = {
  update_patient: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  patient: PropTypes.object.isRequired,
  test: PropTypes.object.isRequired,
  diagnostic: PropTypes.object.isRequired,
  sendTest: PropTypes.func.isRequired,
  getTests: PropTypes.func.isRequired,
  deleteTest: PropTypes.func.isRequired,
  updateTest: PropTypes.func.isRequired,
  sendDiagnostic: PropTypes.func.isRequired,
  getDiagnostics: PropTypes.func.isRequired,
  deleteDiagnostic: PropTypes.func.isRequired,
  updateDiagnostic: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  patient: state.patient,
  test: state.test,
  diagnostic: state.diagnostic,
});

export default connect(mapStateToProps, {
  update_patient,
  sendTest,
  getTests,
  deleteTest,
  updateTest,
  sendDiagnostic,
  getDiagnostics,
  deleteDiagnostic,
  updateDiagnostic,
})(UpdatePatient);
