import {
  FETCH_USERS_SUCCESS,
  FETCH_USER_SUCCESS,
  ADD_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
  DELETE_USERS_SUCCESS,
  SHOW_TOAST,
  HIDE_TOAST,
} from "../actions/userActions";

const initialState = {
  users: [],
  currentUser: null,
  toast: {
    open: false,
    message: "",
    severity: "error", // "error", "warning", "info", "success"
  },
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_SUCCESS:
      return { ...state, users: action.payload };
    case FETCH_USER_SUCCESS:
      return { ...state, currentUser: action.payload };
    case ADD_USER_SUCCESS:
      return { ...state, users: [...state.users, action.payload] };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.map((user) =>
          user.email === action.payload.email ? action.payload : user
        ),
        currentUser: null,
      };
    case DELETE_USERS_SUCCESS:
      return {
        ...state,
        users: state.users.filter(
          (user) => !action.payload.includes(user.email)
        ),
      };
    case SHOW_TOAST:
      return { ...state, toast: { open: true, ...action.payload } };
    case HIDE_TOAST:
      return { ...state, toast: { ...state.toast, open: false } };
    default:
      return state;
  }
};

export default userReducer;
