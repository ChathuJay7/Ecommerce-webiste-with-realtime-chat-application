import axios from "axios";
import { ENDPOINT } from "../Endpoints";
import { IUserData } from "./interfaces/user-data.interface";
import { IFilterUserData } from "./interfaces/filter-user-data.interface";
import { IAddNewUserData } from "./interfaces/add-new-user-data.interface";

// Get all users data functionality API call
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${ENDPOINT.USER.GETALL}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

// Get user data by filtering functionality API call
export const getSingleUser = async (userData: IUserData) => {
  try {
    const response = await axios.get(`${ENDPOINT.USER.USER_WITH_ID(userData)}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

// Add new user functionality API call
export const addNewUser = async (addNewUserData: IAddNewUserData , accessToken: string | null) => {
  try {
      const response = await axios.post(`${ENDPOINT.USER.ADDNEWUSER}`,{
              firstName: addNewUserData.firstName,
              lastName: addNewUserData.lastName,
              email: addNewUserData.email,
              role: addNewUserData.role,
              password: addNewUserData.password,
          },
          {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          }
      );
      return { success: true, data: response.data };
  } catch (error: any) {
      return { success: false, error: error.response.data.message };
  }
};

// Get user data by filtering functionality API call
export const filterUsers = async (userData: IFilterUserData) => {
  try {
    const response = await axios.get(`${ENDPOINT.USER.FILTERUSER(userData)}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

// Update single user details functionality API call
export const updateSingleUser = async (userData: IUserData) => {
  try {
    const response = await axios.put(
      `${ENDPOINT.USER.USER_WITH_ID(userData)}`,
      {
        firstName: userData?.firstName,
        lastName: userData?.lastName,
        role: userData?.role
      }
    );
    console.log(userData);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

export const updateUserRole = async (userData: IUserData) => {
  try {
    const response = await axios.put(`${ENDPOINT.USER.UPDATEUSERROLE(userData)}`,
      {
        role: userData?.role
      }
    );
    console.log(userData);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};


// Delete single user functionality API call
export const removeUser = async (accessToken: string | null, userData: IUserData) => {
  try {
    const response = await axios.delete(`${ENDPOINT.USER.REMOVEUSER(userData)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};
