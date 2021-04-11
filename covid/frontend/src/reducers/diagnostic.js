import {
  SENDDIAGNOSTIC,
  DIAGNOSTIC_ERROR,
  GET_DIAGNOSTICS,
  DELETE_DIAGNOSTIC,
  UPDATE_DIAGNOSTIC,
  LOGOUT,
} from "../actions/types";
const initialState = {
  diagnostic: null,
  diagnostics: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SENDDIAGNOSTIC:
      return {
        ...state,
        diagnostic: payload,
        loading: false,
      };
    case GET_DIAGNOSTICS:
      return {
        ...state,
        diagnostics: payload,
        loading: false,
      };
    case UPDATE_DIAGNOSTIC:
      return {
        ...state,
        loading: false,
      };
    case DELETE_DIAGNOSTIC:
      return {
        ...state,
        diagnostics: state.diagnostics.filter((p) => p.id !== payload),
        loading: false,
      };
    case DIAGNOSTIC_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        diagnostics: [],
        diagnostic: null,
        loading: false,
      };

    default:
      return state;
  }
}
