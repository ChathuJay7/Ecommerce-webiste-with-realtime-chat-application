import React, { useEffect, useState } from "react";
import TopNav from "../../components/Common/TopNav";
import InputField from "../../components/Common/InputField";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Footer from "../../components/Common/Footer";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VIEWS } from "../../utils/Views";
import { resetPassword } from "../../API/Auth/AuthAPI";
import { IResetPassword } from "../../API/Auth/interfaces/reset-password-data.interface";

export default function ResetPassword() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(typeof token, token);
  }, []);

  const handleResetPassword = async () => {
    if (newPassword === "") {
      toast.error("Please enter new password..!!");
    } else if (confirmPassword === "") {
      toast.error("Please enter confirm password..!!");
    } else if (newPassword !== confirmPassword) {
      toast.error("Confirm password not match..!!");
    } else {
      try {
        setIsLoading(true);
        const data: IResetPassword = {
          password: newPassword,
          confirmPassword: confirmPassword,
          resetToken: token || "",
        };
        const response = await resetPassword(data);
        console.log(response);
        if (response.success) {
          navigate(VIEWS.SIGNIN);
        } else {
          toast.error(response.error);
          setIsLoading(false);
        }
        setIsLoading(false);
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
        <h1 className="text-2xl font-bold mb-6 text-center mt-36">
          Reset Password
        </h1>
        <div className="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md">
          <InputField
            label="New Password"
            type="password"
            placeholder="*************"
            value={newPassword}
            onChange={setNewPassword}
          />
          <InputField
            label="Confirm Password"
            type="password"
            placeholder="*************"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          <button
            className="w-full h-14 bg-emerald-500 text-white text-sm font-bold py-2 px-4 rounded-md hover:bg-emerald-600 transition duration-300"
            type="submit"
            onClick={handleResetPassword}
          >
            Reset Password
          </button>
        </div>
        <Footer />
      </div>
      {isLoading ? <LoadingSpinner /> : null}
      <ToastContainer />
    </React.Fragment>
  );
}
