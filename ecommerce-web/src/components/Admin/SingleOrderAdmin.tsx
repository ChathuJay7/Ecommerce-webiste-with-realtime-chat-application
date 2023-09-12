import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { VIEWS } from "../../utils/Views";
import { useAppSelector } from "../../app/hooks";
import { getSingleOrder } from "../../API/Order/OrderAPI";


export default function SingleOrderAdmin() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>({});

  useEffect(() => {
    fetchOrder(id)
  }, [id]);


  const fetchOrder = async (orderId: any) => {
    try {
      const response = await getSingleOrder({id: orderId});
  
      if (response.success) {
        setOrder(response.data);

      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <React.Fragment>
      <div className="p-5 mt-20 w-[80%] mx-auto">

        <section className="text-gray-700 body-font overflow-hidden bg-white justify-center items-center">
          <div className="container px-5 py-12 mx-auto">
            <button
              className="rounded-full border-2 p-3 h-fit w-fit m-2"
              onClick={() => navigate(VIEWS.ADMIN_ORDERS)}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>

            {order && order.shipping && (
                <div className="mx-auto flex flex-col items-center justify-start">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[80%]">
                        <h1 className="text-gray-900 text-2xl font-medium mb-4">Order Details</h1>
                        <div className="flex">
                            <span className="text-gray-700 mb-4 font-semibold w-[90px]">Order ID </span><span>:  {order.id}</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-700 mb-4 font-semibold w-[90px]">Total (LKR)  </span><span>:  {order.subTotal}</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-700 mb-4 font-semibold w-[90px]">Status </span>
                            <span>:  
                                {order.status === "PENDING" ? (
                                <span className="inline-flex items-center bg-orange-400 text-slate-100 text-xs font-medium px-2.5 py-1 rounded-full mt-1">
                                  <span className="w-2 h-2 mr-1 bg-orange-200 rounded-full"></span>
                                  {order.status}
                                </span>
                                ) : null}
                                {order.status === "SUCCEEDED" ? (
                                          <span className="inline-flex items-center bg-emerald-400 text-slate-100 text-xs font-medium px-2.5 py-1 rounded-full mt-1">
                                            <span className="w-2 h-2 mr-1 bg-emerald-200 rounded-full"></span>
                                            {order.status}
                                          </span>
                                ) : null}
                                {order.status === "FAILED" ? (
                                          <span className="inline-flex items-center bg-rose-400 text-slate-100 text-xs font-medium px-2.5 py-1 rounded-full mt-1">
                                            <span className="w-2 h-2 mr-1 bg-rose-200 rounded-full"></span>
                                            {order.status}
                                          </span>
                                ) : null}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-700 mb-4 font-semibold w-[90px]">Order Date </span><span>:  {new Date(order.orderDate).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] mt-10">
                        <h1 className="text-gray-900 text-2xl font-medium mb-4">Shipping Details</h1>
                        <div className="flex">
                            <span className="text-gray-700 mb-4 font-semibold w-[150px]">Shipping ID </span><span>:  {order.shipping.id}</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-700 mb-4 font-semibold w-[150px]">Shipping Method </span><span>:  {order.shipping.method}</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-700 mb-4 font-semibold w-[150px]">Shipping Date </span><span>:  {new Date(order.shipping.shippingDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-700 mb-4 font-semibold w-[150px]">Shipping Address </span><span>:  {order.shipping.address}</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-700 mb-4 font-semibold w-[150px]">Shipping State </span><span>:  {order.shipping.state}</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-700 mb-4 font-semibold w-[150px]">Phone Number </span><span>:  {order.shipping.phoneNumber}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 w-[80%] mt-10">
                        <h1 className="text-gray-900 text-2xl font-medium mb-4">User Details</h1>
                        <div className="flex">
                            <span className="text-gray-700 mb-4 font-semibold w-[150px]">User ID </span><span>:  {order.user.id}</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-700 mb-4 font-semibold w-[150px]">Username </span><span>:  {order.user.firstName} {order.user.lastName}</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-700 mb-4 font-semibold w-[150px]">Email </span><span>:  {order.user.email}</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-700 mb-4 font-semibold w-[150px]">Address</span><span>:  {order.user.address? order.user.address : "---"}</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-700 mb-4 font-semibold w-[150px]">State </span><span>:  {order.user.state? order.user.state : "---"}</span>
                        </div>
                        <div className="flex">
                            <span className="text-gray-700 mb-4 font-semibold w-[150px]">Country </span><span>:  {order.user.country? order.user.country : "---"}</span>
                        </div>
                    </div>
                </div>
            )}



          </div>
        </section>

      </div>
    </React.Fragment>
  );
}
