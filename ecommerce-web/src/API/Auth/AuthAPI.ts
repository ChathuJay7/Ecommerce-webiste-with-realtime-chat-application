import axios from "axios";
import { ENDPOINT } from "../Endpoints";
import { IRegisterUserData } from "./interfaces/register-user-data.interface";
import { ILoginUserData } from "./interfaces/login-user-data.interface";
import { IResetPassword } from "./interfaces/reset-password-data.interface";
import { IChangePassword } from "./interfaces/change-password-data.interface";

// Login user API call
export const loginUser = async (loginUserData: ILoginUserData) => {
  try {
    const response = await axios.post(`${ENDPOINT.AUTH.SIGNIN}`, {
      email: loginUserData.email,
      password: loginUserData.password,
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

// Register new user API call
export const registerUser = async (registerUserData: IRegisterUserData) => {
  try {
    const response = await axios.post(`${ENDPOINT.AUTH.SIGNUP}`, {
      email: registerUserData.email,
      firstName: registerUserData.firstName,
      lastName: registerUserData.lastName,
      password: registerUserData.password,
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

// Get logged in user data API call
export const getLoggedInUser = async (accessToken: string | null) => {
  try {
    const response = await axios.get(`${ENDPOINT.AUTH.LOGGEDINUSER}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

// Forgot password API call
export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${ENDPOINT.AUTH.FORGOTPASSWORD}`, {
      email: email,
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

// Reset password API call
export const resetPassword = async (resetPasswordData: IResetPassword) => {
  try {
    const response = await axios.put(`${ENDPOINT.AUTH.RESETPASSWORD}`, {
      password: resetPasswordData.password,
      confirmPassword: resetPasswordData.confirmPassword,
      resetToken: resetPasswordData.resetToken,
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

// Change password API call
export const changePassword = async (
  changePasswordData: IChangePassword,
  token: any
) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.put(
      `${ENDPOINT.AUTH.CHANGEPASSWORD}`,
      {
        oldPassword: changePasswordData.oldPassword,
        password: changePasswordData.password,
      },
      config
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};
