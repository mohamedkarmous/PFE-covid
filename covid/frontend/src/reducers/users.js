import {
  GET_USERS,
  GET_USER,
  USERS_ERROR,
  DELETE_USERS,
  ADD_USER,
  UPDATE_USER,
  LOGOUT,
} from "../actions/types";
const initialState = {
  user: null,
  users: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_USERS:
      return {
        ...state,
        users: payload,
        loading: false,
        user: null,
      };
    case GET_USER:
      return {
        ...state,
        user: payload,
        loading: false,
      };
    case ADD_USER:
    case UPDATE_USER:
      return {
        ...state,
        loading: false,
      };

    case DELETE_USERS:
      return {
        ...state,
        users: state.users.filter((p) => p.id !== payload),
        loading: false,
      };
    case USERS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        users: [],
        user: null,
        loading: false,
        user: null,
      };

    default:
      return state;
  }
}
