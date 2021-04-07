import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";

import mainPage from "./components/pages/mainPage";
import AddPatient from "./components/pages/patient/addPatient";
import UpdatePatient from "./components/pages/patient/updatePatient";
import UpdateUser from "./components/pages/admin/updateUser";
import adminHome from "./components/pages/admin/adminHome";
import doctorHome from "./components/pages/patient/doctorHome";
import patientsPage from "./components/pages/patient/patientsPage";
import userPage from "./components/pages/admin/usersPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Alert from "./components/layout/alert";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import { useEffect } from "react";
import PrivateRoute from "./components/routing/PrivateRoute";

import AddUser from "./components/pages/admin/addUser";

//redux

import { Provider } from "react-redux";
import store from "./store";
import allTests from "./components/pages/admin/allTests";
import AllPatients from "./components/pages/admin/AllPatients";
import profile from "./components/pages/profile";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
    toast.configure();
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="sidebar-mini sidebar-closed layout-fixed sidebar-collapse">
          <div id="main" class="wrapper">
            <div>
              <Alert />
            </div>

            <Switch>
              <PrivateRoute exact path="/dashboard" component={mainPage} />
              <PrivateRoute exact path="/addPatient" component={AddPatient} />
              <PrivateRoute exact path="/patient" component={patientsPage} />
              <PrivateRoute exact path="/users" component={userPage} />
              <PrivateRoute exact path="/profile" component={profile} />
              <PrivateRoute exact path="/admin" component={adminHome} />
              <PrivateRoute exact path="/doctor" component={doctorHome} />
              <PrivateRoute exact path="/addUser" component={AddUser} />
              <PrivateRoute exact path="/allTests" component={allTests} />
              <PrivateRoute exact path="/allPatients" component={AllPatients} />

              <PrivateRoute
                exact
                path="/updatePatient"
                component={UpdatePatient}
              />
              <PrivateRoute exact path="/updateUser" component={UpdateUser} />
              <Route exact path="/login" component={SignIn} />
              <Route exact path="/" component={SignIn} />
              <Route exact path="/register" component={SignUp} />
            </Switch>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
