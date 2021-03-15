import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => {
    switch (alert.alertType) {
      case "success":
        return (
          <div key={alert.id}>
            <button
              type="button"
              class="btn btn-success"
              data-toggle="modal"
              data-target="#modal-danger"
              style={{ "text-align": "center", width: "100%" }}>
              {alert.msg}
            </button>
          </div>
        );

      case "danger":
        return (
          <div key={alert.id}>
            <button
              type="button"
              class="btn btn-danger"
              data-toggle="modal"
              data-target="#modal-danger"
              style={{ "text-align": "center", width: "100%" }}>
              {alert.msg}
            </button>
          </div>
        );

      default:
        return (
          <div key={alert.id}>
            <button
              type="button"
              class="btn btn-danger"
              data-toggle="modal"
              data-target="#modal-danger"
              style={{ "text-align": "center", width: "100%" }}>
              {alert.msg}
            </button>
          </div>
        );
    }
  });

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};
const mapStateToProps = (state) => ({
  alerts: state.alert,
});
export default connect(mapStateToProps)(Alert);
