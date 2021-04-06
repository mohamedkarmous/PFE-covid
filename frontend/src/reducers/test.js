import {
  SENDTEST,
  TEST_ERROR,
  GET_TESTS,
  DELETE_TEST,
  UPDATE_TEST,
  LOGOUT,
} from "../actions/types";
const initialState = {
  test: null,
  tests: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SENDTEST:
      return {
        ...state,
        test: payload,
        loading: false,
      };
    case GET_TESTS:
      return {
        ...state,
        tests: payload,
        loading: false,
      };
    case UPDATE_TEST:
      return {
        ...state,
        loading: false,
      };
    case DELETE_TEST:
      return {
        ...state,
        tests: state.tests.filter((p) => p.id !== payload),
        loading: false,
      };
    case TEST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        tests: [],
        test: null,
        loading: false,
      };

    default:
      return state;
  }
}
