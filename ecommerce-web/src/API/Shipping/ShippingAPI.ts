import axios from "axios";
import { ENDPOINT } from "../Endpoints";
import { IShippingData } from "./interfaces/shipping-data.interface";

// Create new shipping functionality API call
export const createShipping = async (
  shippingData: IShippingData,
  token: string
) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(
      `${ENDPOINT.SHIPPING.CREATE_SHIPPING}`,
      shippingData,
      config
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};
