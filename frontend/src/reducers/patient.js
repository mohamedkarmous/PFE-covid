import {
  GET_PATIENTS,
  PATIENT_ERROR,
  DELETE_PATIENTS,
  ADD_PATIENT,
  UPDATE_PATIENT,
  GET_PATIENT,
  LOGOUT,
} from "../actions/types";
const initialState = {
  patient: null,
  patients: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_PATIENTS:
      return {
        ...state,
        patients: payload,
        loading: false,
        patient: null,
      };
    case GET_PATIENT:
      return {
        ...state,
        patient: payload,
        loading: false,
      };
    case ADD_PATIENT:
    case UPDATE_PATIENT:
      return {
        ...state,
        loading: false,
      };

    case DELETE_PATIENTS:
      return {
        ...state,
        patients: state.patients.filter((p) => p.id !== payload),
        loading: false,
      };
    case PATIENT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        patients: [],
        patient: null,
        loading: false,
        patient: null,
      };

    default:
      return state;
  }
}
