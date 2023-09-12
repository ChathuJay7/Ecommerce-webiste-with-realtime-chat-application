
import { IStripeKeyData } from "./Admin/interfaces/stripe-key-data.interface";
import { ICartData } from "./Cart/interfaces/cart-data.interface";
import { ICartItemData } from "./Cart/interfaces/cart-item-data.interface";
import { ICurrentThreadData } from "./Chat/interfaces/current-thread-data.interface";
import { IOrderData } from "./Order/interfaces/order-data";
import { IProductData } from "./Products/interfaces/product-data.interface";
import { IUpdateProductData } from "./Products/interfaces/update-product-data.interface";
import { IFilterUserData } from "./User/interfaces/filter-user-data.interface";
import { IMessageData } from "./User/interfaces/message-data.interface";
import { IUserData } from "./User/interfaces/user-data.interface";

// Base URL
const BASE_URL = process.env.REACT_APP_BACKEND_API;
const BASE_CHAT_API_URL = process.env.REACT_APP_BACKEND_CHAT_API;

// API Endpoints
export const ENDPOINT = {
  AUTH: {
    SIGNUP: `${BASE_URL}auth/register`,
    SIGNIN: `${BASE_URL}auth/login`,
    CHANGEPASSWORD: `${BASE_URL}auth/change-password`,
    FORGOTPASSWORD: `${BASE_URL}auth/forget-password`,
    RESETPASSWORD: `${BASE_URL}auth/reset-password`,
    LOGGEDINUSER: `${BASE_URL}auth/loggedInUser`,
  },
  USER: {
    GETALL: `${BASE_URL}user`,
    USER_WITH_ID: (userData: IUserData) => `${BASE_URL}user/${userData.id}`,
    ADDNEWUSER: `${BASE_URL}user`,
    UPDATEUSERROLE: (userData: IUserData) => `${BASE_URL}user/${userData.id}`,
    FILTERUSER: (userFilterData: IFilterUserData) => `${BASE_URL}user/filter/${userFilterData.username}`,
    REMOVEUSER: (userData: IUserData) => `${BASE_URL}user/${userData.id}`
  },
  THREAD: {
    CREATESINGLETHREAD: `${BASE_CHAT_API_URL}thread/`,
    CREATEGROUPTHREAD: `${BASE_CHAT_API_URL}thread/group-thread`,
    GETUSERTHREAD: (userData: IUserData) => `${BASE_CHAT_API_URL}thread/user-threads/${userData.id}`,
    GETCURRENTTHREAD: (currentThreadData: ICurrentThreadData) => `${BASE_CHAT_API_URL}thread/${currentThreadData.id}`,
    GETALLMESSAGESINCURRENTTHREAD: (currentThreadData: ICurrentThreadData) => `${BASE_CHAT_API_URL}message/thread/${currentThreadData.id}`
  },
  PRODUCTS: {
    GET_ALL: (pageNumber?: Number) => pageNumber ? `${BASE_URL}product?page=${pageNumber}&limit=8` : `${BASE_URL}product`,
    PRODUCT_WITH_ID: (productData: IProductData) => `${BASE_URL}product/${productData.id}`,
    ADDNEWPRODUCT: `${BASE_URL}product`,
    UPDATEPRODUCT: (updateProductData: IUpdateProductData) => `${BASE_URL}product/${updateProductData.id}`,
    REMOVEPRODUCT: (productData: IProductData) => `${BASE_URL}product/${productData.id}`,
    REMOVEPRODUCTIMAGE: (productData: IProductData) => `${BASE_URL}product/${productData.id}/gallery?key=${productData.imageKey}`,
  },
  CART: {
    CREATECART: `${BASE_URL}cart/`,
    GETCART: (cartData: ICartData) => `${BASE_URL}cart/${cartData.id}`,
    GETCARTBYUSERID: (userData: IUserData) => `${BASE_URL}cart/user/${userData.id}`,
    REMOVECARTITEM: (cartItemData: ICartItemData) => `${BASE_URL}cart/cart-items/${cartItemData.id}`,
    UPDATECARTITEM: (cartItemData: ICartItemData) => `${BASE_URL}cart/cart-items/${cartItemData.id}`,
    ADDCARTITEM: (cartItemData: ICartItemData) => `${BASE_URL}cart/${cartItemData.cartId}/cart-items/`,
  },
  MESSAGE: {
    UPDATEREADLIST: (messageData: IMessageData) => `${BASE_CHAT_API_URL}message/${messageData.id}/markAsRead`,
    GETSINGLEMESSAGE: (messageData: IMessageData) => `${BASE_CHAT_API_URL}message/${messageData.id}`,
  },
  ORDER: {
    CREATE_ORDER: `${BASE_URL}order/`,
    ORDER_WITH_ID: (orderData: IOrderData) => `${BASE_URL}order/${orderData.id}`,
    GETALLORDERS: `${BASE_URL}order`,
    GETORDERBYUSERID: (orderData: IOrderData) => `${BASE_URL}order/user/${orderData.user}`,
  },
  CATEGORY: {
    GET_ALL_CATEGORIES: `${BASE_URL}category`,
    CATEGORY_WITH_ID: (id: string) => `${BASE_URL}category/${id}`,
  },
  SHIPPING: {
    CREATE_SHIPPING: `${BASE_URL}shipping/`,
  },
  PAYMENT: {
    CREATE_PAYMENT: `${BASE_URL}payment/`,
  },
  ADMIN: {
    GETALLSTRIPEKEYS: `${BASE_URL}admin/stripe`,
    GETSINGLESTRIPEKEY: (stripeKeyData: IStripeKeyData) => `${BASE_URL}admin/stripe/${stripeKeyData.id}`,
    UPDATESTRIPEKEY: (stripeKeyData: IStripeKeyData) => `${BASE_URL}admin/stripe/${stripeKeyData.id}`,
  }

};
