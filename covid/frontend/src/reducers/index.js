import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import patient from "./patient";
import test from "./test";

export default combineReducers({
  alert,
  auth,
  patient,
  test,
});
