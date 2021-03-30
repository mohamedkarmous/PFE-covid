import axios from "axios";
import ReactDOM from "react-dom";
import { setAlert } from "./alert";
import {
  GET_USERS,
  GET_USER,
  USERS_ERROR,
  DELETE_USERS,
  ADD_USER,
  UPDATE_USER,
} from "./types";
import { Link, Redirect } from "react-router-dom";

//get patients

export const getUsers = () => async (dispatch) => {
  try {
    var res = {};

    res = await axios.get("/api/accounts");

    dispatch({ type: GET_USERS, payload: res.data });
  } catch (err) {
    dispatch({
      type: USERS_ERROR,
      payload: { msg: err.response },
    });
  }
};

export const getUser = (user_data) => async (dispatch) => {
  try {
    dispatch({ type: GET_USER, payload: user_data });
  } catch (err) {
    dispatch({
      type: USERS_ERROR,
      payload: { msg: err.response },
    });
  }
};

//delete patient

export const deleteUser = (id) => async (dispatch) => {
  try {
    var res = {};

    res = await axios.delete(`/api/account/${id}/delete/`);

    dispatch({ type: DELETE_USERS, payload: id });
    //dispatch(setAlert("Post Removed", "success"));
  } catch (err) {
    dispatch({
      type: USERS_ERROR,
      payload: { msg: err.response },
    });
  }
};

//add patient
export const add_user = (data, history) => async (dispatch) => {
  const config = {
    headers: {
      "Content-type": "multipart/form-data",
    },
  };
  try {
    const res = await axios.post("/api/register", data, config);

    dispatch({
      type: ADD_USER,
      payload: res.data,
    });
    history.push("/");
  } catch (error) {
    const errors = error.response.data.errors;

    dispatch({
      type: USERS_ERROR,
      payload: error,
    });
    return false;
  }
};

//update patient
export const update_user = (data, id, history) => async (dispatch) => {
  const config = {
    headers: {
      "Content-type": "multipart/form-data",
    },
  };
  const link = "/api/account/" + id + "/update/";
  try {
    const res = await axios.put(link, data, config);

    dispatch({
      type: UPDATE_USER,
      payload: res.data,
    });
    history.push("/");
  } catch (error) {
    const errors = error.response.data.errors;

    dispatch({
      type: USERS_ERROR,
      payload: error,
    });
  }
};
