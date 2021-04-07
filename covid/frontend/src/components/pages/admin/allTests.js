import React, { Component } from "react";
import Navbar from "../../layout/Navbar";
import SideBar from "../../layout/SideBar";
import Footer from "../../layout/Footer";
import { useEffect } from "react";
import { useState } from "react";

import { getTests, deleteTest, updateTest } from "../../../actions/test";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

//react grid table importation
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

function AllTests({
  auth: { user, loading },

  test: { tests },

  getTests,
  deleteTest,
  updateTest,
}) {
  let history = useHistory();

  useEffect(() => {
    setPage();
  }, [loading]);

  const testAdmin = () => {
    if (user) {
      if (!user.is_admin) {
        history.push("/");
      }
    }
  };
  function setPage() {
    testAdmin();
    if (!loading) {
      getTests();
    }
  }

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
      getTests(tests.id);
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

  return (
    <div>
      <SideBar />
      <div class="content-wrapper">
        <div>
          {/* Content Header (Page header) */}
          <section className="content-header">
            {/* /.container-fluid */}
          </section>
          {/* Main content */}
          <section className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Tests data</h3>
                    </div>
                    {/* /.card-header */}
                    <div className="card-body">
                      <div
                        className="ag-theme-alpine"
                        style={{ height: 3250, width: "100%" }}>
                        <AgGridReact
                          rowHeight={600}
                          rowData={tests}
                          //  onFirstDataRendered={onFirstDataRendered}
                          onGridReady={onGridReady}
                          sideBar={"filters"}
                          // rowSelection="multiple"
                          pagination={true}
                          paginationPageSize={5}
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
                    onClick={confirmDelete}
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
    </div>
  );
}
AllTests.protoTypes = {
  auth: PropTypes.object.isRequired,

  test: PropTypes.object.isRequired,

  getTests: PropTypes.func.isRequired,
  deleteTest: PropTypes.func.isRequired,
  updateTest: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,

  test: state.test,
});

export default connect(mapStateToProps, {
  getTests,
  deleteTest,
  updateTest,
})(AllTests);
