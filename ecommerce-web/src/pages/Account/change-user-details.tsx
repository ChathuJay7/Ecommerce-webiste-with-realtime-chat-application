import React, { useEffect, useState } from "react";
import { VIEWS } from "../../utils/Views";
import { useLocation, useNavigate } from "react-router-dom";
import InputField from "../../components/Common/InputField";
import Button from "../../components/Common/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { getSingleUser, updateSingleUser } from "../../API/User/UserAPI";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IUserData } from "../../API/User/interfaces/user-data.interface";
import { loggedInUser } from "../../app/Redux/User/UserActions";

export default function ChangeUserDetails() {
  const dispatch = useAppDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    handleGetUserDetails();
  }, []);

  const handleGetUserDetails = async () => {
    const response = await getSingleUser({
      id: user.id,
    });
    if (response.success) {
      setFirstName(response.data.firstName);
      setLastName(response.data.lastName);
      setEmail(response.data.email);
    } else {
      console.log("Error:", response.error);
    }
  };

  const handleChangeUserDetails = async () => {
    if (firstName === "") {
      toast.error("First name can not be empty..!!");
    } else if (lastName === "") {
      toast.error("Last name can not be empty..!!");
    } else {
      try {
        setIsLoading(true);
        const data: IUserData = {
          id: user.id,
          firstName,
          lastName,
        };
        const response = await updateSingleUser(data);
        if (response.success) {
          dispatch(loggedInUser(user.id));
          toast.success("Profile updated success");
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
      <div className="mt-5 w-full bg-slate-200 rounded-lg h-fit p-10">
        <h1 className="font-bold text-xl text-slate-700">
          Change profile details
        </h1>
        <div className="lg:w-3/4 w-full bg-white p-8 rounded-lg shadow-md mt-12">
          <InputField
            label="First name"
            type="text"
            placeholder="John"
            value={firstName || ""}
            onChange={setFirstName}
          />
          <InputField
            label="Last name"
            type="text"
            placeholder="Anderson"
            value={lastName || ""}
            onChange={setLastName}
          />
          <InputField
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={setEmail}
            disabled={true}
          />
          <Button
            name="Update Details"
            handleAction={handleChangeUserDetails}
          />
        </div>
      </div>
      {isLoading ? <LoadingSpinner /> : null}
      <ToastContainer />
    </React.Fragment>
  );
}
