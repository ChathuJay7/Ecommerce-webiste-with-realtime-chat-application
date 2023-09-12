import React, { useEffect, useState } from "react";
import TopNav from "../../components/Common/TopNav";
import Footer from "../../components/Common/Footer";
//import { getCartItems } from "../../API/Cart/CartAPI";

import {
  getCartDetails,
  removeCartItem,
  updateCartItem,
} from "../../API/Cart/CartAPI";
import { useLocation } from "react-router-dom";
import imgPlaceholder from "../../assets/images/img_placeholder.png";
import ProductListItemAdmin from "./ProductListItemAdmin";
import { getAllProducts, removeProduct } from "../../API/Products/ProductAPI";
import Button from "../Common/Button";
import { Link } from "react-router-dom";
import { VIEWS } from "../../utils/Views";
import { awsS3UrlGenerate } from "../../utils/Utilities";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

export default function ProductListAdmin() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cartId = searchParams.get("id");
  const [bearerToken, setBearerToken] = useState("");
  const [productList, setProductList] = useState([]) as any;
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Retrieve the bearer token from localStorage or wherever you store it
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
  }, []);

  useEffect(() => {
    setTimeout(async () => {
      const getAllProductsResponse = await getAllProducts(pageNumber);
      if (getAllProductsResponse.success) {
        setProductList((prev: any) => {
          return [...prev, ...getAllProductsResponse.data];
        });
        setLoading(false);
      } else {
        console.log("Error:", getAllProductsResponse.error);
      }
    }, 0);
  }, [pageNumber]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setLoading(true);
      setPageNumber((prev: any) => prev + 1);
    }
  };

  const handleRemoveProduct = async (id: any) => {
    // Show the confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await removeProduct(bearerToken, { id: id });

      if (response.success) {
        // Handle the successful response
        console.log(response.data);
        // fetchProducts(pageNumber);
        toast.success("Product deleted successfully..!!");
      } else {
        // Handle the error case
        console.error(response.error);
      }
    } catch (error) {
      // Handle any exception during the API call
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <div className="px-24 mt-20 w-screen">
        <ToastContainer />
        <div className="mt-1/2 w-1/2 pt-10 mb-4">
          <Link to={VIEWS.ADMIN_ADD_PRODUCT}>
            <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
              + Add New Product
            </button>
          </Link>
        </div>

        <div className="min-h-screen h-fit">
          <table className="w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-300">
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-left">Color</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Discount</th>
                <th className="py-3 px-4 text-left">Quantity</th>
                <th className="py-3 px-4 text-left hover:po">Action</th>
              </tr>
            </thead>
            <tbody>
              {productList?.map((item: any, index: any) => (
                <ProductListItemAdmin
                  key={index.toString()}
                  productId={item.id}
                  name={item.name}
                  color={item.color}
                  price={item.price}
                  discount={item.discount}
                  quantity={item.quantity}
                  description={item.description}
                  image={awsS3UrlGenerate(item?.image[0]) || imgPlaceholder}
                  onRemoveProduct={handleRemoveProduct}
                />
              ))}
            </tbody>
          </table>
          {loading && <p>Loading....</p>}
          <div className="h-24"></div>
        </div>
      </div>
    </React.Fragment>
  );
}
