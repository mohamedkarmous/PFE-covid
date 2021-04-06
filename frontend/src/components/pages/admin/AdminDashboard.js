import React from "react";
import Navbar from "../../layout/Navbar";
import SideBar from "../../layout/SideBar";
import Footer from "../../layout/Footer";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getPatients } from "../../../actions/patient";
import { getTests } from "../../../actions/test";
import { getUsers } from "../../../actions/users";
import { Bar, Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import ReactMapGL, {
  Marker,
  Source,
  Layer,
  GeolocateControl,
} from "react-map-gl";
import { v4 as uuid } from "uuid";
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
  const TN = {
    Tunis: [36.8008, 10.18],
    Sfax: [34.75, 10.72],
    Sousse: [35.83, 10.625],
    Gabès: [33.9004, 10.1],
    Kairouan: [35.6804, 10.1],
    Bizerte: [37.2904, 9.855],
    Gafsa: [34.4204, 8.78],
    Nabeul: [36.4603, 10.73],
    Ariana: [36.8667, 10.2],
    Kasserine: [35.1804, 8.83],
    Monastir: [35.7307, 10.7673],
    Tataouine: [33.0, 10.4667],
    Medenine: [33.4, 10.4167],
    Béja: [36.7304, 9.19],
    Jendouba: [36.5, 8.75],
    "El Kef": [36.1826, 8.7148],
    Mahdia: [35.4839, 11.0409],
    "Sidi Bouzid": [35.0167, 9.5],
    Tozeur: [33.9304, 8.13],
    Siliana: [36.0833, 9.3833],
    Kebili: [33.69, 8.971],
    Zaghouan: [36.4, 10.147],
    "Ben Arous": [36.7545, 10.2217],
    Manouba: [36.8101, 10.0956],
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

  console.log("recoverd cities", RecoveredCity);

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
                      <a href="#">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Dashboard</li>
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
                    <div className="icon">
                      <i className="ion ion-person-add" />
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
                    <div className="icon">
                      <i className="ion ion-stats-bars" />
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
                    <div className="icon">
                      <i className="ion ion-stats-bars" />
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
                              Infection
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
                                yAxes: [
                                  {
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
                          <Bar
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
                  <div className="card card-danger">
                    <div className="card-header">
                      <h3 className="card-title">Chart</h3>
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
                      <Doughnut
                        data={{
                          labels: Object.keys(covid),
                          datasets: [
                            {
                              data: Object.values(covid),
                              backgroundColor: [
                                "rgba(54, 162, 235, 0.2)",
                                "rgba(255, 206, 86, 0.2)",
                                "rgba(255, 99, 132, 0.2)",
                                "rgba(75, 192, 192, 0.2)",
                                "rgba(153, 102, 255, 0.2)",
                                "rgba(255, 159, 64, 0.2)",
                              ],
                              borderColor: [
                                "rgba(54, 162, 235, 1)",

                                "rgba(255, 206, 86, 1)",
                                "rgba(255, 99, 132, 1)",
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
                          scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                        }}
                      />
                    </div>
                  </div>
                </section>
                {/* /.Left col */}
                {/* right col (We are only adding the ID to make the widgets sortable)*/}
                <section className="col-lg-5 connectedSortable">
                  <div className="card card-info">
                    <div className="card-header">
                      <h3 className="card-title">Cities</h3>
                      <div className="card-tools">
                        <button
                          type="button"
                          className="btn btn-tool"
                          data-card-widget="collapse">
                          <i className="fas fa-minus" />
                        </button>
                      </div>
                    </div>
                    <div className="card-body" style={{ height: "400px" }}>
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
                          labels: Object.keys(InfectedCity),
                          datasets: [
                            {
                              label: "Covid19",
                              data: Object.values(InfectedCity),
                              backgroundColor: "#ff8080",
                              borderColor: "#ff3333",
                              borderWidth: 1,
                            },
                            {
                              label: "Recoverd",
                              data: Object.values(RecoveredCity),
                              backgroundColor: "#85e085",
                              borderColor: "#33cc33",

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
                            xAxes: {
                              stacked: true,
                            },
                            y: {
                              stacked: true,
                            },
                            yAxes: [
                              { stacked: true, ticks: { beginAtZero: true } },
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
                      <h3 className="card-title">Age</h3>
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
                      <Doughnut
                        data={{
                          labels: Object.keys(age),
                          datasets: [
                            {
                              data: Object.values(age),
                              backgroundColor: [
                                "rgba(54, 162, 235, 0.2)",

                                "rgba(255, 206, 86, 0.2)",
                                "rgba(255, 99, 132, 0.2)",
                                "rgba(75, 192, 192, 0.2)",
                                "rgba(153, 102, 255, 0.2)",
                                "rgba(255, 159, 64, 0.2)",
                              ],
                              borderColor: [
                                "rgba(54, 162, 235, 1)",

                                "rgba(255, 206, 86, 1)",
                                "rgba(255, 99, 132, 1)",
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
                          scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
                        }}
                      />
                    </div>
                    {/* /.card-body */}
                  </div>
                  {/* /.card */}

                  {/* Calendar */}

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
