import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import patient from "./patient";
import test from "./test";
import users from "./users";
import diagnostic from "./diagnostic";

export default combineReducers({
  alert,
  auth,
  patient,
  test,
  users,
  diagnostic,
});
