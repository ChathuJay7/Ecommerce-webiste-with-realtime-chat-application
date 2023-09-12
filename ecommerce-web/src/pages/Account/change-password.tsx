import React, { useEffect, useState } from "react";
import InputField from "../../components/Common/InputField";
import Button from "../../components/Common/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { changePassword } from "../../API/Auth/AuthAPI";
import { IChangePassword } from "../../API/Auth/interfaces/change-password-data.interface";
import { useLocation } from "react-router-dom";

export default function ChangePassword() {
  const accessToken: string | null = localStorage.getItem("accessToken");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    if (oldPassword === "") {
      toast.error("Please enter current password..!!");
    } else if (newPassword === "") {
      toast.error("Please enter new password..!!");
    } else if (confirmPassword === "") {
      toast.error("Please enter confirm password..!!");
    } else if (newPassword !== confirmPassword) {
      toast.error("Confirm password not match..!!");
    } else {
      try {
        setIsLoading(true);
        const data: IChangePassword = {
          oldPassword: oldPassword,
          password: confirmPassword,
        };
        const response = await changePassword(data, accessToken);
        console.log(response);
        if (response.success) {
          toast.success(response.data.message);
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setIsLoading(false);
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
      <div className="mt-5 w-full bg-slate-200 rounded-lg h-fit p-10">
        <h1 className="font-bold text-xl text-slate-700">
          Change your account password
        </h1>
        <div className="lg:w-3/4  w-full bg-white p-8 rounded-lg shadow-md mt-12">
          <InputField
            label="Current password"
            type="password"
            placeholder="************"
            value={oldPassword}
            onChange={setOldPassword}
          />
          <InputField
            label="New password"
            type="password"
            placeholder="************"
            value={newPassword}
            onChange={setNewPassword}
          />
          <InputField
            label="Confirm new password"
            type="password"
            placeholder="************"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          <Button name="Change Password" handleAction={handleChangePassword} />
        </div>
      </div>
      {isLoading ? <LoadingSpinner /> : null}
      <ToastContainer />
    </React.Fragment>
  );
}
