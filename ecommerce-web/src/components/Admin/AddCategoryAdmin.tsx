import React, { useEffect, useState } from "react";
import Button from "../Common/Button";
import InputField from "../Common/InputField";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../Common/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createCategory } from "../../API/Category/CategoryAPI";
import { ICreateCategoryData } from "../../API/Category/interfaces/create-category-data.interface";
import { VIEWS } from "../../utils/Views";

export default function AddCategoryAdmin() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams?.get("id");
  const [bearerToken, setBearerToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState(0);
  const [parentId, setParentId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
    setLevel(categoryId ? 1 : 0);
    setParentId(categoryId ? categoryId : "");
    console.log(categoryId);
  }, []);

  const handleCreateCategory = async () => {
    if (name === "") {
      toast.error("Please enter name..!!");
    } else if (description === "") {
      toast.error("Please enter description..!!");
    } else {
      setIsLoading(true);
      const createCategoryData: ICreateCategoryData = {
        name: name,
        description: description,
        level: level,
        parentId: parentId,
      };
      const response = await createCategory(createCategoryData, bearerToken);
      if (response.success) {
        console.log(response.data);
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
        <h1 className="text-2xl font-bold mb-6 text-center">
          {categoryId ? "Add Child Category" : "Add Parent Category"}
        </h1>
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
          <Button name="Create Category" handleAction={handleCreateCategory} />
        </div>
      </div>
      {isLoading ? <LoadingSpinner /> : null}
      <ToastContainer />
    </React.Fragment>
  );
}
