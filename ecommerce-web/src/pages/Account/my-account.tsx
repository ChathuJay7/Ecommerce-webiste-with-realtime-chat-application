import React, { useEffect, useState } from "react";
import TopNav from "../../components/Common/TopNav";
import Footer from "../../components/Common/Footer";
import { Link, Outlet } from "react-router-dom";
import { VIEWS } from "../../utils/Views";

export default function MyAccount() {
  const [isOpenAccountDetails, setIsOpenAccountDetails] = useState(true);
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);

  const handleChangeTab = (tabName: string) => {
    switch (tabName) {
      case "CHANGE_USER_DETAILS":
        setIsOpenAccountDetails(true);
        setIsOpenChangePassword(false);
        break;
      case "CHANGE_PASSWORD":
        setIsOpenAccountDetails(false);
        setIsOpenChangePassword(true);
        break;
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <TopNav notificationCount={0} />
      <div className="p-20 mt-24 mb-48 h-screen">
        <h1 className="text-3xl text-slate-900 font-bold mb-14">
          <i className="fa-regular fa-user" /> My Account
        </h1>
        <div>
          <div className="flex flex-row w-full">
            <Link
              className={`${
                isOpenAccountDetails
                  ? "bg-slate-700 text-slate-100"
                  : "bg-slate-300 hover:bg-slate-700 text-slate-700 hover:text-slate-100"
              } font-medium rounded-lg text-sm px-4 py-2 text-center mr-2`}
              to={VIEWS.CHANGEUSERDETAILS}
              onClick={() => handleChangeTab("CHANGE_USER_DETAILS")}
            >
              <i className="fa-solid fa-gear" /> Account Details
            </Link>
            <Link
              className={`${
                isOpenChangePassword
                  ? "bg-slate-700 text-slate-100"
                  : "bg-slate-300 hover:bg-slate-700 text-slate-700 hover:text-slate-100"
              } font-medium rounded-lg text-sm px-4 py-2 text-center mr-2`}
              to={VIEWS.CHANGEPASSWORD}
              onClick={() => handleChangeTab("CHANGE_PASSWORD")}
            >
              <i className="fa-solid fa-lock" /> Change Password
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
