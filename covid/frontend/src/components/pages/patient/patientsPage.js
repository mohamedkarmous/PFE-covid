import React, { Component } from "react";
import Navbar from "../../layout/Navbar";
import SideBar from "../../layout/SideBar";
import PatientTable from "./patientTable";
import { Link, Redirect } from "react-router-dom";
import Footer from "../../layout/Footer";

const patientsPage = () => {
  return (
    <div>
      <SideBar />
      <div class="content-wrapper">
        <div>
          {/* Content Header (Page header) */}
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>DataTables</h1>
                </div>
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right"></ol>
                </div>
              </div>
            </div>
            {/* /.container-fluid */}
          </section>
          {/* Main content */}
          <section className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Patients data</h3>
                      <Link
                        className="btn btn-primary"
                        to="/addPatient"
                        style={{
                          width: "150px",
                          marginLeft: "85%",
                          marginTop: "-3%",
                        }}>
                        Add Patient
                      </Link>
                    </div>
                    {/* /.card-header */}
                    <div className="card-body">
                      <PatientTable />
                    </div>
                    {/* /.card-body */}
                  </div>
                  {/* /.card */}
                </div>
                {/* /.col */}
              </div>
              {/* /.row */}
            </div>
            {/* /.container-fluid */}
          </section>
          {/* /.content */}
          {/* /.content-wrapper */}
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default patientsPage;
