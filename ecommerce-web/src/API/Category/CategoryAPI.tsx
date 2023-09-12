import axios from "axios";
import { ENDPOINT } from "../Endpoints";
import { ICreateCategoryData } from "./interfaces/create-category-data.interface";

// To get all the categories API call
export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${ENDPOINT.CATEGORY.GET_ALL_CATEGORIES}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

// To get the single category API call
export const getSingleCategory = async (categoryId: string) => {
  try {
    const response = await axios.get(
      `${ENDPOINT.CATEGORY.CATEGORY_WITH_ID(categoryId)}`
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

// To add the new category API call
export const createCategory = async (
  createCategoryData: ICreateCategoryData,
  accessToken: string | null
) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const response = await axios.post(
      `${ENDPOINT.CATEGORY.GET_ALL_CATEGORIES}`,
      createCategoryData,
      config
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

// To add the new category API call
export const updateCategory = async (
  categoryId: string,
  updateCategoryData: ICreateCategoryData,
  accessToken: string | null
) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const response = await axios.put(
      `${ENDPOINT.CATEGORY.CATEGORY_WITH_ID(categoryId)}`,
      updateCategoryData,
      config
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};

// To delete the categories API call
export const deleteCategory = async (
  accessToken: string | null,
  categoryId: string
) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const response = await axios.delete(
      `${ENDPOINT.CATEGORY.CATEGORY_WITH_ID(categoryId)}`,
      config
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response.data.message };
  }
};
