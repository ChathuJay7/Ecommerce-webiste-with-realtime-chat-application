import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { VIEWS } from "../../utils/Views";
import { Link } from "react-router-dom";

export default function UserListItemAdmin(props: {
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    role: string,
    onRemoveUser: (id: string) => void;
    }) {
  
  const [bearerToken, setBearerToken] = useState("");
  const navigate = useNavigate();

  const handleViewSingleUser = () => {
    navigate(`${VIEWS.ADMIN_SINGLE_USER + "?id=" + props.userId}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
  }, []);

  const handleRemovUser = async (id: any) => {
    props.onRemoveUser(props.userId);
  }

  return (
    <tr className="border-b border-gray-200">
      <td className="py-2 px-4 cursor-pointer" onClick={handleViewSingleUser}>
        <p className="text-gray-900 text-lg font-semibold">{props.firstName + " " + props.lastName}</p>
      </td>
      <td className="py-2 px-4">
        <p className="text-gray-900 text-lg font-semibold">{props.email}</p>
      </td>
      <td className="py-2 px-4">
        <p className="text-gray-900 text-lg font-semibold">{props.role}</p>
      </td>
      <td className="py-2 px-4">
        <Link to={VIEWS.ADMIN_UPDATE_USER + "?id=" + props.userId}><button className="mr-2"><i className="fas fa-edit"></i></button></Link>
        <button onClick={handleRemovUser} className="text-red-500"><i className="fas fa-trash-alt"></i></button>
      </td>

    </tr>
  );
}
