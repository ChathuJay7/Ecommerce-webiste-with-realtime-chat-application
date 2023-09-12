import React, { useEffect, useState } from 'react'
import InputField from '../Common/InputField'
import Button from '../Common/Button';
import { addNewUser, getSingleUser, updateUserRole } from '../../API/User/UserAPI';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from '../Common/LoadingSpinner';


const AddUserAdmin = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get("id");
    const [bearerToken, setBearerToken] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [userrole, setUserRole] = useState("CUSTOMER");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setBearerToken(token);
        }

        if (userId) {
            handleGetUserDetails(userId);
        }
    }, []);

    useEffect(() => {
      console.log("User role updated:", userrole);
    }, [userrole]);

    const handleUserRoleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setUserRole(e.target.value);
        console.log(e.target.value)
    };

    const handleGetUserDetails = async (userId: any) => {
        const getUserDetailsResponse = await getSingleUser({ id: userId });
        if (getUserDetailsResponse.success) {
            const user = getUserDetailsResponse.data;
            setUserRole(user.role);
        } else {
            console.log("Error:", getUserDetailsResponse.error);
            toast.error(getUserDetailsResponse.error);
        }
    };

    const handleUpdateUser = async () => {

        const payload: any = {
            id: userId,
            role: userrole,
        };

        if(userrole === ""){
          toast.error("Please enter user role..!!");
        } else {
          try {
            setIsLoading(true);
            const response = await updateUserRole(payload);
            if (response.success) {
              console.log(response.data)
                toast.success("User role changed successfully");
                setIsLoading(false);
                //navigate(VIEWS.ADMIN_USERS);
            } else {
                toast.error(response.error);
                setIsLoading(false);
                console.error(response.error)
            }
          } catch (error) {
              console.log(error);
              setIsLoading(false);
              console.error(error)
          }
        }
        
        
    };
    


    const handleAddNewUser = async () => {
        // Create the payload with the logged-in user ID and the selected user ID
        const payload = {
            firstName: firstname,
            lastName: lastname,
            email: email,
            role: userrole,
            password: "User1234#"
        };
    
        if(firstname === ""){
          toast.error("Please enter first name..!!");
        } else if(lastname === ""){
          toast.error("Please enter last name..!!");
        } else if(email === ""){
          toast.error("Please enter email..!!");
        } else if(userrole === ""){
          toast.error("Please enter user role..!!");
        } else {
          try{
            setIsLoading(true);

            const response = await addNewUser(payload, bearerToken);
    
            if (response.success) {
              setIsLoading(false);
              toast.success("User added successfully");
              //navigate(VIEWS.ADMIN_USERS);

            } else {
              console.error(response.error);
              setIsLoading(false);
              toast.error(response.error);
            }
          } catch (error) {
            console.log(error);
            setIsLoading(false);
            console.error(error)
          }
        }

    };


    const handleSubmit = () => {
        if(userId) {
            handleUpdateUser()
        } else {
            handleAddNewUser()
        }
    }

    return (
        <React.Fragment>
          <div className="mt-24 items-center justify-center w-screen">
            {isLoading ? <LoadingSpinner /> : null}
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-6 text-center">
              {userId ? "Update User" : "Add New User"}
            </h1>
            <div className="w-[600px] mx-auto bg-white p-8 rounded-md shadow-md">
              {!userId && (
                <React.Fragment>
                  <InputField
                    label="First Name"
                    type="text"
                    placeholder="John"
                    value={firstname}
                    onChange={setFirstname}
                  />
                  <InputField
                    label="Last Name"
                    type="text"
                    placeholder="Doe"
                    value={lastname}
                    onChange={setLastname}
                  />
                  <InputField
                    label="Email"
                    type="email"
                    placeholder="johndoe@gmail.com"
                    value={email}
                    onChange={setEmail}
                  />
                </React.Fragment>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userRole">
                  User Role
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                  id="userRole"
                  value={userrole}
                  onChange={handleUserRoleChange}
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <Button name={userId ? "Update User" : "Add New User"} handleAction={handleSubmit} />
            </div>
          </div>
        </React.Fragment>
      );
      
}

export default AddUserAdmin