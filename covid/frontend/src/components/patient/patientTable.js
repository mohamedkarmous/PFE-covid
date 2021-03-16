import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPatients, deletePatient, getPatient } from "../../actions/patient";
import { loadUser } from "../../actions/auth";
import { Link, Redirect } from "react-router-dom";
import DataTable, { createTheme } from "react-data-table-component";
import { useHistory } from "react-router-dom";

//react grid table importation
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const PatientTable = ({
  getPatients,
  getPatient,
  deletePatient,
  patient: { patients, loading },
  auth: { user },
}) => {
  useEffect(() => {
    getPatients(user.id);
  }, []);
  let history = useHistory();

  function remove(e, id) {
    deletePatient(id.id);
    setTimeout(() => {
      getPatients(user.id);
    }, 500);
  }

  //react grid table

  const [rowData, setRowData] = useState(patients);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi.columnApi);
    console.log(params.columnApi);
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
    if (e.value == "Infected") {
      //mark police cells as red
      return { backgroundColor: "#f08080" };
    } else if (e.value == "Not infected") {
      //mark police cells as red
      return { backgroundColor: "#90ee90" };
    } else if (e.value == "Recovered") {
      //mark police cells as red
      return { backgroundColor: "#ffa07a" };
      return null;
    }
  };
  const onFirstDataRendered = (params) => {
    var createRangeChartParams = {
      cellRange: {
        rowStartIndex: 0,
        rowEndIndex: 79,
        columns: ["age", "covid19"],
      },
      chartType: "groupedColumn",
      chartContainer: document.querySelector("#myChart"),
      aggFunc: "sum",
    };
    params.api.createRangeChart(createRangeChartParams);
  };
  const updateButton = (props) => {
    return (
      <Link
        to="/updatePatient"
        class="btn btn-block btn-secondary"
        style={{ width: "30px", borderRadius: "4px", height: "30px" }}
        onClick={(e) => {
          getPatient(props.data);
        }}>
        <ion-icon style={{ "font-size": "20px" }} name="create"></ion-icon>
      </Link>
    );
  };
  const deleteButton = (props) => {
    return (
      <button
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

  return (
    <div>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          rowData={patients}
          onFirstDataRendered={onFirstDataRendered}
          onGridReady={onGridReady}
          sideBar={"filters"}
          // rowSelection="multiple"
          pagination={true}
          paginationPageSize={10}
          frameworkComponents={{ update: updateButton, delete: deleteButton }}
          enableCharts={true}>
          <AgGridColumn
            field="id"
            sortable={true}
            filter={true}
            //checkboxSelection={true}
            width={80}></AgGridColumn>
          <AgGridColumn
            headerName="First name"
            field="first_name"
            sortable={true}
            filter={true}
            floatingFilter={true}
            width={150}></AgGridColumn>
          <AgGridColumn
            headerName="Last name"
            field="last_name"
            sortable={true}
            filter={true}
            floatingFilter={true}
            width={150}></AgGridColumn>
          <AgGridColumn
            headerName="Age"
            field="age"
            sortable={true}
            filter={true}
            floatingFilter={true}
            width={90}></AgGridColumn>
          <AgGridColumn
            field="sex"
            sortable={true}
            filter={true}
            width={80}></AgGridColumn>
          <AgGridColumn
            field="covid19"
            sortable={true}
            filter={true}
            width={115}
            floatingFilter={true}
            cellStyle={(e) => dynamicCellStyleCovid(e)}></AgGridColumn>
          <AgGridColumn
            field="city"
            sortable={true}
            filter={true}
            floatingFilter={true}
            width={120}></AgGridColumn>
          <AgGridColumn
            field="governorate"
            sortable={true}
            filter={true}
            floatingFilter={true}
            width={130}></AgGridColumn>
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
  );
};

PatientTable.propTypes = {
  getPatients: PropTypes.func.isRequired,
  patient: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePatient: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  patient: state.patient,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getPatients,
  deletePatient,
  getPatient,
})(PatientTable);
