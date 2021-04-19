import React, { Component } from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getPatients } from "../../../actions/patient";
import { getTests } from "../../../actions/test";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Dashboard = ({
  getPatients,
  getTests,
  test: { tests },
  patient: { patients, loading },
  auth: { user },
}) => {
  useEffect(() => {
    setDash();
  }, [loading]);

  const setDash = () => {
    if (!loading) {
      getPatients(user.id);
      getTests();
    }
  };

  //charts data preparation
  const makeSexData = () => {
    var result = patients.reduce(
      (acc, o) => ((acc[o.sex] = (acc[o.sex] || 0) + 1), acc),
      {}
    );
    return result;
  };
  const sex = makeSexData();

  const makeAgeData = () => {
    var result = patients.reduce(
      (acc, o) => ((acc[o.age] = (acc[o.age] || 0) + 1), acc),
      {}
    );
    return result;
  };
  const age = makeAgeData();

  const makeCovidData = () => {
    var result = patients.reduce(
      (acc, o) => ((acc[o.covid19] = (acc[o.covid19] || 0) + 1), acc),
      {}
    );
    return result;
  };
  const covid = makeCovidData();

  const makeInfected = (x) => {
    let count = 0;
    patients.forEach((i) => {
      if (i.covid19 == x) {
        count = count + 1;
      }
    });
    return count;
  };
  const numberOfInfected = makeInfected("Covid19");
  const numberOfRecovered = makeInfected("Recovered");

  ////////////////////////////////////////////// infection by sex///////////////////////////////////////
  function makeInfectedSex(x) {
    let dict = {};
    patients.forEach((element) => {
      dict[element.sex] = 0;
    });
    patients.forEach((element) => {
      if (element.covid19 == x) {
        dict[element.sex] = dict[element.sex] + 1;
      }
    });

    return dict;
  }
  const InfectedSex = makeInfectedSex("Covid19");
  const RecoveredSex = makeInfectedSex("Recovered");
  const NotInfectedSex = makeInfectedSex("Not infected");
  const PneumoniaSex = makeInfectedSex("Pneumonia");
  const UnknownSex = makeInfectedSex("Unknown");
  //////////////////////////////////////////
  ////////////////////////////infection by age////////////////////////////////////////////
  function makeInfectedAge(x) {
    let dict = {};
    patients.forEach((element) => {
      dict[element.age] = 0;
    });
    patients.forEach((element) => {
      if (element.covid19 == x) {
        dict[element.age] = dict[element.age] + 1;
      }
    });

    return dict;
  }
  const InfectedAge = makeInfectedAge("Covid19");
  const RecoveredAge = makeInfectedAge("Recovered");
  const NotInfectedAge = makeInfectedAge("Not infected");
  const PneumoniaAge = makeInfectedAge("Pneumonia");
  const UnknownAge = makeInfectedAge("Unknown");

  //////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////// Tests ///////////////////////////////////////
  function makeTestsdata(x) {
    let dict = {};
    tests.forEach((element) => {
      dict[element.date_added] = 0;
    });
    tests.forEach((element) => {
      if (element.result[0] == x && element.account == user.id) {
        dict[element.date_added] = dict[element.date_added] + 1;
      }
    });

    return dict;
  }
  const InfectedTests = makeTestsdata("C");
  const NotInfectedTests = makeTestsdata("N");
  const PneumoniaTests = makeTestsdata("P");

  //////////////////////////////////////////

  return (
    <div>
      <div className="content-wrapper">
        {/* Content Header (Psex header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Doctor Dashboard</h1>
              </div>
              {/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Doctor Dashboard</li>
                </ol>
              </div>
              {/* /.col */}
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* /.content-header */}
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            {/* Small boxes (Stat box) */}
            <div className="row">
              <div className="col-lg-4 col-6">
                {/* small box */}
                <div className="small-box bg-success">
                  <div className="inner">
                    <h3>{patients.length}</h3>
                    <p>Patients</p>
                  </div>

                  <Link to="/patient" className="small-box-footer">
                    More info <i className="fas fa-arrow-circle-right" />
                  </Link>
                </div>
              </div>
              {/* ./col */}
              <div className="col-lg-4 col-6">
                {/* small box */}
                <div className="small-box bg-danger">
                  <div className="inner">
                    <h3>{numberOfInfected}</h3>
                    <p>Infected</p>
                  </div>
                  <Link to="/patient" className="small-box-footer">
                    More info <i className="fas fa-arrow-circle-right" />
                  </Link>
                </div>
              </div>
              {/* ./col */}
              <div className="col-lg-4 col-6">
                {/* small box */}
                <div className="small-box bg-warning">
                  <div className="inner">
                    <h3>{numberOfRecovered}</h3>
                    <p>Recovered</p>
                  </div>
                  <Link to="/patient" className="small-box-footer">
                    More info <i className="fas fa-arrow-circle-right" />
                  </Link>
                </div>
              </div>
              {/* ./col */}
            </div>
            {/* /.row */}
            {/* Main row */}
            <div className="row">
              {/* Left col */}
              <section className="col-lg-7 connectedSortable">
                {/* Custom tabs (Charts with tabs)*/}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <i className="fas fa-chart-pie mr-1" />
                      Charts
                    </h3>
                    <div className="card-tools">
                      <ul className="nav nav-pills ml-auto">
                        <li className="nav-item">
                          <a
                            className="nav-link active"
                            href="#sales-chart"
                            data-toggle="tab">
                            Cases
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            href="#revenue-chart"
                            data-toggle="tab">
                            Age
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* /.card-header */}
                  <div className="card-body">
                    <div className="tab-content p-0">
                      {/* Morris chart - Sales */}
                      <div
                        className="chart tab-pane "
                        id="revenue-chart"
                        style={{ position: "relative", height: 500 }}>
                        <Bar
                          data={{
                            labels: Object.keys(InfectedAge),
                            datasets: [
                              {
                                label: "Covid19",
                                data: Object.values(InfectedAge),
                                backgroundColor: "#ff8080",
                                borderColor: "#ff8080",
                                borderWidth: 1,
                              },
                              {
                                label: "Pneumonia",
                                data: Object.values(PneumoniaAge),
                                backgroundColor: "#ffa07a",
                                borderColor: "#ffa07a",
                                borderWidth: 1,
                              },
                              {
                                label: "Not infected",
                                data: Object.values(NotInfectedAge),
                                backgroundColor: "#90ee90",
                                borderColor: "#90ee90",
                                borderWidth: 1,
                              },
                              {
                                label: "Recoverd",
                                data: Object.values(RecoveredAge),
                                backgroundColor: "#e6e600",
                                borderColor: "#e6e600",
                                borderWidth: 1,
                              },
                            ],
                          }}
                          width={100}
                          height={100}
                          options={{
                            responsive: true,
                            interaction: {
                              intersect: false,
                            },
                            maintainAspectRatio: false,
                            scales: {
                              xAxes: [
                                {
                                  stacked: true,
                                },
                              ],
                              yAxes: [
                                {
                                  stacked: true,
                                  ticks: { beginAtZero: true },
                                },
                              ],
                            },
                          }}
                        />
                      </div>
                      <div
                        className="chart tab-pane active"
                        id="sales-chart"
                        style={{ position: "relative", height: 500 }}>
                        <Pie
                          data={{
                            labels: Object.keys(covid),
                            datasets: [
                              {
                                label: "covid",
                                data: Object.values(covid),
                                backgroundColor: [
                                  "rgba(54, 162, 235, 0.2)",
                                  "rgba(255, 99, 132, 0.2)",
                                  "rgba(255, 206, 86, 0.2)",
                                  "rgba(75, 192, 192, 0.2)",
                                  "rgba(153, 102, 255, 0.2)",
                                  "rgba(255, 159, 64, 0.2)",
                                ],
                                borderColor: [
                                  "rgba(54, 162, 235, 1)",
                                  "rgba(255, 99, 132, 1)",
                                  "rgba(255, 206, 86, 1)",
                                  "rgba(75, 192, 192, 1)",
                                  "rgba(153, 102, 255, 1)",
                                  "rgba(255, 159, 64, 1)",
                                ],
                                borderWidth: 1,
                              },
                            ],
                          }}
                          width={100}
                          height={100}
                          options={{
                            maintainAspectRatio: false,
                            scales: {
                              yAxes: [{ ticks: { beginAtZero: true } }],
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* /.card-body */}
                </div>
                {/* /.card */}
                <div className="card card-danger">
                  <div className="card-header">
                    <h3 className="card-title">Tests</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse">
                        <i className="fas fa-minus" />
                      </button>
                    </div>
                  </div>
                  <div className="card-body" style={{ height: "300px" }}>
                    <div className="chartjs-size-monitor">
                      <div className="chartjs-size-monitor-expand">
                        <div className />
                      </div>
                      <div className="chartjs-size-monitor-shrink">
                        <div className />
                      </div>
                    </div>
                    <Line
                      data={{
                        labels: Object.keys(InfectedTests).sort(),
                        datasets: [
                          {
                            label: "Covid19",
                            data: Object.values(InfectedTests),
                            backgroundColor: "#ff8080",
                            borderColor: "#ff8080",
                            borderWidth: 1,
                          },
                          {
                            label: "Pneumonia",
                            data: Object.values(PneumoniaTests),
                            backgroundColor: "#ffa07a",
                            borderColor: "#ffa07a",
                            borderWidth: 1,
                          },
                          {
                            label: "Not infected",
                            data: Object.values(NotInfectedTests),
                            backgroundColor: "#90ee90",
                            borderColor: "#90ee90",
                            borderWidth: 1,
                          },
                        ],
                      }}
                      width={100}
                      height={100}
                      options={{
                        responsive: true,
                        interaction: {
                          intersect: false,
                        },
                        maintainAspectRatio: false,

                        scales: {
                          xAxes: [
                            {
                              stacked: true,
                            },
                          ],

                          yAxes: [
                            {
                              stacked: true,
                              ticks: { beginAtZero: true },
                            },
                          ],
                        },
                      }}
                    />
                  </div>
                  {/* /.card-body */}
                </div>
              </section>
              {/* /.Left col */}
              {/* right col (We are only adding the ID to make the widgets sortable)*/}
              <section className="col-lg-5 connectedSortable">
                <div className="card card-info">
                  <div className="card-header">
                    <h3 className="card-title">Distribution by age</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse">
                        <i className="fas fa-minus" />
                      </button>
                    </div>
                  </div>
                  <div className="card-body" style={{ height: "500px" }}>
                    <div className="chartjs-size-monitor">
                      <div className="chartjs-size-monitor-expand">
                        <div className />
                      </div>
                      <div className="chartjs-size-monitor-shrink">
                        <div className />
                      </div>
                    </div>
                    <Bar
                      data={{
                        labels: Object.keys(InfectedAge),
                        datasets: [
                          {
                            label: "Covid19",
                            data: Object.values(InfectedAge),
                            backgroundColor: "#ff8080",
                            borderColor: "#ff8080",
                            borderWidth: 1,
                          },
                          {
                            label: "Pneumonia",
                            data: Object.values(PneumoniaAge),
                            backgroundColor: "#ffa07a",
                            borderColor: "#ffa07a",
                            borderWidth: 1,
                          },
                          {
                            label: "Not infected",
                            data: Object.values(NotInfectedAge),
                            backgroundColor: "#90ee90",
                            borderColor: "#90ee90",
                            borderWidth: 1,
                          },
                          {
                            label: "Recoverd",
                            data: Object.values(RecoveredAge),
                            backgroundColor: "#e6e600",
                            borderColor: "#e6e600",

                            borderWidth: 1,
                          },
                        ],
                      }}
                      width={100}
                      height={100}
                      options={{
                        responsive: true,
                        interaction: {
                          intersect: false,
                        },
                        maintainAspectRatio: false,

                        scales: {
                          xAxes: [
                            {
                              stacked: true,
                            },
                          ],

                          yAxes: [
                            {
                              stacked: true,
                              ticks: { beginAtZero: true },
                            },
                          ],
                        },
                      }}
                    />
                  </div>
                  {/* /.card-body */}
                </div>
                {/* /.card */}
                <div className="card card-info">
                  <div className="card-header">
                    <h3 className="card-title">Distribution by gender</h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse">
                        <i className="fas fa-minus" />
                      </button>
                    </div>
                  </div>
                  <div className="card-body" style={{ height: "350px" }}>
                    <div className="chartjs-size-monitor">
                      <div className="chartjs-size-monitor-expand">
                        <div className />
                      </div>
                      <div className="chartjs-size-monitor-shrink">
                        <div className />
                      </div>
                    </div>
                    <Bar
                      data={{
                        labels: Object.keys(InfectedSex),
                        datasets: [
                          {
                            label: "Covid19",
                            data: Object.values(InfectedSex),
                            backgroundColor: "#ff8080",
                            borderColor: "#ff8080",
                            borderWidth: 1,
                          },
                          {
                            label: "Pneumonia",
                            data: Object.values(PneumoniaSex),
                            backgroundColor: "#ffa07a",
                            borderColor: "#ffa07a",
                            borderWidth: 1,
                          },
                          {
                            label: "Not infected",
                            data: Object.values(NotInfectedSex),
                            backgroundColor: "#90ee90",
                            borderColor: "#90ee90",
                            borderWidth: 1,
                          },
                          {
                            label: "Recoverd",
                            data: Object.values(RecoveredSex),
                            backgroundColor: "#e6e600",
                            borderColor: "#e6e600",

                            borderWidth: 1,
                          },
                        ],
                      }}
                      width={100}
                      height={100}
                      options={{
                        responsive: true,
                        interaction: {
                          intersect: false,
                        },
                        maintainAspectRatio: false,

                        scales: {
                          xAxes: [
                            {
                              stacked: true,
                            },
                          ],

                          yAxes: [
                            {
                              stacked: true,
                              ticks: { beginAtZero: true },
                            },
                          ],
                        },
                      }}
                    />
                  </div>
                  {/* /.card-body */}
                </div>
                {/* /.card */}

                {/* line chart */}

                {/* /.card */}
              </section>
              {/* right col */}
            </div>
            {/* /.row (main row) */}
          </div>
          {/* /.container-fluid */}
        </section>
        {/* right col */}

        {/* /.content */}
      </div>
      {/* /.content-wrapper */}

      {/* Control Sidebar */}
      <aside className="control-sidebar control-sidebar-dark">
        {/* Control sidebar content goes here */}
      </aside>
      {/* /.control-sidebar */}
      {/* ./wrapper */}
    </div>
  );
};

Dashboard.propTypes = {
  getPatients: PropTypes.func.isRequired,
  patient: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  test: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  patient: state.patient,
  auth: state.auth,
  test: state.test,
});

export default connect(mapStateToProps, {
  getPatients,
  getTests,
})(Dashboard);
