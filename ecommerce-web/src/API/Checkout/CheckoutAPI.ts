import axios from "axios";
import { ENDPOINT } from "../Endpoints";
import { IPaymentData } from "./interfaces/checkout-data.interface";

// Create new shipping functionality API call
export const createPayment = async (
  paymentData: IPaymentData,
  token: string
) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(
      `${ENDPOINT.PAYMENT.CREATE_PAYMENT}`,
      paymentData,
      config
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};
