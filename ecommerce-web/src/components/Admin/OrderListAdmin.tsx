import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllOrders } from "../../API/Order/OrderAPI";
import OrderListItemAdmin from "./OrderListItemAdmin";

export default function OrderListAdmin() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cartId = searchParams.get("id");
  const [bearerToken, setBearerToken] = useState("");
  const [orderList, setOrderList] = useState([]) as any;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [location]);

  console.log(orderList)

  const fetchOrders = async () => {
    const getAllOrdersResponse = await getAllOrders(bearerToken);
    if (getAllOrdersResponse.success) {
      setOrderList(getAllOrdersResponse.data);
      console.log(orderList)
    } else {
      console.log("Error:", getAllOrdersResponse.error);
    }
  };


  return (
    <React.Fragment>
        <div className="px-24 mt-20 w-screen">

        <div className="mt-1/2 pt-10 text-bold mb-4">
            <h1 className="text-center font-bold text-2xl">Order List</h1>
        </div>
        

        <div className="h-screen">
            <table className="w-full bg-white border border-gray-300">
                <thead>
                <tr className="bg-gray-300">
                    <th className="py-3 px-4 text-left">OrderId</th>
                    <th className="py-3 px-4 text-left">Total(LKR)</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">OrderDate</th>
                    <th className="py-3 px-4 text-left">User</th>
                </tr>
                </thead>
                <tbody>
                {orderList?.map((item: any, index: any) => (
                    <OrderListItemAdmin
                        key={index.toString()}
                        orderId={item.id}
                        subTotal={item.subTotal}
                        status={item.status}
                        orderDate={item.orderDate}
                        userName={item.user ? (item.user.firstName + " "  + item.user.lastName) : ""}
                    />
                ))}
                </tbody>
            </table>
            </div>
        </div>

    </React.Fragment>
  );
}
