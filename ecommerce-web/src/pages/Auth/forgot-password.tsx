import React, { useState } from "react";
import TopNav from "../../components/Common/TopNav";
import InputField from "../../components/Common/InputField";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "../../components/Common/Footer";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { VIEWS } from "../../utils/Views";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgotPassword } from "../../API/Auth/AuthAPI";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState(false);

  const handleForgotPassword = async () => {
    if (email === "") {
      toast.error("Please enter email..!!");
    } else {
      try {
        setIsLoading(true);
        const response = await forgotPassword(email);
        if (response.success) {
          setIsLoading(false);
          setEmailStatus(true);
          toast.success(response.data.message);
        } else {
          toast.error(response.error);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
  };

  return (
    <React.Fragment>
      <div className="mt-24">
        <TopNav notificationCount={0} />
        <h1 className="text-2xl font-bold mb-6 text-center mt-48">
          Forgot Password
        </h1>
        <div className="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md h-fit">
          {emailStatus ? (
            <div className="flex flex-col justify-center items-center mb-20">
              <i className="fa-regular fa-circle-check text-5xl mb-10 text-emerald-500"></i>
              <h1 className="text-center text-md font-semibold text-slate-800">
                Successfully send reset password link to{" "}<br/>
                <span className="text-slate-500 font-normal">{email}</span>{" "}
                <br />
                Please check your email.
              </h1>
            </div>
          ) : (
            <div>
              <InputField
                label="Email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={setEmail}
              />
              <button
                className="w-full h-14 bg-emerald-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-emerald-600 transition duration-300"
                type="submit"
                onClick={handleForgotPassword}
              >
                Send Password Reset Link
              </button>
              <p className="block text-gray-700 text-sm font-semibold mt-5 text-center">
                Have you a password?{" "}
                <Link
                  to={VIEWS.SIGNIN}
                  className="text-emerald-500 hover:text-emerald-600 hover:underline"
                >
                  Sign In Here
                </Link>
              </p>
            </div>
          )}
        </div>
        <Footer />
      </div>
      {isLoading ? <LoadingSpinner /> : null}
      <ToastContainer />
    </React.Fragment>
  );
}
