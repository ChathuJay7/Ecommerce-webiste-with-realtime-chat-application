import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSingleUser } from "../../../API/User/UserAPI";

// Async thunk to fetching the loggedInUser data
export const loggedInUser = createAsyncThunk(
  "user/loggedInUser",
  async (id: string) => {
    const response = await getSingleUser({
      id: id,
    });
    return response.data;
  }
);
