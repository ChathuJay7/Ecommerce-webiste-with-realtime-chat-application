import React, { useEffect, useState } from "react";
import Button from "../Common/Button";
import InputField from "../Common/InputField";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../Common/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createCategory,
  getSingleCategory,
  updateCategory,
} from "../../API/Category/CategoryAPI";
import { ICreateCategoryData } from "../../API/Category/interfaces/create-category-data.interface";
import { VIEWS } from "../../utils/Views";

export default function UpdateCategoryAdmin() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams?.get("id");
  const [bearerToken, setBearerToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
    handleGetCategory();
    console.log(categoryId);
  }, []);

  const handleGetCategory = async () => {
    setIsLoading(true);
    const response = await getSingleCategory(String(categoryId));
    if (response.success) {
      setName(response.data.name);
      setDescription(response.data.description);
      setIsLoading(false);
    } else {
      console.log("Error:", response.error);
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (name === "") {
      toast.error("Please enter name..!!");
    } else if (description === "") {
      toast.error("Please enter description..!!");
    } else {
      setIsLoading(true);
      const createCategoryData: ICreateCategoryData = {
        name: name,
        description: description,
      };
      const response = await updateCategory(
        String(categoryId),
        createCategoryData,
        bearerToken
      );
      if (response.success) {
        setIsLoading(false);
        navigate(VIEWS.ADMIN_CATEGORIES);
      } else {
        console.log("Error:", response.error);
        setIsLoading(false);
      }
    }
  };

  return (
    <React.Fragment>
      <div className="mt-24 items-center justify-center w-screen">
        <h1 className="text-2xl font-bold mb-6 text-center">Update Category</h1>
        <div className="w-[600px]  mx-auto bg-white p-8 rounded-md shadow-md mb-10">
          <InputField
            label="Category Name"
            type="text"
            placeholder="T-Shirts"
            value={name}
            onChange={setName}
          />
          <InputField
            label="Description"
            type="text"
            placeholder="Sample description for category..."
            value={description}
            onChange={setDescription}
          />
          <Button name="Update Category" handleAction={handleUpdateCategory} />
        </div>
      </div>
      {isLoading ? <LoadingSpinner /> : null}
      <ToastContainer />
    </React.Fragment>
  );
}
