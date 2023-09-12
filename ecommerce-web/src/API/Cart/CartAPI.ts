import axios from "axios";
import { ENDPOINT } from "../Endpoints";
import { IAddToCartData } from "./interfaces/add-to-cart-data.interface";
import { ICartData } from "./interfaces/cart-data.interface";
import { IUserData } from "../User/interfaces/user-data.interface";
import { ICartItemData } from "./interfaces/cart-item-data.interface";


// export const AddToCart = async (addToCartData: IAddToCartData, accessToken: string | null) => {
//     try {
//         console.log(addToCartData, accessToken);
//         const response = await axios.post(`${ENDPOINT.CART.ADDTOCART}`, {
//             cartItems: addToCartData.cartItems,
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         });
//         return { success: true, data: response.data };
//     } catch (error: any) {
//         return { success: false, error: error.response.data.message };
//     }
// };

export const createCart = async (addToCartData: IAddToCartData, accessToken: string | null) => {
    try {
        const response = await axios.post(`${ENDPOINT.CART.CREATECART}`,{
                cartItems: addToCartData.cartItems,
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


export const getCartDetails = async (accessToken: string | null, cartData: ICartData) => {
    try {
      const response = await axios.get(`${ENDPOINT.CART.GETCART(cartData)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response.data.message };
    }
};


export const getCartDetailsByUser = async (accessToken: string | null, userData: IUserData) => {
    try {
      const response = await axios.get(`${ENDPOINT.CART.GETCARTBYUSERID(userData)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response.data.message };
    }
};


export const removeCartItem = async (accessToken: string | null, cartItemData: ICartItemData) => {
    try {
      const response = await axios.delete(`${ENDPOINT.CART.REMOVECARTITEM(cartItemData)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response.data.message };
    }
};


export const updateCartItem = async (accessToken: string | null, cartItemData: ICartItemData) => {
  try {
    const response = await axios.put(`${ENDPOINT.CART.UPDATECARTITEM(cartItemData)}`, {
        quantity: cartItemData.quantity,
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


export const addCartItem = async (accessToken: string | null, cartItemData: ICartItemData) => {
  try {
    const response = await axios.post(`${ENDPOINT.CART.ADDCARTITEM(cartItemData)}`, {
        productId: cartItemData.productId,
        quantity: cartItemData.quantity,
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


export const removeCart = async (accessToken: string | null, cartData: ICartData) => {
  try {
    const response = await axios.delete(`${ENDPOINT.CART.GETCART(cartData)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};
