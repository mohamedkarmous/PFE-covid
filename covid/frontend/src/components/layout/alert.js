import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
toast.configure();

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => {
    switch (alert.alertType) {
      case "success":
        toast.success(alert.msg, {
          toastId: alert.id,
        });
        break;

      case "danger":
        toast.error(alert.msg, {
          toastId: alert.id,
        });
        break;
      case "warning":
        toast.warn(alert.msg, {
          toastId: alert.id,
        });
        break;

      default:
        break;
    }
  });

/////////////////////////////////////////////////////////
Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};
const mapStateToProps = (state) => ({
  alerts: state.alert,
});
export default connect(mapStateToProps)(Alert);
