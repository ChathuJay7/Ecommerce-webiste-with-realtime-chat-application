import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VIEWS } from "../../utils/Views";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { resetUser } from "../../app/Redux/User/UserSlice";
import { resetChat } from "../../app/Redux/Chat/ChatSlice";
import { logOut } from "../../app/Redux/Auth/AuthSlice";

export default function TopNavAdmin(props: {
  notificationCount: any;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.user);
  const [isShowDropDown, setIsShowDropDown] = useState(false);
  const [bearerToken, setBearerToken] = useState("");


  useEffect(() => {
    // Retrieve the bearer token from localStorage or wherever you store it
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
  }, []);


  const handleDropDown = () => {
    setIsShowDropDown(!isShowDropDown);
  };

  const handleSignIn = () => {
    navigate(VIEWS.SIGNIN);
  };

  const handleSignOut = () => {
    dispatch(resetUser());
    dispatch(resetChat());
    dispatch(logOut());
    localStorage.removeItem("accessToken"); 
    navigate(VIEWS.SIGNIN);
  };


  return (
    <div>
      <nav className="fixed top-0 left-0 z-20 w-full bg-gray-900 h-20">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
          <Link to={VIEWS.ADMIN_DASHBOARD} className="flex items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              🛒 E-commerce App
            </span>
          </Link>
          <div className="flex md:order-2">
            {isAuth ? (
              <div className="flex flex-row items-center justify-center">
                <button
                  onClick={handleDropDown}
                  type="button"
                  className="flex flex-row justify-start items-center bg-emerald-500 hover:bg-emerald-700 text-white focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0"
                >
                  {user ? user.firstName + " " + user.lastName : null}
                  <i className="fa-solid fa-caret-down ml-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                type="button"
                className="flex flex-row justify-start items-center bg-emerald-500 hover:bg-emerald-700 text-white focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0"
              >
                Sign In
              </button>
            )}
            {isShowDropDown ? (
              <div className="absolute bg-slate-100 rounded-md min-h-fit w-40 m-5 p-3 right-10 top-12 shadow-2xl">
                <ul className="flex flex-col justify-start items-start w-full">
                  <button
                    className="my-2"
                    onClick={() => navigate(VIEWS.ADMIN_MY_ACCOUNT)}
                  >
                    <i className="fa-regular fa-user" /> My Account
                  </button>
                  <button className="my-2" onClick={handleSignOut}>
                    <i className="fa-solid fa-arrow-right-from-bracket" />{" "}
                    Sign Out
                  </button>
                </ul>
              </div>
            ) : null}
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          ></div>

        </div>
      </nav>
    </div>
  );
}
