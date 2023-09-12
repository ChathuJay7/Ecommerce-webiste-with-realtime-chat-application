import axios from "axios";
import { ENDPOINT } from "../Endpoints";
import { IProductData } from "./interfaces/product-data.interface";
import { IAddNewProductData } from "./interfaces/add-new-product-data.interface";
import { IUpdateProductData } from "./interfaces/update-product-data.interface";


// Get all products data API call
export const getAllProducts = async (pageNumber?: Number) => {
  try {
    const response = await axios.get(`${ENDPOINT.PRODUCTS.GET_ALL(pageNumber)}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

// Get single product data API call
export const getSingleProduct = async (productData: IProductData) => {
  try {
    const response = await axios.get(
      `${ENDPOINT.PRODUCTS.PRODUCT_WITH_ID(productData)}`
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

// Add new product functionality API call
// export const addNewProduct = async (addNewProductData: IAddNewProductData , accessToken: string | null) => {
//   try {
//       const response = await axios.post(`${ENDPOINT.PRODUCTS.ADDNEWPRODUCT}`,{
//               name: addNewProductData.name,
//               color: addNewProductData.color,
//               price: addNewProductData.price,
//               discount: addNewProductData.discount,
//               quantity: addNewProductData.quantity,
//               description: addNewProductData.description,
//               image: addNewProductData.images,
//               categoryId: addNewProductData.categoryId
//           },
//           {
//               headers: {
//                   Authorization: `Bearer ${accessToken}`,
//               },
//           }
//       );
//       return { success: true, data: response.data };
//   } catch (error: any) {
//       return { success: false, error: error.response.data.message };
//   }
// };

export const addNewProduct = async (
  formData: FormData,
  accessToken: string | null
) => {
  try {
    const response = await axios.post(`${ENDPOINT.PRODUCTS.ADDNEWPRODUCT}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

export const updateProduct = async (
  updateProductData: IUpdateProductData,
  formData: FormData,
  accessToken: string | null
) => {
  try {
    const response = await axios.put(`${ENDPOINT.PRODUCTS.UPDATEPRODUCT(updateProductData)}`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};


export const removeProduct = async (accessToken: string | null, productData: IProductData) => {
  try {
    const response = await axios.delete(`${ENDPOINT.PRODUCTS.REMOVEPRODUCT(productData)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};


export const removeProductImage = async (accessToken: string | null, productData: IProductData) => {
  try {
    const response = await axios.delete(`${ENDPOINT.PRODUCTS.REMOVEPRODUCTIMAGE(productData)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};