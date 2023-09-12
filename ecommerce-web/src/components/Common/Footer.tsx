import React from "react";
import { Link } from "react-router-dom";
import { VIEWS } from "../../utils/Views";

export default function Footer() {
  return (
    <React.Fragment>
      <footer className="bg-gray-900 w-full mt-20">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a
              href="https://flowbite.com/"
              className="flex items-center mb-4 sm:mb-0"
            >
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                🛒 E-commerce App
              </span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-white sm:mb-0">
              <li>
                <Link to={VIEWS.HOME} className="mr-4 md:mr-6 ">
                  Home
                </Link>
              </li>
              <li>
                <Link to={VIEWS.PRODUCTS} className="mr-4 md:mr-6">
                  Products
                </Link>
              </li>
              <li>
                <Link to={VIEWS.HOME} className="mr-4 md:mr-6">
                  My Account
                </Link>
              </li>
              <li>
                <Link to={VIEWS.CONTACT} className="mr-4 md:mr-6">
                  Contact
                </Link>
              </li>
              <li>
                <Link to={VIEWS.CONTACT} className="mr-4 md:mr-6">
                  Terms and condition
                </Link>
              </li>
              <li>
                <Link to={VIEWS.CONTACT} className="">
                  Site map
                </Link>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-50" />
          <span className="block text-sm text-gray-200 text-center">
            © 2023{" "}
            <a href="https://www.softcodeit.com/" className="hover:underline">
              Softcodeit
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </React.Fragment>
  );
}
