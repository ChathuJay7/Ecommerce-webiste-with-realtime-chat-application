import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import TopNavAdmin from "../../components/Admin/TopNavAdmin";
import { getLoggedInUser } from "../../API/Auth/AuthAPI";
import { loggedInUser } from "../../app/Redux/User/UserActions";
import { getAllProducts } from "../../API/Products/ProductAPI";
import SideBarAdmin from "../../components/Admin/SideBarAdmin";
import { DashboardAdmin } from "../../components/Admin/DashboardAdmin";


export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accessToken: string | null = localStorage.getItem("accessToken");
  const [productList, setProductList] = useState([]) as any;
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    handleGetLoggedInUser();
    handleGetAllProducts();
  }, [dispatch]);

  const handleGetLoggedInUser = async () => {
    const loggedInUserResponse = await getLoggedInUser(accessToken);
    if (loggedInUserResponse.success) {
      dispatch(loggedInUser(loggedInUserResponse.data.userId));
    } else {
      console.log("Error:", loggedInUserResponse.error);
    }
  };

  const handleGetAllProducts = async () => {
    const getAllProductsResponse = await getAllProducts(pageNumber);
    if (getAllProductsResponse.success) {
      setProductList(getAllProductsResponse.data);
    } else {
      console.log("Error:", getAllProductsResponse.error);
    }
  };


  return (
    <React.Fragment>
      <TopNavAdmin notificationCount={0} />
      <div className="flex h-screen bg-gray-200 mt-18 ">
        <SideBarAdmin />
        <DashboardAdmin />
      </div>
    </React.Fragment>
  );
}
