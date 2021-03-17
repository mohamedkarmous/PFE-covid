import axios from "axios";
import ReactDOM from "react-dom";
import { setAlert } from "./alert";
import {
  GET_PATIENTS,
  GET_PATIENT,
  PATIENT_ERROR,
  DELETE_PATIENTS,
  ADD_PATIENT,
  UPDATE_PATIENT,
  SENDTEST,
  TEST_ERROR,
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

    dispatch({
      type: SENDTEST,
      payload: res.data.result,
    });
    if (res.result == "NORMAL") {
      return true;
    } else if (res.result == "COVID") {
      return false;
    }
  } catch (error) {
    //const errors = error.response.data.errors;
    console.log(error);
    dispatch({
      payload: error,
      type: TEST_ERROR,
    });
  }
};
