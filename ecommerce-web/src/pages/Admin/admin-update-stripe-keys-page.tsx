import React, { useEffect, useState } from "react";
import TopNavAdmin from "../../components/Admin/TopNavAdmin";
import SideBarAdmin from "../../components/Admin/SideBarAdmin";
import UpdateStripeKeysAdmin from "../../components/Admin/UpdateStripeKeysAdmin";


export default function UpdateStripeKeysPageAdmin() {
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
      <div className="flex bg-gray-200 mt-18 ">
          <SideBarAdmin />
          <UpdateStripeKeysAdmin />
      </div>
    </React.Fragment>
  );
}
