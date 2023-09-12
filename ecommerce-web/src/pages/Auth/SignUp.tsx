import React, { useState } from "react";
import TopNav from "../../components/Common/TopNav";
import { Link, useNavigate } from "react-router-dom";
import { VIEWS } from "../../utils/Views";
import InputField from "../../components/Common/InputField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { registerUser } from "../../API/Auth/AuthAPI";
import Footer from "../../components/Common/Footer";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const checkEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const signInToPlatform = async () => {
    if (email === "") {
      toast.error("Please enter email..!!");
    } else if (!checkEmail.test(email)) {
      toast.error("Please enter valid email..!!");
    } else if (firstName === "") {
      toast.error("Please enter first name..!!");
    } else if (lastName === "") {
      toast.error("Please enter last name..!!");
    } else if (password === "") {
      toast.error("Please enter password..!!");
    } else if (confirmPassword === "") {
      toast.error("Please enter confirm password..!!");
    } else if (password !== confirmPassword) {
      toast.error("Confirm password is not match..!!");
    } else {
      try {
        setLoadingSpinner(true);
        const data = {
          email,
          firstName,
          lastName,
          password,
        };
        const response = await registerUser(data);
        if (response.success) {
          console.log("RESPONSE", response.data);
          setEmail("");
          setFirstName("");
          setLastName("");
          setPassword("");
          navigate(VIEWS.SIGNIN);
        } else {
          setLoadingSpinner(false);
          toast.error(response.error);
        }
      } catch (error: any) {
        setLoadingSpinner(false);
      }
    }
  };

  return (
    <React.Fragment>
      <div className="mt-24">
        <TopNav notificationCount={0}/>
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <div className="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
          <InputField
            label="Email"
            type="email"
            placeholder="johnanderson@example.com"
            value={email}
            onChange={setEmail}
          />
          <InputField
            label="First Name"
            type="text"
            placeholder="John"
            value={firstName}
            onChange={setFirstName}
          />
          <InputField
            label="Last Name"
            type="text"
            placeholder="Anderson"
            value={lastName}
            onChange={setLastName}
          />
          <InputField
            label="Password"
            type="password"
            placeholder="**************"
            value={password}
            onChange={setPassword}
          />
          <InputField
            label="Confirm Password"
            type="password"
            placeholder="**************"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          <button
            onClick={signInToPlatform}
            className="w-full h-14 bg-emerald-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-emerald-600 transition duration-300"
            type="submit"
          >
            Sign Up
          </button>
          <p className="block text-gray-700 text-sm font-semibold mt-5 text-center">
            Have an account?{" "}
            <Link
              to={VIEWS.SIGNIN}
              className="text-emerald-500 hover:text-emerald-600 hover:underline"
            >
              Sign In Here
            </Link>
          </p>
        </div>
        <Footer />
      </div>
      {loadingSpinner ? <LoadingSpinner /> : null}
      <ToastContainer />
    </React.Fragment>
  );
}
