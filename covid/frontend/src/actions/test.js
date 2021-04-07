import axios from "axios";
import ReactDOM from "react-dom";
import { setAlert } from "./alert";
import {
  GET_TESTS,
  SENDTEST,
  TEST_ERROR,
  DELETE_TEST,
  UPDATE_TEST,
} from "./types";
import { Link, Redirect } from "react-router-dom";

//send test
export const sendTest = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-type": "multipart/form-data",
    },
  };
  const link = "http://127.0.0.1:5000/predict";
  try {
    const res = await axios.post(link, data, config);
    data.append("result", res.data.result);
    try {
      const res2 = await axios.post("/api/test/create", data, config);

      if (res.data.result[0] == "C") {
        dispatch(setAlert("Test result: " + res.data.result, "danger"));
      } else if (res.data.result[0] == "P") {
        dispatch(setAlert("Test result: " + res.data.result, "warning"));
      } else if (res.data.result[0] == "N") {
        dispatch(setAlert("Test result: " + res.data.result, "success"));
      }
    } catch (error) {
      console.log(error);
      dispatch({
        payload: error,
        type: TEST_ERROR,
      });
    }

    dispatch({
      type: SENDTEST,
      payload: res.data.result,
    });
  } catch (error) {
    //const errors = error.response.data.errors;
    console.log(error);
    dispatch({
      payload: error,
      type: TEST_ERROR,
    });
  }
};

//get tests

export const getTests = (id = -1) => async (dispatch) => {
  try {
    var res = {};
    if (id == -1) {
      res = await axios.get("/api/test?ordering=-id");
    } else {
      res = await axios.get("/api/test?search=" + id + "&ordering=-id");
    }
    dispatch({ type: GET_TESTS, payload: res.data });
  } catch (err) {
    dispatch({
      type: TEST_ERROR,
      payload: { msg: err.response },
    });
  }
};

//delete test

export const deleteTest = (id) => async (dispatch) => {
  try {
    var res = {};
    res = await axios.delete(`/api/test/${id}/delete/`);

    dispatch({ type: DELETE_TEST, payload: id });
    dispatch(setAlert("Test Removed", "success"));
  } catch (err) {
    dispatch({
      type: TEST_ERROR,
      payload: { msg: err.response },
    });
  }
};

//update test
export const updateTest = (data, id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-type": "multipart/form-data",
    },
  };
  const link = "/api/test/" + id + "/update/";
  try {
    const res = await axios.put(link, data, config);

    dispatch({
      type: UPDATE_TEST,
      payload: res.data,
    });
    dispatch(setAlert("Test updated", "success"));
  } catch (error) {
    //const errors = error.response.data.errors;

    dispatch({
      payload: error,
      type: TEST_ERROR,
    });
  }
};
