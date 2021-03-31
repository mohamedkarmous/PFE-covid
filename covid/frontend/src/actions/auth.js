import axios from "axios";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  REMOVE_ALERT,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  LOGOUT_FAIL,
} from "./types";
import { setAlert } from "./alert";
import { wait } from "@testing-library/dom";
import { waitFor } from "@testing-library/dom";
import setAuthToken from "../utils/setAuthToken";

//load user
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.post("api/account/token", {
      token: localStorage.token,
    });

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//register user

export const register = ({
  FirstName,
  LastName,
  UserName,
  Email,
  Password1,
  Password2,
}) => async (dispatch) => {
  const newUser = {
    username: UserName,
    email: Email,
    password: Password1,
    password2: Password2,
    first_name: FirstName,
    last_name: LastName,
  };
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const body = JSON.stringify(newUser);
  try {
    const res = await axios.post("/api/register", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      let i = 4000;
      for (let key in errors) {
        i = i + 500;

        dispatch(setAlert(errors[key][0] + " :" + key, "danger", i));
      }
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

//login user

export const login = (username, password) => async (dispatch) => {
  const User = {
    username: username,
    password: password,
  };
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const body = JSON.stringify(User);

  try {
    const res = await axios.post("/api/login", body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (error) {
    dispatch(setAlert("Wrong username or password!", "danger", 2000));

    const errors = error.response.data.errors;
    if (errors) {
      let i = 4000;
      for (let key in errors) {
        i = i + 500;

        dispatch(setAlert(errors[key][0], "danger", i));
      }
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//logout

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
