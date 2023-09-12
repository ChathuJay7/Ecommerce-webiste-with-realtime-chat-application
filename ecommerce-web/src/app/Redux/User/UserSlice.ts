import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loggedInUser } from "./UserActions";

// Define the shape of the user data object
type IUserData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

// Define the initial state shape
type IInitialState = {
  user: IUserData;
  isLoading: boolean;
  errorMsg: string;
};

// Define the initial state of the user slice
const initialState: IInitialState = {
  user: {
    id: "",
    email: "",
    firstName: "",
    lastName: "",
  },
  isLoading: false,
  errorMsg: "",
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.user = initialState.user;
      state.isLoading = initialState.isLoading;
      state.errorMsg = initialState.errorMsg;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle the loggedInUser.pending action
      .addCase(loggedInUser.pending, (state) => {
        state.isLoading = true;
        state.errorMsg = "";
      })
      // Handle the loggedInUser.fulfilled action
      .addCase(
        loggedInUser.fulfilled,
        (state, action: PayloadAction<IUserData>) => {
          state.isLoading = false;
          state.user = {
            id: action.payload.id,
            email: action.payload.email,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
          };
        }
      )
      // Handle the loggedInUser.rejected action
      .addCase(loggedInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMsg = action.error.message || "";
      });
  },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
