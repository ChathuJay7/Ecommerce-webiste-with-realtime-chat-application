import React, { useEffect, useState } from "react";
import TopNavAdmin from "../../components/Admin/TopNavAdmin";
import SideBarAdmin from "../../components/Admin/SideBarAdmin";
import UpdateCategoryAdmin from "../../components/Admin/UpdateCategoryAdmin";

export default function AdminUpdateCategory() {
  return (
    <React.Fragment>
      <TopNavAdmin notificationCount={0} />
      <div className="flex bg-gray-200 mt-18 min-h-screen h-full w-full">
        <SideBarAdmin />
        <UpdateCategoryAdmin />
      </div>
    </React.Fragment>
  );
}
