import React, { useState } from "react";
import { Link, useNavigate, redirect } from "react-router-dom";
import { VIEWS } from "../../utils/Views";
import TopNav from "../../components/Common/TopNav";
import InputField from "../../components/Common/InputField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { loginUser } from "../../API/Auth/AuthAPI";
import {
  loginPending,
  loginSuccess,
  loginFail,
} from "../../app/Redux/Auth/AuthSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import ErrorAlert from "../../components/Common/ErrorAlert";
import Footer from "../../components/Common/Footer";
import { decodeJwt } from "../../utils/Utilities";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const dispatch = useAppDispatch();
  const { isLoading, isAuth, errorMsg } = useAppSelector((state) => state.auth);

  const signInToPlatform = async () => {
    if (email === "") {
      toast.error("Please enter email..!!");
    } else if (!checkEmail.test(email)) {
      toast.error("Please enter valid email..!!");
    } else if (password === "") {
      toast.error("Please enter password..!!");
    } else {
      try {
        dispatch(loginPending());
        const data = {
          email,
          password,
        };
        const response = await loginUser(data);
        if (response.success) {
          localStorage.setItem("accessToken", response.data.access_token);
          setEmail("");
          setPassword("");
          dispatch(loginSuccess());
          const decodedToken = decodeJwt(response.data.access_token);
          {
            decodedToken.role === "ADMIN"
              ? navigate(VIEWS.ADMIN_DASHBOARD)
              : navigate(VIEWS.HOME);
          }
        } else {
          dispatch(loginFail(response.error));
          toast.error(response.error);
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  return (
    <React.Fragment>
      <div className="mt-24">
        <TopNav notificationCount={0}        />
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <div className="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
          <InputField
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={setEmail}
          />
          <InputField
            label="Password"
            type="password"
            placeholder="**************"
            value={password}
            onChange={setPassword}
          />
          <button
            className="w-full h-14 bg-emerald-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-emerald-600 transition duration-300"
            type="submit"
            onClick={signInToPlatform}
          >
            Sign In
          </button>
          <p className="block text-gray-700 text-sm font-semibold mt-5 text-center">
            Don't have an account?{" "}
            <Link
              to={VIEWS.SIGNUP}
              className="text-emerald-500 hover:text-emerald-600 hover:underline"
            >
              Sign Up Here
            </Link>
          </p>
          <p className="block text-gray-700 text-sm font-semibold mt-5 text-center">
            Forgot your password?{" "}
            <Link
              to={VIEWS.FORGOTPASSWORD}
              className="text-emerald-500 hover:text-emerald-600 hover:underline"
            >
              Click Here
            </Link>
          </p>
        </div>
        <Footer />
      </div>
      {isLoading ? <LoadingSpinner /> : null}
      <ToastContainer />
    </React.Fragment>
  );
}
