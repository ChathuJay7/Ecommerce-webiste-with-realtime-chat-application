import React from "react";
import SideBarAdmin from "../../components/Admin/SideBarAdmin";
import AddProductAdmin from "../../components/Admin/AddProductAdmin";
import TopNavAdmin from "../../components/Admin/TopNavAdmin";
import AddCategoryAdmin from "../../components/Admin/AddCategoryAdmin";

export default function AdminAddCategory() {
  return (
    <React.Fragment>
      <TopNavAdmin notificationCount={0} />
      <div className="flex bg-gray-200 mt-18 min-h-screen h-full">
        {/* Sidebar */}
        <SideBarAdmin />

        {/* Main Content */}

        <AddCategoryAdmin />
      </div>
    </React.Fragment>
  );
}
