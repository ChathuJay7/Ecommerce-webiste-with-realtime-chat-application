import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VIEWS } from "../../utils/Views";

export default function OrderListItemAdmin(props: {
    orderId: string,
    subTotal: string,
    status: string,
    orderDate: string,
    userName: string,
    }) {
  
  const [bearerToken, setBearerToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
  }, []);

  const handleViewSingleProduct = () => {
    navigate(`${VIEWS.ADMIN_SINGLE_ORDER + "?id=" + props.orderId}`);
  };

  return (
    <tr className="border-b border-gray-200">
      <td className="py-2 px-4">
        <div className="flex items-center cursor-pointer" onClick={handleViewSingleProduct}>
          <p className="text-gray-900 text-lg font-semibold">{props.orderId}</p>
        </div>
      </td>
      <td className="py-2 px-4">
        <p className="text-gray-900 text-lg font-semibold">{props.subTotal}</p>
      </td>
      <td className="py-2 px-4">
          {props.status === "PENDING" ? (
                    <span className="inline-flex items-center bg-orange-400 text-slate-100 text-xs font-medium px-2.5 py-1 rounded-full mt-1">
                      <span className="w-2 h-2 mr-1 bg-orange-200 rounded-full"></span>
                      {props.status}
                    </span>
          ) : null}
          {props.status === "SUCCEEDED" ? (
                    <span className="inline-flex items-center bg-emerald-400 text-slate-100 text-xs font-medium px-2.5 py-1 rounded-full mt-1">
                      <span className="w-2 h-2 mr-1 bg-emerald-200 rounded-full"></span>
                      {props.status}
                    </span>
          ) : null}
          {props.status === "FAILED" ? (
                    <span className="inline-flex items-center bg-rose-400 text-slate-100 text-xs font-medium px-2.5 py-1 rounded-full mt-1">
                      <span className="w-2 h-2 mr-1 bg-rose-200 rounded-full"></span>
                      {props.status}
                    </span>
          ) : null}
      </td>
      <td className="py-2 px-4">
        <p className="text-gray-900 text-lg font-semibold">{new Date(props.orderDate).toLocaleDateString()}</p>
      </td>
      <td className="py-2 px-4">
        <p className="text-gray-900 text-lg font-semibold">{props.userName}</p>
      </td>

    </tr>
  );
}
