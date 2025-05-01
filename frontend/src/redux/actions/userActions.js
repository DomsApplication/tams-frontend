import axios from "axios";

// Const for USER operations
export const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const ADD_USER_SUCCESS = "ADD_USER_SUCCESS";
export const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";
export const DELETE_USERS_SUCCESS = "DELETE_USERS_SUCCESS";

// Const for TOAST display/Hide
export const SHOW_TOAST = "SHOW_TOAST";
export const HIDE_TOAST = "HIDE_TOAST";

const BASE_URL = "http://localhost:5000";

// Function to show toast
export const showToast = (message, severity = "error") => ({
  type: SHOW_TOAST,
  payload: { message, severity },
});

export const fetchUsers = () => async (dispatch) => {
  try {
    const response = await axios.get(BASE_URL + "/user");
    dispatch({ type: FETCH_USERS_SUCCESS, payload: response.data });
  } catch (error) {
    console.log('Error to fetch............');
    dispatch(showToast("Data fetch error, try again!"));
  }
};

export const fetchUser = (email) => async (dispatch) => {
  const response = await axios.get(`${BASE_URL}/user/${email}`);
  dispatch({ type: FETCH_USER_SUCCESS, payload: response.data });
};

export const addUser = (user) => async (dispatch) => {
  const response = await axios.post(BASE_URL + "/user", user);
  dispatch({ type: ADD_USER_SUCCESS, payload: response.data });
};

export const updateUser = (user, formdata) => async (dispatch) => {
  const response = await axios.put(`${BASE_URL}/user/${user}`, formdata);
  dispatch({ type: UPDATE_USER_SUCCESS, payload: response.data });
};

export const deleteUsers = (emails) => async (dispatch) => {
  await axios.delete(`${BASE_URL}/user/${emails}`);
  //await axios.delete("/api/users", { data: { emails } });
  dispatch({ type: DELETE_USERS_SUCCESS, payload: emails });
};

