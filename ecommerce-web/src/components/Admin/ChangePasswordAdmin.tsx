import React, { useEffect, useState } from "react";
import InputField from "../../components/Common/InputField";
import Button from "../../components/Common/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { changePassword } from "../../API/Auth/AuthAPI";
import { IChangePassword } from "../../API/Auth/interfaces/change-password-data.interface";
import { useNavigate } from "react-router-dom";
import { VIEWS } from "../../utils/Views";

export default function ChangePasswordAdmin() {
  const accessToken: string | null = localStorage.getItem("accessToken");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      <div className="mt-24 items-center justify-center w-screen h-screen">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Change Password
        </h1>
        <div className="w-[600px]  mx-auto bg-white p-8 rounded-md shadow-md mb-10">
            <div>
                <button className="rounded-full border-2 p-3 h-fit w-fit m-2" onClick={() => navigate(VIEWS.ADMIN_MY_ACCOUNT)}>
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
            </div>
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
