import axios from "axios";
import { IOrderData } from "./interfaces/order-data";
import { ENDPOINT } from "../Endpoints";

export const getAllOrders = async (accessToken: string | null) => {
    try {
      const response = await axios.get(`${ENDPOINT.ORDER.GETALLORDERS}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response.data.message };
    }
};


export const getOrderDetailsByUser = async (accessToken: string | null, orderData: IOrderData) => {
    try {
      const response = await axios.get(`${ENDPOINT.ORDER.GETORDERBYUSERID(orderData)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response.data.message };
    }
};

// Create new order functionality API call
export const createOrder = async (cartId: string | null, token: string) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(
      `${ENDPOINT.ORDER.CREATE_ORDER}`,
      {
        cartId,
      },
      config
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

// Get single order data API call
export const getSingleOrder = async (orderData: IOrderData) => {
  try {
    const response = await axios.get(
      `${ENDPOINT.ORDER.ORDER_WITH_ID(orderData)}`
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};


// Get all orders for a particular user API call
export const getAllOrdersForUser = async (orderData: IOrderData) => {
  try {
    const response = await axios.get(
      `${ENDPOINT.ORDER.GETORDERBYUSERID(orderData)}`
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};
