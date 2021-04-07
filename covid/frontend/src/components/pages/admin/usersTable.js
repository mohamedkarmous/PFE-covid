import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUsers, getUser, deleteUser } from "../../../actions/users";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

import Modal from "react-modal";

//react grid table importation
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const UsersTable = ({
  getUsers,
  getUser,
  deleteUser,
  users: { users },
  auth: { user, loading },
}) => {
  useEffect(() => {
    testAdmin();
  }, [loading]);
  let history = useHistory();

  const testAdmin = () => {
    if (!loading) {
      if (!user.is_admin) {
        history.push("/");
      }
      getUsers();
    }
  };

  const [rowData, setRowData] = useState(users);
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
    if (!e.value) {
      return { backgroundColor: "#f08080" }; //red
    } else if (e.value) {
      return { backgroundColor: "#90ee90" }; //green
    } else {
      return null;
    }
  };

  const updateButton = (props) => {
    return (
      <Link
        to="/updateUser"
        class="btn btn-block btn-secondary"
        style={{ width: "30px", borderRadius: "4px", height: "30px" }}
        onClick={(e) => {
          getUser(props.data);
        }}>
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

  var subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  function confirmDelete() {
    deleteUser(selected.id);
  }

  return (
    <div>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          rowData={users.filter((p) => p.id !== user.id)}
          onGridReady={onGridReady}
          // rowSelection="multiple"
          pagination={true}
          paginationPageSize={10}
          frameworkComponents={{ update: updateButton, delete: deleteButton }}>
          <AgGridColumn
            field="id"
            sortable={true}
            filter={true}
            //checkboxSelection={true}
            width={80}></AgGridColumn>
          <AgGridColumn
            headerName="Username"
            field="username"
            sortable={true}
            filter={true}
            floatingFilter={true}
            width={90}></AgGridColumn>
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
            headerName="Email"
            field="email"
            sortable={true}
            filter={true}
            floatingFilter={true}
            width={200}></AgGridColumn>
          <AgGridColumn
            field="is_doctor"
            sortable={true}
            filter={true}
            width={115}
            cellStyle={(e) => dynamicCellStyleCovid(e)}></AgGridColumn>
          <AgGridColumn
            field="is_admin"
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
                    Yes delete this user
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

UsersTable.propTypes = {
  getUsers: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  users: state.users,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getUsers,
  getUser,
  deleteUser,
})(UsersTable);
