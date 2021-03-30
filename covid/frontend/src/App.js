import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import ModalTest from "./components/layout/modal";

import mainPage from "./components/pages/mainPage";
import AddPatient from "./components/pages/patient/addPatient";
import UpdatePatient from "./components/pages/patient/updatePatient";
import UpdateUser from "./components/pages/admin/updateUser";
import patientsPage from "./components/pages/patient/patientsPage";
import userPage from "./components/pages/admin/usersPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Alert from "./components/layout/alert";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import { useEffect } from "react";
import PrivateRoute from "./components/routing/PrivateRoute";
//redux

import { Provider } from "react-redux";
import store from "./store";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div id="main" class="wrapper">
          <div>
            <Alert />
          </div>

          <Switch>
            <PrivateRoute exact path="/dashboard" component={mainPage} />
            <PrivateRoute exact path="/addPatient" component={AddPatient} />
            <PrivateRoute exact path="/patient" component={patientsPage} />
            <PrivateRoute exact path="/users" component={userPage} />
            <PrivateRoute
              exact
              path="/updatePatient"
              component={UpdatePatient}
            />
            <PrivateRoute exact path="/updateUser" component={UpdateUser} />
            <Route exact path="/modal" component={ModalTest} />
            <Route exact path="/login" component={SignIn} />
            <Route exact path="/" component={SignIn} />
            <Route exact path="/register" component={SignUp} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
