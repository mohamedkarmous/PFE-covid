import React from "react";
import Navbar from "../../layout/Navbar";
import SideBar from "../../layout/SideBar";
import Footer from "../../layout/Footer";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getPatients } from "../../../actions/patient";
import { getTests } from "../../../actions/test";
import { getUsers } from "../../../actions/users";
import { Bar, Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";

const AdminDashboard = ({
  getPatients,
  getTests,
  getUsers,
  users: { users },
  test: { tests },
  patient: { patients },
  auth: { user, loading },
}) => {
  {
    useEffect(() => {
      setDash();
    }, []);

    const setDash = () => {
      if (!loading) {
        getPatients();
        getTests();
        getUsers();
      }
    };
  }
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

  return (
    <div>
      <Navbar />
      <SideBar />
      <div>
        <div className="content-wrapper">
          {/* Content Header (Psex header) */}
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1 className="m-0">Admin Dashboard</h1>
                </div>
                {/* /.col */}
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="#">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Dashboard</li>
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
                <div className="col-lg-3 col-6">
                  {/* small box */}
                  <div className="small-box bg-warning">
                    <div className="inner">
                      <h3>{patients.length}</h3>
                      <p>Patient Registrations</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-person-add" />
                    </div>
                    <Link to="/patient" className="small-box-footer">
                      More info <i className="fas fa-arrow-circle-right" />
                    </Link>
                  </div>
                </div>
                {/* ./col */}
                <div className="col-lg-3 col-6">
                  {/* small box */}
                  <div className="small-box bg-info">
                    <div className="inner">
                      <h3>{users.length}</h3>
                      <p>Users</p>
                    </div>
                    <Link to="/users" className="small-box-footer">
                      More info <i className="fas fa-arrow-circle-right" />
                    </Link>
                  </div>
                </div>
                {/* ./col */}
                <div className="col-lg-3 col-6">
                  {/* small box */}
                  <div className="small-box bg-success">
                    <div className="inner">
                      <h3>
                        20<sup style={{ fontSize: 20 }}>%</sup>
                      </h3>
                      <p>Recovered</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-stats-bars" />
                    </div>
                    <a href="#" className="small-box-footer">
                      More info <i className="fas fa-arrow-circle-right" />
                    </a>
                  </div>
                </div>
                {/* ./col */}

                <div className="col-lg-3 col-6">
                  {/* small box */}
                  <div className="small-box bg-danger">
                    <div className="inner">
                      <h3>1</h3>
                      <p>Infected</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-pie-graph" />
                    </div>
                    <a href="#" className="small-box-footer">
                      More info <i className="fas fa-arrow-circle-right" />
                    </a>
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
                              href="#revenue-chart"
                              data-toggle="tab">
                              Sex
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              href="#sales-chart"
                              data-toggle="tab">
                              Infection
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
                          className="chart tab-pane active"
                          id="revenue-chart"
                          style={{ position: "relative", height: 300 }}>
                          <Bar
                            data={{
                              labels: Object.keys(sex),
                              datasets: [
                                {
                                  label: "Sex",
                                  data: Object.values(sex),
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
                        <div
                          className="chart tab-pane"
                          id="sales-chart"
                          style={{ position: "relative", height: 300 }}>
                          <Bar
                            data={{
                              labels: Object.keys(covid),
                              datasets: [
                                {
                                  label: "covid",
                                  data: Object.values(covid),
                                  backgroundColor: [
                                    "rgba(255, 99, 132, 0.2)",
                                    "rgba(54, 162, 235, 0.2)",
                                    "rgba(255, 206, 86, 0.2)",
                                    "rgba(75, 192, 192, 0.2)",
                                    "rgba(153, 102, 255, 0.2)",
                                    "rgba(255, 159, 64, 0.2)",
                                  ],
                                  borderColor: [
                                    "rgba(255, 99, 132, 1)",
                                    "rgba(54, 162, 235, 1)",
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
                      <h3 className="card-title">Chart</h3>
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
                      <Doughnut
                        data={{
                          labels: Object.keys(covid),
                          datasets: [
                            {
                              data: Object.values(covid),
                              backgroundColor: [
                                "rgba(54, 162, 235, 0.2)",

                                "rgba(255, 206, 86, 0.2)",
                                "rgba(255, 99, 132, 0.2)",
                                "rgba(75, 192, 192, 0.2)",
                                "rgba(153, 102, 255, 0.2)",
                                "rgba(255, 159, 64, 0.2)",
                              ],
                              borderColor: [
                                "rgba(54, 162, 235, 1)",

                                "rgba(255, 206, 86, 1)",
                                "rgba(255, 99, 132, 1)",
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
                          scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                        }}
                      />
                    </div>
                    {/* /.card-body */}
                  </div>
                </section>
                {/* /.Left col */}
                {/* right col (We are only adding the ID to make the widgets sortable)*/}
                <section className="col-lg-5 connectedSortable">
                  {/* Map card */}
                  <div className="card card-info">
                    <div className="card-header">
                      <h3 className="card-title">Age</h3>
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
                      <Doughnut
                        data={{
                          labels: Object.keys(age),
                          datasets: [
                            {
                              data: Object.values(age),
                              backgroundColor: [
                                "rgba(54, 162, 235, 0.2)",

                                "rgba(255, 206, 86, 0.2)",
                                "rgba(255, 99, 132, 0.2)",
                                "rgba(75, 192, 192, 0.2)",
                                "rgba(153, 102, 255, 0.2)",
                                "rgba(255, 159, 64, 0.2)",
                              ],
                              borderColor: [
                                "rgba(54, 162, 235, 1)",

                                "rgba(255, 206, 86, 1)",
                                "rgba(255, 99, 132, 1)",
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
                          scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                        }}
                      />
                    </div>
                    {/* /.card-body */}
                  </div>
                  {/* /.card */}
                  {/* Calendar */}

                  {/* /.card */}
                </section>
                {/* right col */}
              </div>
              {/* /.row (main row) */}
            </div>
            {/* /.container-fluid */}
          </section>
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
      <Footer />
    </div>
  );
};

AdminDashboard.propTypes = {
  getPatients: PropTypes.func.isRequired,
  getTests: PropTypes.func.isRequired,
  patient: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  test: PropTypes.object.isRequired,
  getUsers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  patient: state.patient,
  auth: state.auth,
  test: state.test,
  users: state.users,
});
export default connect(mapStateToProps, {
  getPatients,
  getTests,
  getUsers,
})(AdminDashboard);
