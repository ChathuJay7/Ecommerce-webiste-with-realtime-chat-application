import axios from "axios";
import { ENDPOINT } from "../Endpoints";
import { IStripeKeyData } from "./interfaces/stripe-key-data.interface";


// Get all stripe key data functionality API call
export const getAllStripeKeys = async (accessToken: string | null) => {
  try {
    const response = await axios.get(`${ENDPOINT.ADMIN.GETALLSTRIPEKEYS}`,{
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    } );
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};


// Get single stripe key data functionality API call
export const getSingleStripeKey = async (accessToken: string | null, stripeKeyData: IStripeKeyData) => {
    try {
        const response = await axios.get(`${ENDPOINT.ADMIN.GETSINGLESTRIPEKEY(stripeKeyData)}`,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: error.response.data.message };
    }
};


// Update stripe key data functionality API call
export const updateStripeKey = async (accessToken: string | null, stripeKeyData: IStripeKeyData) => {
    try {
        const response = await axios.patch(`${ENDPOINT.ADMIN.UPDATESTRIPEKEY(stripeKeyData)}`, {
            stripePublicKey: stripeKeyData.publicKey,
            stripeSecretKey: stripeKeyData.secretKey
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            
        });
        return { success: true, data: response.data };
    } catch (error: any) {
        return { success: false, error: error.response.data.message };
    }
};

// export const updateStripeKey = async (
//     accessToken: string | null, stripeKeyData: IStripeKeyData
//   ) => {
//     try {
//       const config = {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       };
//       const response = await axios.patch(
//         `${ENDPOINT.ADMIN.UPDATESTRIPEKEY(stripeKeyData)}`,
//         stripeKeyData,
//         config
//       );
//       return { success: true, data: response.data };
//     } catch (error: any) {
//       return { success: false, error: error.response.data.message };
//     }
//   };


