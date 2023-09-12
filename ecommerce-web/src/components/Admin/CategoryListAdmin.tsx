import React, { useEffect, useState } from "react";
import {
  deleteCategory,
  getAllCategories,
} from "../../API/Category/CategoryAPI";
import { Link } from "react-router-dom";
import { VIEWS } from "../../utils/Views";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../Common/LoadingSpinner";

export default function CategoryListAdmin() {
  const [bearerToken, setBearerToken] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
    handleGetAllCategories();
  }, []);

  const handleGetAllCategories = async () => {
    setIsLoading(true);
    const response = await getAllCategories();
    if (response.success) {
      setCategoryList(response.data);
      console.log(response.data);
      setIsLoading(false);
    } else {
      console.log("Error:", response.error);
      setIsLoading(false);
    }
  };

  const handleRemoveCategory = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await deleteCategory(bearerToken, id);
      if (response.success) {
        console.log(response.data);
        toast.success("Successfully Deleted");
        handleGetAllCategories();
        setIsLoading(false);
      } else {
        console.error(response.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="px-24 mt-20 w-screen">
        <div className="mt-1/2 w-1/2 pt-10 mb-4">
          <Link to={VIEWS.ADMIN_ADD_CATEGORIES}>
            <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
              + Add Parent Category
            </button>
          </Link>
        </div>

        <div className="h-screen">
          <table className="w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-300">
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Level</th>
                <th className="py-3 px-4 text-left">Add Child</th>
                <th className="py-3 px-4 text-left hover:po">Action</th>
              </tr>
            </thead>
            <tbody>
              {categoryList?.map((item: any, index: any) => (
                <tr className="border-b border-gray-200" key={index.toString()}>
                  <td className="py-2 px-4">
                    <span className="inline-flex items-center bg-slate-700 text-slate-100 text-xs font-medium px-2.5 py-1 rounded-full mt-1">
                      <span className="w-2 h-2 mr-1 bg-slate-200 rounded-full"></span>
                      {item.name}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <p className="text-gray-900 text-lg font-semibold">
                      {item.description}
                    </p>
                  </td>
                  <td className="py-2 px-4">
                    <p className="text-gray-900 text-lg font-semibold">
                      {item.level === 0 ? (
                        <span className="inline-flex items-center bg-rose-500 text-slate-100 text-xs font-medium px-2.5 py-1 rounded-full mt-1">
                          <span className="w-2 h-2 mr-1 bg-rose-200 rounded-full"></span>
                          Parent Category
                        </span>
                      ) : null}
                      {item.level === 1 ? (
                        <span className="inline-flex items-center bg-orange-400 text-slate-100 text-xs font-medium px-2.5 py-1 rounded-full mt-1">
                          <span className="w-2 h-2 mr-1 bg-orange-200 rounded-full"></span>
                          Child Category
                        </span>
                      ) : null}
                    </p>
                  </td>
                  <td>
                    {item.level === 0 ? (
                      <Link to={VIEWS.ADMIN_ADD_CATEGORIES + "?id=" + item.id}>
                        <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold px-4 py-1 mr-2 rounded-full">
                          <i className="fa-solid fa-plus"></i> Child
                        </button>
                      </Link>
                    ) : null}
                  </td>
                  <td className="py-2 px-4">
                    <Link to={VIEWS.ADMIN_UPDATE_CATEGORIES + "?id=" + item.id}>
                      <button className="mr-2">
                        <i className="fas fa-edit"></i>
                      </button>
                    </Link>
                    <button
                      onClick={() => handleRemoveCategory(item.id)}
                      className="text-red-500"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isLoading ? <LoadingSpinner /> : null}
      <ToastContainer />
    </React.Fragment>
  );
}
