import axios from "axios";
import { ENDPOINT } from "../Endpoints";
import { ISingleThreadData } from "./interfaces/create-single-thread-data.interface";
import { IGroupThreadData } from "./interfaces/create-group-thread-data.interface";
import { IUserData } from "../User/interfaces/user-data.interface";
import { ICurrentThreadData } from "./interfaces/current-thread-data.interface";
import { IMessageData } from "../User/interfaces/message-data.interface";


export const getAllChats = async (data: any) => {};


export const createSingleThread = async (singleThreadData: ISingleThreadData) => {
    try {
      const response = await axios.post(`${ENDPOINT.THREAD.CREATESINGLETHREAD}`, {
        members: singleThreadData.members,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response.data.message };
    }
};

export const createGroupThread = async (groupThreadData: IGroupThreadData) => {
  try {
    const response = await axios.post(`${ENDPOINT.THREAD.CREATEGROUPTHREAD}`, {
      threadName: groupThreadData.threadName,
      members: groupThreadData.members,
      groupAdminId: groupThreadData.groupAdminId
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};


export const getUserThreads = async (accessToken: string | null, userData: IUserData) => {
  try {
    const response = await axios.get(`${ENDPOINT.THREAD.GETUSERTHREAD(userData)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};


export const getCurrentThread = async ( currentThreadData: ICurrentThreadData) => {
  try {
    const response = await axios.get(`${ENDPOINT.THREAD.GETCURRENTTHREAD(currentThreadData)}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};


export const getCurrentThreadMessages = async ( currentThreadData: ICurrentThreadData) => {
  try {
    const response = await axios.get(`${ENDPOINT.THREAD.GETALLMESSAGESINCURRENTTHREAD(currentThreadData)}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

export const getAllThreadMessages = async (messageData: IMessageData) => {
  try{
    const response = await axios.get(`${ENDPOINT.THREAD.GETALLMESSAGESINCURRENTTHREAD(messageData)}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
}

export const updateReadList = async (messageData: IMessageData) => {
  try{
    const response = await axios.patch(`${ENDPOINT.MESSAGE.UPDATEREADLIST(messageData)}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
}
