import React, { Component } from "react";
import Navbar from "../layout/Navbar";
import SideBar from "../layout/SideBar";
import { useEffect } from "react";
import { useState } from "react";
import { add_patient } from "../../actions/patient";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

function AddPatient({ auth: { loading, user }, add_patient }) {
  var stateObject = {
    Tunisia: {
      Tunis: [
        "Tunis",
        "Le Bardo",
        "Le Kram",
        "	La Goulette",
        "Carthage",
        "Sidi Bou Said",
        "La Marsa",
        "Sidi Hassine",
      ],
      Ariana: [
        "Ariana",
        "La Soukra",
        "	Raoued",
        "Kalâat el-Andalous",
        "Sidi Thabet",
        "Ettadhamen-Mnihla",
      ],
      "Ben Arous": [
        "Ben Arous",
        "El Mourouj",
        "Hammam Lif",
        "Hammam Chott",
        "Bou Mhel el-Bassatine",
        "Ezzahra",
        "Radès",
        "Mégrine",
        "Mohamedia-Fouchana",
        "Mornag",
        "Khalidia",
      ],
      Manouba: [
        "Manouba",
        "Den Den",
        "Douar Hicher",
        "Oued Ellil",
        "Mornaguia",
        "Borj El Amri",
        "Djedeida",
        "Tebourba",
        "El Battan",
      ],
      Nabeul: [
        "Nabeul",
        "Dar Chaabane",
        "Béni Khiar",
        "El Maâmoura",
        "Somâa",
        "Korba",
        "Tazerka",
        "Menzel Temime",
        "Menzel Horr",
        "El Mida",
        "Kelibia",
        "Azmour",
        "Hammam Ghezèze",
        "Dar Allouch",
        "El Haouaria",
        "Takelsa",
        "Soliman",
        "Korbous",
        "Menzel Bouzelfa",
        "Béni Khalled",
        "Zaouiet Djedidi",
        "Grombalia",
        "Bou Argoub",
        "Hammamet",
      ],
      Zaghouan: [
        "Zaghouan",
        "Zriba",
        "Bir Mcherga",
        "Djebel Oust",
        "El Fahs",
        "Nadhour",
      ],
      Bizerte: [
        "Bizerte",
        "Sejnane",
        "Mateur",
        "Menzel Bourguiba",
        "Tinja",
        "Ghar al Milh",
        "Aousja",
        "Menzel Jemil",
        "Menzel Abderrahmane",
        "El Alia",
        "Ras Jebel",
        "Metline",
        "Raf Raf",
      ],
      Béja: [
        "Béja",
        "El Maâgoula",
        "Zahret Medien",
        "Nefza",
        "Téboursouk",
        "Testour",
        "Goubellat",
        "Majaz al Bab",
      ],
      Jendouba: [
        "Jendouba",
        "Bou Salem",
        "Tabarka",
        "Aïn Draham",
        "Fernana",
        "Beni MTir",
        "Ghardimaou",
        "Oued Melliz",
      ],
      Kef: [
        "El Kef",
        "Nebeur",
        "Touiref",
        "Sakiet Sidi Youssef",
        "Tajerouine",
        "Menzel Salem",
        "Kalaat es Senam",
        "Kalâat Khasba",
        "Jérissa",
        "El Ksour",
        "Dahmani",
        "Sers",
      ],
      Siliana: [
        "Siliana",
        "Bou Arada",
        "Gaâfour",
        "El Krib",
        "Sidi Bou Rouis",
        "Maktar",
        "Rouhia",
        "Kesra",
        "Bargou",
        "El Aroussa",
      ],
      Sousse: [
        "Ksibet Thrayet",
        "Ezzouhour",
        "Zaouiet Sousse",
        "Hammam Sousse",
        "Akouda",
        "Kalâa Kebira",
        "Sidi Bou Ali",
        "Hergla",
        "Enfidha",
        "Bouficha",
        "Sidi El Hani",
        "Msaken",
        "Kalâa Seghira",
        "Messaadine",
        "Kondar",
      ],
      Monastir: [
        "Monastir",
        "Khniss",
        "Ouerdanin",
        "Sahline Moôtmar",
        "Sidi Ameur",
        "Zéramdine",
        "Beni Hassen",
        "Ghenada",
        "Jemmal",
        "Menzel Kamel",
        "Zaouiet Kontoch",
        "Bembla-Mnara",
        "Menzel Ennour",
        "El Masdour",
        "Moknine",
        "Sidi Bennour",
        "Menzel Farsi",
        "Amiret El Fhoul",
        "Amiret Touazra",
        "Amiret El Hojjaj",
        "Cherahil",
        "Bekalta",
        "Téboulba",
        "Ksar Hellal",
        "Ksibet El Mediouni",
        "Benen Bodher",
        "Touza",
        "Sayada",
        "Lemta",
        "Bouhjar",
        "Menzel Hayet",
      ],
      Mahdia: [
        "Mahdia",
        "Rejiche",
        "Bou Merdes",
        "Ouled Chamekh",
        "Chorbane",
        "Hebira",
        "Essouassi",
        "El Djem",
        "Kerker",
        "Chebba",
        "Melloulèche",
        "Sidi Alouane",
        "Ksour Essef",
        "El Bradâa",
      ],
      Sfax: [
        "Sakiet Ezzit",
        "Chihia",
        "Sakiet Eddaïer",
        "Gremda",
        "El Ain",
        "Thyna",
        "Agareb",
        "Jebiniana",
        "El Hencha",
        "Menzel Chaker",
        "Ghraïba, Tunisia",
        "Bir Ali Ben Khélifa",
        "Skhira",
        "Mahares",
        "Kerkennah",
      ],
      Kairouan: [
        "Kairouan",
        "Chebika",
        "Sbikha",
        "Oueslatia",
        "Aïn Djeloula",
        "Haffouz",
        "Alaâ",
        "Hajeb El Ayoun",
        "Nasrallah",
        "Menzel Mehiri",
        "Echrarda",
        "Bou Hajla",
      ],
      Kasserine: [
        "Kasserine",
        "Sbeitla",
        "Sbiba",
        "Jedelienne",
        "Thala",
        "Haïdra",
        "Foussana",
        "Fériana",
        "Thélepte",
        "Magel Bel Abbès",
      ],
      "Sidi Bouzid": [
        "Sidi Bouzid",
        "Jilma",
        "Cebalet",
        "Bir El Hafey",
        "Sidi Ali Ben Aoun",
        "Menzel Bouzaiane",
        "Meknassy",
        "Mezzouna",
        "Regueb",
        "Ouled Haffouz",
      ],
      Gabès: [
        "Gabès",
        "Chenini Nahal",
        "Ghannouch",
        "Métouia",
        "Oudhref",
        "El Hamma",
        "Matmata",
        "Nouvelle Matmata",
        "Mareth",
        "Zarat",
      ],
      Medenine: [
        "Medenine",
        "Beni Khedache",
        "Ben Gardane",
        "Zarzis",
        "Houmt El Souk (Djerba)",
        "Midoun (Djerba)",
        "Ajim (Djerba)",
      ],
      Tataouine: ["Tataouine", "Bir Lahmar", "Ghomrassen", "Dehiba", "Remada"],
      Gafsa: [
        "Gafsa",
        "El Ksar",
        "Moularès",
        "Redeyef",
        "Métlaoui",
        "Mdhila",
        "El Guettar",
        "Sened",
      ],
      Tozeur: ["Tozeur", "Degache", "Hamet Jerid", "Nafta", "Tamerza"],
      Kebili: ["Kebili", "Djemna", "Douz", "El Golâa", "Souk Lahad"],
    },
  };

  function set_selection_fields() {
    var countySel = document.getElementById("countySel"),
      stateSel = document.getElementById("stateSel"),
      districtSel = document.getElementById("districtSel");
    countySel.length = 1;
    for (var country in stateObject) {
      countySel.options[countySel.options.length] = new Option(
        country,
        country
      );
    }

    countySel.onchange = function () {
      stateSel.length = 1; // remove all options bar first
      districtSel.length = 1; // remove all options bar first
      if (this.selectedIndex < 1) return; // done
      for (var state in stateObject[this.value]) {
        stateSel.options[stateSel.options.length] = new Option(state, state);
      }
    };
    countySel.onchange(); // reset in case page is reloaded
    stateSel.onchange = function () {
      districtSel.length = 1; // remove all options bar first
      if (this.selectedIndex < 1) return; // done
      var district = stateObject[countySel.value][this.value];
      for (var i = 0; i < district.length; i++) {
        districtSel.options[districtSel.options.length] = new Option(
          district[i],
          district[i]
        );
      }
    };
  }

  function set_date_max() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }

    today = yyyy + "-" + mm + "-" + dd;
    document.getElementById("birthday").setAttribute("max", today);
  }

  useEffect(() => {
    set_selection_fields();
    set_date_max();
  }, []);
  let history = useHistory();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    city: "",
    governorate: "",
    sex: "Male",
    date_of_birth: "",
    covid19: "Unknown",
  });

  const {
    firstname,
    lastname,
    city,
    governorate,
    sex,
    date_of_birth,
    covid19,
  } = formData;
  var Data = new FormData();
  var imagefile = document.querySelector("#file");

  const loadPicture = (e) => {
    Data.append("patient_picture", imagefile.files[0]);

    document.getElementById("filename").innerHTML = String(
      imagefile.files[0].name
    );
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    Data.append("first_name", formData.firstname);
    Data.append("last_name", formData.lastname);
    Data.append("city", formData.city);
    Data.append("governorate", formData.governorate);
    Data.append("sex", formData.sex);
    Data.append("date_of_birth", formData.date_of_birth);
    if (user != null) {
      Data.append("account", user.id);
    }

    Data.append("covid19", formData.covid19);

    add_patient(Data, history);
  };

  return (
    <div>
      <Navbar />
      <SideBar />
      <div className="content-wrapper" style={{ "padding-top": "15px" }}>
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              {/* left column */}
              <div className="col-md-12">
                {/* general form elements */}
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title">Add Patient</h3>
                  </div>
                  {/* /.card-header */}
                  {/* form start */}
                  <form onSubmit={(e) => onSubmit(e)}>
                    <div className="card-body">
                      <div class="row">
                        <div className="form-group">
                          <label htmlFor="exampleInputName">First name</label>
                          <div className="col-12">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="First Name"
                              name="firstname"
                              value={firstname}
                              onChange={(e) => onChange(e)}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputName">Last name</label>
                          <div className="col-12">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Last Name"
                              name="lastname"
                              value={lastname}
                              onChange={(e) => onChange(e)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-2">
                          {/* select */}
                          <div className="form-group">
                            <label>Select country</label>
                            <select
                              className="custom-select"
                              id="countySel"
                              name="countySel"
                              size="1">
                              <option value="" selected="selected">
                                Select Country
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="col-2">
                          {/* select */}
                          <div className="form-group">
                            <label>Select city </label>
                            <select
                              className="custom-select"
                              id="stateSel"
                              name="city"
                              value={city}
                              onChange={(e) => onChange(e)}
                              size="1">
                              <option value="" selected="selected">
                                Please select Country first
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3">
                          {/* select */}
                          <div className="form-group">
                            <label>Select Municipality</label>
                            <select
                              className="custom-select"
                              id="districtSel"
                              name="governorate"
                              value={governorate}
                              onChange={(e) => onChange(e)}
                              size="1">
                              <option value="" selected="selected">
                                Please select city first
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label> Date of birth MM/JJ/AAAA:</label>
                        <div
                          className="col-3"
                          id="reservationdate"
                          data-target-input="nearest">
                          <input
                            type="date"
                            id="birthday"
                            name="date_of_birth"
                            //value={date_of_birth}
                            onChange={(e) => onChange(e)}
                            className="form-control"
                            data-date-format="dd/mm/yyyy"
                          />

                          <div
                            className="input-group-append"
                            data-target="#reservationdate"
                            data-toggle="datetimepicker"></div>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="col-2">
                          {/* select */}
                          <div className="form-group">
                            <label>Select sex </label>
                            <select
                              className="custom-select"
                              id="sex"
                              name="sex"
                              value={sex}
                              onChange={(e) => onChange(e)}>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-3">
                          {/* select */}
                          <div className="form-group">
                            <label>Select case </label>
                            <select
                              className="custom-select"
                              id="covid-19"
                              name="covid19"
                              value={covid19}
                              onClick={(e) => onChange(e)}
                              onChange={(e) => onChange(e)}>
                              <option value="Unknown">Unknown</option>
                              <option value="Infected">Infected</option>
                              <option value="Recovered">Recovered</option>
                              <option value="Not infected">Not infected</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="exampleInputFile">
                          Patient Picture
                        </label>
                        <div className="col-10">
                          <div className="input-group">
                            <div className="custom-file">
                              <input
                                id="file"
                                name="file"
                                type="file"
                                onChange={(e) => loadPicture(e)}
                                className="custom-file-input"></input>
                              <label
                                className="custom-file-label"
                                htmlFor="exampleInputFile"
                                id="filename"></label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /.card-body */}
                    <div className="card-footer">
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
                {/* /.card */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
AddPatient.protoTypes = {
  add_patient: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { add_patient })(AddPatient);
