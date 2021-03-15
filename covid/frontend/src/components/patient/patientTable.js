import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPatients, deletePatient, getPatient } from "../../actions/patient";
import { loadUser } from "../../actions/auth";
import { Link, Redirect } from "react-router-dom";
import DataTable, { createTheme } from "react-data-table-component";
import { useHistory } from "react-router-dom";

const ExpandableComponent = ({ data }) => (
  <img
    src={data.patient_picture.replace(
      "http://localhost:8000/api/patient/frontend/public",
      "."
    )}
    style={{ width: "400px", height: "400px" }}
  />
);

//conditional row style
const conditionalRowStyles = [
  {
    when: (row) => row.covid19 === "Infected",
    style: {
      backgroundColor: "#ff9999",
      color: "black",
      "&:hover": {
        cursor: "pointer",
      },
    },
  },
  {
    when: (row) => row.covid19 === "Recovered",
    style: {
      backgroundColor: "#ffff99",

      color: "black",
      "&:hover": {
        cursor: "pointer",
      },
    },
  },
  {
    when: (row) => row.covid19 === "Not infected",
    style: {
      backgroundColor: "#99ffbb",

      color: "black",
      "&:hover": {
        cursor: "pointer",
      },
    },
  },
  // You can also pass a callback to style for additional customization
  /*
  {
    when: row => row.covid19 ==='Infected',
    style: row => ({
      backgroundColor: row.isSpecia ? 'pink' : 'inerit',
    }),
  },
  */
];

//theme of table
createTheme("solarized", {
  text: {
    //primary: "#268bd2",
    //secondary: "#2aa198",
  },
  /*
    background: {
      default: "#002b36",
    },
    context: {
      background: "#cb4b16",
      text: "#FFFFFF",
    },

    action: {
      button: "rgba(0,0,0,.54)",
      hover: "rgba(0,0,0,.08)",
      disabled: "rgba(0,0,0,.12)",
    },
    */
  divider: {
    default: "#073642",
    header: {
      style: {
        minHeight: "56px",
      },
    },
  },
});

const PatientTable = ({
  getPatients,
  getPatient,
  deletePatient,
  patient: { patients, loading },
  auth: { user },
}) => {
  useEffect(() => {
    getPatients(user.id);
  }, [getPatients]);
  let history = useHistory();

  const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <>
      <div className="input-group">
        <input
          className="form-control"
          id="search"
          type="text"
          placeholder="Filter"
          aria-label="Search Input"
          value={filterText}
          onChange={onFilter}
        />
        <button
          className="btn btn-md btn-gradient-danger"
          id="search-btn"
          type="button"
          onClick={onClear}>
          Clear
        </button>
      </div>
    </>
  );

  const [filterText, setFilterText] = React.useState("");

  const filteredItems = patients.filter(
    (item) =>
      (item.first_name &&
        item.first_name.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.last_name &&
        item.last_name.toLowerCase().includes(filterText.toLowerCase()))
  );
  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        //setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };
    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText]);

  const columns = React.useMemo(() => [
    {
      name: "Id",
      selector: "id",
      sortable: true,
      id: true,
    },
    {
      name: "first name",
      selector: "first_name",
      sortable: true,
    },

    {
      name: "Last name",
      selector: "last_name",
      sortable: true,
    },
    {
      name: "Age",
      selector: "age",
      sortable: true,
    },
    /*
    {
      name: "Date of birth",
      selector: "date_of_birth",
      sortable: true,
    },
    */
    {
      name: "Sex",
      selector: "sex",
      sortable: true,
    },
    {
      name: "Covid-19",
      selector: "covid19",
      sortable: true,
    },

    {
      name: "City",
      selector: "city",
      sortable: true,
    },
    {
      name: "Governorate",
      selector: "governorate",
      sortable: true,
    },

    {
      name: "Actions",
      button: true,
      cell: (id) => (
        <div class="row">
          <Link
            to="/updatePatient"
            class="btn btn-block btn-secondary"
            style={{ width: "30px", borderRadius: "4px", height: "30px" }}
            onClick={(e) => {
              getPatient(id);
              update(e, id, history);
            }}>
            <ion-icon style={{ "font-size": "20px" }} name="create"></ion-icon>
          </Link>
          <div style={{ padding: "1px" }} />
          <button
            type="button"
            class="btn btn-block btn-secondary"
            style={{ width: "30px", borderRadius: "4px", height: "30px" }}
            onClick={(e) => remove(e, id)}>
            <ion-icon
              style={{ "font-size": "20px" }}
              name="trash-outline"></ion-icon>
          </button>
        </div>
      ),
    },
  ]);

  function remove(e, id) {
    deletePatient(id.id);
    setTimeout(() => {
      getPatients(user.id);
    }, 500);
  }
  function update(e, id) {
    /*
    setTimeout(() => {
      getPatients();
    }, 500);
    */
  }

  const handleChange = (state) => {
    // You can use setState or dispatch with something like Redux so we can use the retrieved data
    console.log("Selected Rows: ", state.selectedRows);
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={filteredItems}
        highlightOnHover={true}
        theme="solarized"
        pagination={true}
        selectableRows
        Clicked
        Selected={handleChange}
        center
        expandableRows
        //conditionalRowStyles={conditionalRowStyles}
        conditionalCellStyles={conditionalRowStyles}
        wrap
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        //dense //too compact
        expandableRowsComponent={<ExpandableComponent />}
      />
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
