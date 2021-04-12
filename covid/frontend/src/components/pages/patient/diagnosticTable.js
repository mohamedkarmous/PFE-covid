import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getDiagnostics,
  deleteDiagnostic,
  updateDiagnostic,
  sendDiagnostic,
} from "../../../actions/diagnostic";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

import Modal from "react-modal";

//react grid table importation
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { GET_DIAGNOSTICS } from "../../../actions/types";

const DiagnosticTable = ({
  auth: { user, loading },
  patient: { patient },
  diagnostic: { diagnostics },
  sendDiagnostic,
  getDiagnostics,
  deleteDiagnostic,
  updateDiagnostic,
}) => {
  useEffect(() => {
    testDoctor();
  }, [user]);
  let history = useHistory();

  const testDoctor = () => {
    if (user) {
      if (!user.is_doctor) {
        history.push("/");
      }
    }
  };

  //react grid table

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  var [selected, setSelected] = React.useState(null);

  function remove(e, id) {
    setSelected((selected = id));
    /*
    //openModal();
    //deletePatient(id.id);
    setTimeout(() => {
      getPatients(user.id);
    }, 500);
    */
  }

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi.columnApi);

    /*
    var allColumnIds = [];
    gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    console.log(allColumnIds);
    gridColumnApi.autoSizeColumns(allColumnIds, true);
    */
  };

  const dynamicCellStyleCovid = (e) => {
    if (e.value[0] == "C") {
      return { backgroundColor: "#f08080" };
    } else if (e.value[0] == "N") {
      return { backgroundColor: "#90ee90" };
    }
  };

  const updateButton = (props) => {
    return (
      <Link
        to="/updatePatient"
        class="btn btn-block btn-secondary"
        style={{ width: "30px", borderRadius: "4px", height: "30px" }}
        onClick={(e) => {}}>
        <ion-icon style={{ "font-size": "20px" }} name="create"></ion-icon>
      </Link>
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

  //////modal

  function confirmDelete() {
    deleteDiagnostic(selected.id);
  }

  return (
    <div>
      <div className="ag-theme-alpine" style={{ height: 700, width: "100%" }}>
        <AgGridReact
          rowData={diagnostics}
          onGridReady={onGridReady}
          sideBar={"filters"}
          // rowSelection="multiple"
          pagination={true}
          paginationPageSize={20}
          frameworkComponents={{ update: updateButton, delete: deleteButton }}
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
            width={150}></AgGridColumn>
          <AgGridColumn
            headerName="fever"
            field="fever"
            sortable={true}
            filter={true}
            floatingFilter={true}
            width={150}></AgGridColumn>
          <AgGridColumn
            headerName="sore throat"
            field="sore_throat"
            sortable={true}
            filter={true}
            floatingFilter={true}
            width={90}></AgGridColumn>
          <AgGridColumn
            headerName="date added"
            field="date_added"
            sortable={true}
            filter={true}
            width={90}></AgGridColumn>
          <AgGridColumn
            field="result"
            sortable={true}
            filter={true}
            width={115}
            floatingFilter={true}
            cellStyle={(e) => dynamicCellStyleCovid(e)}></AgGridColumn>

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
                    Yes delete this diagnostic
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
};

DiagnosticTable.propTypes = {
  getDiagnostics: PropTypes.func.isRequired,
  diagnostic: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  patient: PropTypes.object.isRequired,
  deleteDiagnostic: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  diagnostic: state.patient,
  auth: state.auth,
  patient: state.patient,
});

export default connect(mapStateToProps, {
  getDiagnostics,
  deleteDiagnostic,
  updateDiagnostic,
  sendDiagnostic,
})(DiagnosticTable);
