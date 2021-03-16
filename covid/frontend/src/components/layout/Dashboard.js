import React, { Component } from "react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getPatients } from "../../actions/patient";
import { Bar } from "react-chartjs-2";

import PropTypes from "prop-types";

const Dashboard = ({
  getPatients,
  patient: { patients, loading },
  auth: { user },
}) => {
  useEffect(() => {
    getPatients(user.id);
  }, []);
  const makeData = () => {
    var result = patients.reduce(
      (acc, o) => ((acc[o.sex] = (acc[o.sex] || 0) + 1), acc),
      {}
    );

    console.log(result);
    return result;
  };
  const age = makeData();

  return (
    <div class="content-wrapper">
      <Bar
        data={{
          labels: Object.keys(age),
          datasets: [{ data: Object.values(age) }],
        }}
        width={100}
        height={50}
        options={{
          maintainAspectRatio: false,
          scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
        }}
      />
    </div>
  );
};

Dashboard.propTypes = {
  getPatients: PropTypes.func.isRequired,
  patient: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  patient: state.patient,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getPatients,
})(Dashboard);
