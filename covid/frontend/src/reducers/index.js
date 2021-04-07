import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import patient from "./patient";
import test from "./test";
import users from "./users";

export default combineReducers({
  alert,
  auth,
  patient,
  test,
  users,
});
