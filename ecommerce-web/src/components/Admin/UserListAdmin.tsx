import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { VIEWS } from "../../utils/Views";
import { getAllUsers, removeUser } from "../../API/User/UserAPI";
import UserListItemAdmin from "./UserListItemAdmin";
import { ToastContainer, toast } from "react-toastify";

export default function UserListAdmin() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [bearerToken, setBearerToken] = useState("");
  const [userList, setUserList] = useState([]) as any;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [location]);

  const fetchUsers = async () => {
    const getAllUsersResponse = await getAllUsers();
    if (getAllUsersResponse.success) {
      setUserList(getAllUsersResponse.data);
    } else {
      console.log("Error:", getAllUsersResponse.error);
    }
  };

  const handleRemoveUser = async (id: any) => {

    const userRole = userList.find((item: any) => item.id === id)?.role;

    if (userRole === 'ADMIN') {
      toast.error("Cannot delete user with role ADMIN..!!");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) {
      return; 
    }

    try {
      const response = await removeUser(bearerToken, { id: id });

      if (response.success) {
        console.log(response.data);
        toast.success("User deleted successfully..!!");
        fetchUsers();
      } else {
        console.error(response.error);
      }
  
      
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <React.Fragment>
        <div className="px-24 mt-20 w-screen">
          <ToastContainer />
            <div className="mt-1/2 w-1/2 pt-10 mb-4">
                <Link to={VIEWS.ADMIN_ADD_USER}>
                    <button
                    className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                    >+ Add New User</button>
                </Link>
            </div>

            <div className="h-screen w-full">
                <table className="w-full bg-white border border-gray-300">
                    <thead>
                    <tr className="bg-gray-300">
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Role</th>
                        <th className="py-3 px-4 text-left">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userList?.map((item: any, index: any) => (
                        <UserListItemAdmin
                        key={index.toString()}
                        userId={item.id}
                        email={item.email}
                        firstName={item.firstName}
                        lastName={item.lastName}
                        role={item.role}
                        onRemoveUser={handleRemoveUser}
                        />
                    ))}
                    </tbody>
                </table>
            </div>

        </div>

    </React.Fragment>
  );
}
