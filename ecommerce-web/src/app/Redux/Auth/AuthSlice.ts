import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the auth data object
type IInitialState = {
  isLoading: boolean;
  isAuth: boolean;
  errorMsg: string;
};

// Define the initial state of the auth slice
const initialState: IInitialState = {
  isLoading: false,
  isAuth: false,
  errorMsg: "",
};

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginPending: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state) => {
      state.isLoading = false;
      state.isAuth = true;
      state.errorMsg = "";
    },
    loginFail: (state, { payload }) => {
      state.isLoading = false;
      state.errorMsg = payload;
    },
    logOut: (state) => {
      state.isLoading = false;
      state.isAuth = false;
      state.errorMsg = "";
    },
  },
});

export default authSlice.reducer;
export const { loginPending, loginSuccess, loginFail, logOut } = authSlice.actions;
