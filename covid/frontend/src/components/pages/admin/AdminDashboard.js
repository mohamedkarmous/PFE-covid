import React from "react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getPatients } from "../../../actions/patient";
import { getTests } from "../../../actions/test";
import { getUsers } from "../../../actions/users";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { TN } from "../../../utils/LocalVariables";
import ReactMapGL, {
  Marker,
  Source,
  Layer,
  GeolocateControl,
} from "react-map-gl";
//import "mapbox-gl/dist/mapbox-gl.css";
import { mapboxTOKEN } from "../../../utils/LocalVariables";

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
      testAdmin();
      setDash();
    }, [loading]);

    const setDash = () => {
      if (!loading) {
        getPatients();
        getTests();
        getUsers();
      }
    };
  }
  let history = useHistory();
  const testAdmin = () => {
    if (!loading) {
      if (!user.is_admin) {
        history.push("/");
      }
    }
  };

  const cityToCoordinates = (city) => {
    return TN[city];
  };

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
  ////////////////////////////////////////////// Tests ///////////////////////////////////////
  function makeTestsdata(x) {
    let dict = {};
    tests.forEach((element) => {
      dict[element.date_added] = 0;
    });
    tests.forEach((element) => {
      if (element.result[0] == x) {
        dict[element.date_added] = dict[element.date_added] + 1;
      }
    });

    return dict;
  }
  const InfectedTests = makeTestsdata("C");
  const NotInfectedTests = makeTestsdata("N");
  const PneumoniaTests = makeTestsdata("P");

  //////////////////////////////////////////

  ////////////////////////////////////////////// infection by cities///////////////////////////////////////
  function makeInfectedCity(x) {
    let dict = {};
    patients.forEach((element) => {
      dict[element.city] = 0;
    });
    patients.forEach((element) => {
      if (element.covid19 == x) {
        dict[element.city] = dict[element.city] + 1;
      }
    });

    return dict;
  }
  const InfectedCity = makeInfectedCity("Covid19");
  const RecoveredCity = makeInfectedCity("Recovered");
  const NotInfectedCity = makeInfectedCity("Not infected");
  const PneumoniaCity = makeInfectedCity("Pneumonia");
  const UnknownCity = makeInfectedCity("Unknown");
  //////////////////////////////////////////
  ////////////////////////////////////////////// infection by sex///////////////////////////////////////
  function makeInfectedSex(x) {
    let dict = {};
    patients.forEach((element) => {
      dict[element.sex] = 0;
    });
    patients.forEach((element) => {
      if (element.covid19 == x) {
        dict[element.sex] = dict[element.sex] + 1;
      }
    });

    return dict;
  }
  const InfectedSex = makeInfectedSex("Covid19");
  const RecoveredSex = makeInfectedSex("Recovered");
  const NotInfectedSex = makeInfectedSex("Not infected");
  const PneumoniaSex = makeInfectedSex("Pneumonia");
  const UnknownSex = makeInfectedSex("Unknown");
  //////////////////////////////////////////
  ////////////////////////////infection by age////////////////////////////////////////////
  function makeInfectedAge(x) {
    let dict = {};
    patients.forEach((element) => {
      dict[element.age] = 0;
    });
    patients.forEach((element) => {
      if (element.covid19 == x) {
        dict[element.age] = dict[element.age] + 1;
      }
    });

    return dict;
  }
  const InfectedAge = makeInfectedAge("Covid19");
  const RecoveredAge = makeInfectedAge("Recovered");
  const NotInfectedAge = makeInfectedAge("Not infected");
  const PneumoniaAge = makeInfectedAge("Pneumonia");
  const UnknownAge = makeInfectedAge("Unknown");

  //////////////////////////////////////////////////////////////////////////////////////
  const age = makeAgeData();

  const makeCovidData = () => {
    var result = patients.reduce(
      (acc, o) => ((acc[o.covid19] = (acc[o.covid19] || 0) + 1), acc),
      {}
    );
    return result;
  };
  const covid = makeCovidData();

  const makeAdmins = () => {
    let count = 0;
    users.forEach((i) => {
      if (i.is_admin == true) {
        count = count + 1;
      }
    });
    return count;
  };
  const numberOfAdmins = makeAdmins();
  const makeDoctors = () => {
    let count = 0;
    users.forEach((i) => {
      if (i.is_doctor == true) {
        count = count + 1;
      }
    });
    return count;
  };
  const numberOfDoctors = makeDoctors();

  /////////////////////////////////map data/////////////////////////////////////////
  const makeMapData = () => {
    let list = [];

    patients.forEach((element) => {
      if (element.covid19 == "Covid19") {
        let lat = cityToCoordinates(element.city)[1];
        let log = cityToCoordinates(element.city)[0];
        list.push({
          type: "Feature",
          geometry: { type: "Point", coordinates: [lat, log] },
        });
      }
    });
    return list;
  };

  const geolocateControlStyle = {
    right: 5,
    top: 5,
  };
  const geojson = {
    type: "FeatureCollection",
    features: makeMapData(),
  };

  const [viewport, setViewport] = useState({
    latitude: 33.8439408,
    longitude: 9.400138,
    zoom: 5,
    width: "100%",
    height: "100%",
  });
  const mapboxtoken = mapboxTOKEN;

  const clusterLayer = {
    id: "clusters",
    type: "circle",
    source: "my_data",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        //100,
        1,
        "#f1f075",
        //750,
        2,
        "#f28cb1",
        3,
        "#b300b3",
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    },
  };

  const clusterCountLayer = {
    id: "cluster-count",
    type: "symbol",
    source: "my_data",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  };

  const unclusteredPointLayer = {
    id: "unclustered-point",
    type: "circle",
    source: "my_data",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  };
  ////////////////maap code ends //////////////////////////////////////////////////////////////

  return (
    <div>
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
                      <Link to="/dashboard">Home</Link>
                    </li>
                    <li className="breadcrumb-item active">Admin Dashboard</li>
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
                      <p>Patients </p>
                    </div>

                    <Link to="/allPatients" className="small-box-footer">
                      More info <i className="fas fa-arrow-circle-right" />
                    </Link>
                  </div>
                </div>
                {/* ./col */}
                <div className="col-lg-3 col-6">
                  {/* small box */}
                  <div className="small-box bg-info">
                    <div className="inner">
                      <h3>{numberOfAdmins}</h3>
                      <p>Admins</p>
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
                      <h3>{numberOfDoctors}</h3>
                      <p>Doctors</p>
                    </div>

                    <Link to="/users" className="small-box-footer">
                      More info <i className="fas fa-arrow-circle-right" />
                    </Link>
                  </div>
                </div>
                {/* ./col */}

                <div className="col-lg-3 col-6">
                  {/* small box */}
                  <div className="small-box bg-danger">
                    <div className="inner">
                      <h3>{tests.length}</h3>
                      <p>Xray-images</p>
                    </div>

                    <Link to="/allTests" className="small-box-footer">
                      More info <i className="fas fa-arrow-circle-right" />
                    </Link>
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
                              Cities
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              href="#sales-chart"
                              data-toggle="tab">
                              Cases
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
                          style={{ position: "relative", height: 500 }}>
                          <Bar
                            data={{
                              labels: Object.keys(InfectedCity),
                              datasets: [
                                {
                                  label: "Covid19",
                                  data: Object.values(InfectedCity),
                                  backgroundColor: "#ff8080",
                                  borderColor: "#ff8080",
                                  borderWidth: 1,
                                },
                                {
                                  label: "Pneumonia",
                                  data: Object.values(PneumoniaCity),
                                  backgroundColor: "#ffa07a",
                                  borderColor: "#ffa07a",
                                  borderWidth: 1,
                                },
                                {
                                  label: "Not infected",
                                  data: Object.values(NotInfectedCity),
                                  backgroundColor: "#90ee90",
                                  borderColor: "#90ee90",
                                  borderWidth: 1,
                                },
                                {
                                  label: "Recoverd",
                                  data: Object.values(RecoveredCity),
                                  backgroundColor: "#e6e600",
                                  borderColor: "#e6e600",

                                  borderWidth: 1,
                                },
                              ],
                            }}
                            width={100}
                            height={100}
                            options={{
                              responsive: true,
                              interaction: {
                                intersect: false,
                              },
                              maintainAspectRatio: false,
                              scales: {
                                xAxes: [
                                  {
                                    stacked: true,
                                  },
                                ],

                                yAxes: [
                                  {
                                    stacked: true,
                                    ticks: { beginAtZero: true },
                                  },
                                ],
                              },
                            }}
                          />
                        </div>
                        <div
                          className="chart tab-pane"
                          id="sales-chart"
                          style={{ position: "relative", height: 500 }}>
                          <Pie
                            data={{
                              labels: Object.keys(covid),
                              datasets: [
                                {
                                  label: "covid",
                                  data: Object.values(covid),
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
                      </div>
                    </div>
                    {/* /.card-body */}
                  </div>
                  {/* /.card */}
                  <div className="card card-danger">
                    <div className="card-header">
                      <h3 className="card-title">Map</h3>
                      <div className="card-tools">
                        <button
                          type="button"
                          className="btn btn-tool"
                          data-card-widget="collapse">
                          <i className="fas fa-minus" />
                        </button>
                      </div>
                    </div>
                    <div className="card-body" style={{ height: "600px" }}>
                      <div className="chartjs-size-monitor">
                        <div className="chartjs-size-monitor-expand">
                          <div className />
                        </div>
                        <div className="chartjs-size-monitor-shrink">
                          <div className />
                        </div>
                      </div>
                      <ReactMapGL
                        {...viewport}
                        mapboxApiAccessToken={mapboxtoken}
                        onViewportChange={(nextViewport) =>
                          setViewport(nextViewport)
                        }
                        mapStyle="mapbox://styles/mohamed-karmous/ckmz4yiq30q7r17p07wblfzfm">
                        {() => <Marker></Marker>}
                        <Source
                          id="my_data"
                          type="geojson"
                          data={geojson}
                          cluster={true}
                          clusterMaxZoom={14}
                          clusterRadius={50}></Source>
                        <Layer {...clusterLayer} />
                        <Layer {...clusterCountLayer} />
                        <Layer {...unclusteredPointLayer} />
                        <GeolocateControl
                          style={geolocateControlStyle}
                          positionOptions={{ enableHighAccuracy: false }}
                          trackUserLocation={false}
                          showAccuracyCircle={false}
                          showUserLocation={true}
                          fitBoundsOptions={{ maxZoom: 8 }}
                          //auto
                        />
                      </ReactMapGL>
                    </div>
                    {/* /.card-body */}
                  </div>
                </section>
                {/* /.Left col */}
                {/* right col (We are only adding the ID to make the widgets sortable)*/}
                <section className="col-lg-5 connectedSortable">
                  <div className="card card-info">
                    <div className="card-header">
                      <h3 className="card-title">Distribution by age</h3>
                      <div className="card-tools">
                        <button
                          type="button"
                          className="btn btn-tool"
                          data-card-widget="collapse">
                          <i className="fas fa-minus" />
                        </button>
                      </div>
                    </div>
                    <div className="card-body" style={{ height: "500px" }}>
                      <div className="chartjs-size-monitor">
                        <div className="chartjs-size-monitor-expand">
                          <div className />
                        </div>
                        <div className="chartjs-size-monitor-shrink">
                          <div className />
                        </div>
                      </div>
                      <Bar
                        data={{
                          labels: Object.keys(InfectedAge),
                          datasets: [
                            {
                              label: "Covid19",
                              data: Object.values(InfectedAge),
                              backgroundColor: "#ff8080",
                              borderColor: "#ff8080",
                              borderWidth: 1,
                            },
                            {
                              label: "Pneumonia",
                              data: Object.values(PneumoniaAge),
                              backgroundColor: "#ffa07a",
                              borderColor: "#ffa07a",
                              borderWidth: 1,
                            },
                            {
                              label: "Not infected",
                              data: Object.values(NotInfectedAge),
                              backgroundColor: "#90ee90",
                              borderColor: "#90ee90",
                              borderWidth: 1,
                            },
                            {
                              label: "Recoverd",
                              data: Object.values(RecoveredAge),
                              backgroundColor: "#e6e600",
                              borderColor: "#e6e600",

                              borderWidth: 1,
                            },
                          ],
                        }}
                        width={100}
                        height={100}
                        options={{
                          responsive: true,
                          interaction: {
                            intersect: false,
                          },
                          maintainAspectRatio: false,

                          scales: {
                            xAxes: [
                              {
                                stacked: true,
                              },
                            ],

                            yAxes: [
                              {
                                stacked: true,
                                ticks: { beginAtZero: true },
                              },
                            ],
                          },
                        }}
                      />
                    </div>
                    {/* /.card-body */}
                  </div>
                  {/* /.card */}
                  <div className="card card-info">
                    <div className="card-header">
                      <h3 className="card-title">Distribution by gender</h3>
                      <div className="card-tools">
                        <button
                          type="button"
                          className="btn btn-tool"
                          data-card-widget="collapse">
                          <i className="fas fa-minus" />
                        </button>
                      </div>
                    </div>
                    <div className="card-body" style={{ height: "350px" }}>
                      <div className="chartjs-size-monitor">
                        <div className="chartjs-size-monitor-expand">
                          <div className />
                        </div>
                        <div className="chartjs-size-monitor-shrink">
                          <div className />
                        </div>
                      </div>
                      <Bar
                        data={{
                          labels: Object.keys(InfectedSex),
                          datasets: [
                            {
                              label: "Covid19",
                              data: Object.values(InfectedSex),
                              backgroundColor: "#ff8080",
                              borderColor: "#ff8080",
                              borderWidth: 1,
                            },
                            {
                              label: "Pneumonia",
                              data: Object.values(PneumoniaSex),
                              backgroundColor: "#ffa07a",
                              borderColor: "#ffa07a",
                              borderWidth: 1,
                            },
                            {
                              label: "Not infected",
                              data: Object.values(NotInfectedSex),
                              backgroundColor: "#90ee90",
                              borderColor: "#90ee90",
                              borderWidth: 1,
                            },
                            {
                              label: "Recoverd",
                              data: Object.values(RecoveredSex),
                              backgroundColor: "#e6e600",
                              borderColor: "#e6e600",

                              borderWidth: 1,
                            },
                          ],
                        }}
                        width={100}
                        height={100}
                        options={{
                          responsive: true,
                          interaction: {
                            intersect: false,
                          },
                          maintainAspectRatio: false,

                          scales: {
                            xAxes: [
                              {
                                stacked: true,
                              },
                            ],

                            yAxes: [
                              {
                                stacked: true,
                                ticks: { beginAtZero: true },
                              },
                            ],
                          },
                        }}
                      />
                    </div>
                    {/* /.card-body */}
                  </div>
                  {/* /.card */}

                  {/* line chart */}
                  <div className="card card-info">
                    <div className="card-header">
                      <h3 className="card-title">Tests distribution by date</h3>
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
                      <Line
                        data={{
                          labels: Object.keys(InfectedTests).sort(),
                          datasets: [
                            {
                              label: "Covid19",
                              data: Object.values(InfectedTests).reverse(),
                              backgroundColor: "#ff8080",
                              borderColor: "#ff8080",
                              borderWidth: 1,
                            },
                            {
                              label: "Pneumonia",
                              data: Object.values(PneumoniaTests).reverse(),
                              backgroundColor: "#ffa07a",
                              borderColor: "#ffa07a",
                              borderWidth: 1,
                            },
                            {
                              label: "Not infected",
                              data: Object.values(NotInfectedTests).reverse(),
                              backgroundColor: "#90ee90",
                              borderColor: "#90ee90",
                              borderWidth: 1,
                            },
                          ],
                        }}
                        width={100}
                        height={100}
                        options={{
                          responsive: true,
                          interaction: {
                            intersect: false,
                          },
                          maintainAspectRatio: false,

                          scales: {
                            xAxes: [
                              {
                                //stacked: true,
                              },
                            ],

                            yAxes: [
                              {
                                //stacked: true,
                                ticks: { beginAtZero: true },
                              },
                            ],
                          },
                        }}
                      />
                    </div>
                    {/* /.card-body */}
                  </div>
                  {/* /.card */}

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
