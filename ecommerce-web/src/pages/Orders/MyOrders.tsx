import React, { useEffect, useState } from "react";
import Footer from "../../components/Common/Footer";
import TopNav from "../../components/Common/TopNav";
import { getAllOrdersForUser } from "../../API/Order/OrderAPI";
import { useAppSelector } from "../../app/hooks";
import { IOrderData } from "../../API/Order/interfaces/order-data";
import { awsS3UrlGenerate } from "../../utils/Utilities";
import { VIEWS } from "../../utils/Views";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const { user } = useAppSelector((state) => state.user);
  const [orderList, setOrderList] = useState([]) as any;
  const [orderItems, setOrderItems] = useState([]) as any;
  const navigate = useNavigate();

  useEffect(() => {
    handleGetAllOrdersForUser();
  }, []);

  const handleGetAllOrdersForUser = async () => {
    const orderData: IOrderData = {
      user: user.id,
    };
    const response = await getAllOrdersForUser(orderData);
    if (response.success) {
      console.log(response.data);
      setOrderList(response.data);
      // setOrderItems(response.data)
    } else {
      console.log("Error:", response.error);
    }
  };

  const handleUnpaidOrdersCheckout = (orderId: string) => {
    navigate(`${VIEWS.CHECKOUT + "?id=" + orderId}`);
  };

  return (
    <React.Fragment>
      <TopNav notificationCount={0} />
      <div className="p-20 mt-24 mb-48 h-auto min-h-screen">
        <h1 className="text-3xl text-slate-900 font-bold mb-14">
          <i className="fa-regular fa-circle-check" /> My Orders
        </h1>
        {orderList
          .map((item: any, index: string) => (
            <div
              className="w-full h-fit bg-slate-100 rounded-xl p-5 my-8"
              key={index.toString()}
            >
              <div className="flex flex-row justify-between items-center">
                <h1 className="text-xl font-bold text-slate-800 flex flex-col">
                  Order
                  <span className="text-slate-500 font-semibold text-sm">
                    #{item.id}
                  </span>
                  <span className="text-slate-500 font-semibold text-sm">
                    Ordered Date : {item.orderDate.split("T")[0]}
                  </span>
                </h1>
                <h1 className="text-md font-semibold text-slate-500 flex flex-col text-right">
                  Order Status
                  {item.status === "PENDING" ? (
                    <div className="flex justify-center items-center">
                      <button
                        className="bg-rose-500 hover:bg-rose-700 text-white font-bold py-1 px-4 rounded-full mr-2"
                        onClick={() => handleUnpaidOrdersCheckout(item.id)}
                      >
                        Pay now <i className="fa-regular fa-credit-card"></i>{" "}
                      </button>
                      <span className="inline-flex items-center bg-orange-400 text-slate-100 text-xs font-medium px-2.5 py-1 rounded-full mt-1">
                        <span className="w-2 h-2 mr-1 bg-orange-200 rounded-full"></span>
                        {item.status}
                      </span>
                    </div>
                  ) : null}
                  {item.status === "SUCCEEDED" ? (
                    <span className="inline-flex items-center bg-emerald-400 text-slate-100 text-xs font-medium px-2.5 py-1 rounded-full mt-1">
                      <span className="w-2 h-2 mr-1 bg-emerald-200 rounded-full"></span>
                      {item.status}
                    </span>
                  ) : null}
                  {item.status === "FAILED" ? (
                    <span className="inline-flex items-center bg-rose-400 text-slate-100 text-xs font-medium px-2.5 py-1 rounded-full mt-1">
                      <span className="w-2 h-2 mr-1 bg-rose-200 rounded-full"></span>
                      {item.status}
                    </span>
                  ) : null}
                </h1>
              </div>
              <h1 className="text-xl font-bold text-slate-800 flex flex-col mt-10">
                {item.subTotal}.00 LKR
              </h1>
              <h1 className="text-md font-semibold text-slate-700 flex flex-col mt-12 mb-4">
                Order Items
              </h1>
              {item.orderItems && (
                <table className="w-full text-left p-2">
                  <thead>
                    <tr className="bg-emerald-100">
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {JSON.parse(item.orderItems).cartItems.map(
                      (item: any, index: any) => (
                        <tr key={index.toString()}>
                          <th className="font-normal text-sm py-3 flex flex-row justify-start items-center w-3/4">
                            <img
                              className="w-10 h-auto rounded-lg mr-2"
                              src={awsS3UrlGenerate(item.product.image[0])}
                              alt=""
                            />
                            {item.product.name}
                          </th>
                          <th className="font-normal text-sm py-3">
                            x{item.quantity}
                          </th>
                          <th className="font-normal text-sm py-3">
                            {item.price} LKR
                          </th>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          ))
          .reverse()}
      </div>
      <Footer />
    </React.Fragment>
  );
}
