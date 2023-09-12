import React, { useEffect, useState } from "react";
import Footer from "../../components/Common/Footer";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { VIEWS } from "../../utils/Views";
import TopNavAdmin from "./TopNavAdmin";
import { useAppSelector } from "../../app/hooks";
import { getSingleUser } from "../../API/User/UserAPI";

export default function MyAccountAdmin() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const [userDetails, setUserDetails] = useState([]) as any;

  useEffect(() => {
    getUserDetails(user.id);
  }, [user.id]);


  const getUserDetails = async (userId: any) => {
    const getUserDetailsResponse = await getSingleUser({ id: userId });
    if (getUserDetailsResponse.success) {
      setUserDetails(getUserDetailsResponse.data);
    } else {
      console.log("Error:", getUserDetailsResponse.error);
    }
  };

  return (
    <React.Fragment>
        <div className="p-5 mt-20 w-[80%] mx-auto h-screen">

            <section className="text-gray-700 body-font overflow-hidden bg-white justify-center items-center">
                <div className="container px-5 py-12 mx-auto">
                    <div className="mx-auto flex flex-row justify-between items-center w-[80%]">
                        <div>
                            <button className="rounded-full border-2 p-3 h-fit w-fit m-2" onClick={() => navigate(VIEWS.ADMIN_DASHBOARD)}>
                            <i className="fa-solid fa-arrow-left"></i>
                            </button>
                        </div>
                        <div className="flex flex-row">
                            <div className="mt-1/2 mb-4 mr-5">
                            <Link to={VIEWS.ADMIN_CHANGE_DETAILS}>
                                <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                                Change Details
                                </button>
                            </Link>
                            </div>
                            <div className="mt-1/2 mb-4">
                            <Link to={VIEWS.ADMIN_CHANGE_PASSWORD}>
                                <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                                Change Password
                                </button>
                            </Link>
                            </div>
                        </div>
                    </div>

                    

                    
                    
                    <div className="mx-auto flex flex-col items-center justify-start">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-[80%]">
                            <h1 className="text-gray-900 text-2xl font-medium mb-4">User Details</h1>
                            <div className="flex">
                                <span className="text-gray-700 mb-4 font-semibold w-[90px]">User Id </span><span>:  {userDetails.id}</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-700 mb-4 font-semibold w-[90px]">Firstname  </span><span>:  {userDetails.firstName}</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-700 mb-4 font-semibold w-[90px]">Lastname  </span><span>:  {userDetails.lastName}</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-700 mb-4 font-semibold w-[90px]">Email  </span><span>:  {userDetails.email}</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-700 mb-4 font-semibold w-[90px]">Role  </span><span>:  {userDetails.role}</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-700 mb-4 font-semibold w-[90px]">Address  </span><span>:  {userDetails.address}</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-700 mb-4 font-semibold w-[90px]">State  </span><span>:  {userDetails.state}</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-700 mb-4 font-semibold w-[90px]">Country  </span><span>:  {userDetails.country}</span>
                            </div>
                        </div>


                    </div>
                </div>
            </section>

            </div>
    </React.Fragment>
  );
}
