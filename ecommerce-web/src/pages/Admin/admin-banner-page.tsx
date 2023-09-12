import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import imgPlaceholder from "../../assets/images/img_placeholder.png";
import Button from "../../components/Common/Button";
import TopNavAdmin from "../../components/Admin/TopNavAdmin";
import SideBarAdmin from "../../components/Admin/SideBarAdmin";
import OrderListAdmin from "../../components/Admin/OrderListAdmin";
import BannerImagesAdmin from "../../components/Admin/BannerImagesAdmin";


export default function BannerPageAdmin() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [bearerToken, setBearerToken] = useState("");


  useEffect(() => {
    // Retrieve the bearer token from localStorage or wherever you store it
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
  }, []);

  return (
    <React.Fragment>
      <TopNavAdmin notificationCount={0} />
      <div className="flex bg-gray-200 mt-18 ">
        {/* Sidebar */}

          <SideBarAdmin />

        
        {/* Main Content */}

          <BannerImagesAdmin />

      </div>
    </React.Fragment>
  );
}
