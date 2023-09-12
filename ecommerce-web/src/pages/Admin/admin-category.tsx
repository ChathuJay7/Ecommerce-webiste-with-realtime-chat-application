import React, { useEffect, useState } from "react";
import TopNavAdmin from "../../components/Admin/TopNavAdmin";
import SideBarAdmin from "../../components/Admin/SideBarAdmin";
import CategoryListAdmin from "../../components/Admin/CategoryListAdmin";

export default function CategoryPageAdmin() {
  return (
    <React.Fragment>
      <TopNavAdmin notificationCount={0} />
      <div className="flex bg-gray-200 mt-18 h-full w-full">
        <SideBarAdmin />
        <CategoryListAdmin />
      </div>
    </React.Fragment>
  );
}
