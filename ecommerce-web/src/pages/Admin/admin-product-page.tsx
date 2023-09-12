import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllProducts } from "../../API/Products/ProductAPI";
import TopNavAdmin from "../../components/Admin/TopNavAdmin";
import SideBarAdmin from "../../components/Admin/SideBarAdmin";
import ProductListAdmin from "../../components/Admin/ProductListAdmin";


export default function ProductPageAdmin() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cartId = searchParams.get("id");
  const [bearerToken, setBearerToken] = useState("");
  const [productList, setProductList] = useState([]) as any;
  const [pageNumber, setPageNumber] = useState(1);
  
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [location]);

  const fetchProducts = async () => {
    const getAllProductsResponse = await getAllProducts(pageNumber);
    if (getAllProductsResponse.success) {
      setProductList(getAllProductsResponse.data);
    } else {
      console.log("Error:", getAllProductsResponse.error);
    }
  };

  console.log(productList)

  return (
    <React.Fragment>
      <TopNavAdmin notificationCount={0} />
      <div className="flex bg-gray-200 mt-18 ">
          <SideBarAdmin />
          <ProductListAdmin />
      </div>
    </React.Fragment>
  );
}
