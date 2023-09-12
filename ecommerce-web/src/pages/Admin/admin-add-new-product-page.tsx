import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TopNavAdmin from "../../components/Admin/TopNavAdmin";
import SideBarAdmin from "../../components/Admin/SideBarAdmin";
import AddProductAdmin from "../../components/Admin/AddProductAdmin";



export default function AddNewProductPageAdmin() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [bearerToken, setBearerToken] = useState("");


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
  }, []);

  return (
    <React.Fragment>
      <TopNavAdmin notificationCount={0} />
      <div className="flex bg-gray-200 mt-18">
        <SideBarAdmin />
        <AddProductAdmin/>
      </div>
    </React.Fragment>
  );
}
