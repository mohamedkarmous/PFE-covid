import { SENDTEST, TEST_ERROR } from "../actions/types";
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
    case TEST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };

    default:
      return state;
  }
}
