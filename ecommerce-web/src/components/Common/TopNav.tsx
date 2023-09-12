import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VIEWS } from "../../utils/Views";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { resetUser } from "../../app/Redux/User/UserSlice";
import { logOut } from "../../app/Redux/Auth/AuthSlice";
import { getCartDetailsByUser } from "../../API/Cart/CartAPI";
import Notification from "../Chat/Notification";

export default function TopNav(props: { notificationCount: any }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector((state) => state.auth);
  const { user } = useAppSelector((state) => state.user);
  const [isShowDropDown, setIsShowDropDown] = useState(false);
  const [bearerToken, setBearerToken] = useState("");
  const [cart, setCart] = useState<any>({});

  useEffect(() => {
    // Retrieve the bearer token from localStorage or wherever you store it
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCartDetailsByUser(bearerToken, user);

        if (response.success) {
          // Handle the successful response
          setCart(response.data);
        } else {
          // Handle the error case
          console.error(response.error);
        }
      } catch (error) {
        // Handle any exception during the API call
        console.error(error);
      }
    };
    fetchCart();
  }, []);

  const handleDropDown = () => {
    setIsShowDropDown(!isShowDropDown);
  };

  const handleSignIn = () => {
    navigate(VIEWS.SIGNIN);
  };

  const handleSignOut = () => {
    dispatch(resetUser());
    dispatch(logOut());
    localStorage.clear();
    navigate(VIEWS.SIGNIN);
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 z-20 w-full bg-gray-900">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
          <Link to={VIEWS.HOME} className="flex items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              🛒 E-commerce App
            </span>
          </Link>
          <div className="flex md:order-2">
            <div
              className="hidden w-full md:block md:w-auto"
              id="navbar-default"
            >
              <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border md:flex-row md:space-x-8 md:mt-0 md:border-0 md:mr-8">
                <li>
                  <Link
                    to={VIEWS.HOME}
                    className="block py-2 pl-2 pr-4 text-gray-100 hover:text-emerald-500"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to={VIEWS.PRODUCTS}
                    className="block py-2 pl-2 pr-4 text-gray-100 hover:text-emerald-500"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to={VIEWS.CONTACT}
                    className="block py-2 pl-2 pr-4 text-gray-100 hover:text-emerald-500"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            {isAuth ? (
              <div className="flex flex-row items-center justify-center">
                <Link
                  to={`${VIEWS.CART + "?id=" + cart.id}`}
                  className="block py-2 pl-2 pr-4 text-gray-100 hover:text-emerald-500"
                >
                  <span className="relative text-slate-200 text-lg mr-10 cursor-pointer w-10 h-10 rounded-full bg-emerald-600 flex justify-center items-center">
                    <i className="fa-solid fa-cart-shopping"></i>
                    {cart.cartItems && cart.cartItems.length > 0 && (
                      <span className="text-sm p-2 absolute top-8 left-5 flex flex-row items-center justify-center rounded-full bg-rose-600 w-fit h-3">
                        {cart.cartItems.length}
                      </span>
                    )}
                  </span>
                </Link>
                <Notification
                  emptyReadListCount={props.notificationCount}
                ></Notification>
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
                    onClick={() => navigate(VIEWS.MYACCOUNT)}
                  >
                    <i className="fa-regular fa-user" /> My Account
                  </button>
                  <button
                    className="my-2"
                    onClick={() => navigate(VIEWS.MY_ORDERS)}
                  >
                    <i className="fa-regular fa-circle-check"></i> My Orders
                  </button>
                  <button className="my-2" onClick={handleSignOut}>
                    <i className="fa-solid fa-arrow-right-from-bracket" /> Sign
                    Out
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
