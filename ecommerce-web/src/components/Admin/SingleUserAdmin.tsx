import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { VIEWS } from "../../utils/Views";
import { useAppSelector } from "../../app/hooks";
import { getSingleUser } from "../../API/User/UserAPI";
import { getCartDetailsByUser } from "../../API/Cart/CartAPI";
import { getOrderDetailsByUser } from "../../API/Order/OrderAPI";

export default function SingleUserAdmin() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState([]) as any;
  const [bearerToken, setBearerToken] = useState("");
  const { user } = useAppSelector((state) => state.user);
  const [cart, setCart] = useState<any>({});
  const [order, setOrder] = useState([]) as any;

  useEffect(() => {
    handleGetUserDetails(id);
    fetchCart(id)
    fetchOrder(id)
  }, [id]);

  const handleGetUserDetails = async (userId: any) => {
    const getUserDetailsResponse = await getSingleUser({ id: userId });
    if (getUserDetailsResponse.success) {
      setUserDetails(getUserDetailsResponse.data);
    } else {
      console.log("Error:", getUserDetailsResponse.error);
    }
  };

  const fetchCart = async (userId: any) => {
    try {
      const response = await getCartDetailsByUser(bearerToken, { id: userId });

      if (response.success) {
        setCart(response.data)
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrder = async (userId: any) => {
    try {
      const response = await getOrderDetailsByUser(bearerToken, { user: userId }); 
  
      if (response.success) {
        setOrder(response.data);
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

console.log(order)
  return (
    <React.Fragment>
      <div className="p-5 mt-20 w-[80%] mx-auto">
        <section className="text-gray-700 body-font overflow-hidden bg-white justify-center items-center">
            <div className="container px-5 py-12 mx-auto">

                <button
                  className="rounded-full border-2 p-3 h-fit w-fit m-2"
                  onClick={() => navigate(VIEWS.ADMIN_USERS)}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>

                <div className="mx-auto flex flex-col items-center justify-start py-5">
                  <div className=" bg-white rounded-lg shadow-lg p-6 w-[90%]">
                    <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                      {userDetails.firstName + " " + userDetails.lastName}
                    </h1>
                    <span className="mr-3 font-semibold">{userDetails.email}</span>
                    <div className="flex flex-col mt-6 items-start pb-5 ">
                      <div className="flex">
                        <span className="mr-3 font-semibold w-[70px]">Id</span><span>:  {userDetails.id}</span>
                      </div>
                      <div className="flex">
                        <span className="mr-3 font-semibold w-[70px]">Userrole</span><span>:  {userDetails.role}</span>
                      </div>
                      <div className="flex">
                        <span className="mr-3 font-semibold w-[70px]">Address</span><span>:  {userDetails.address ? (userDetails.address) : "---"}</span>
                      </div>
                      <div className="flex">
                        <span className="mr-3 font-semibold w-[70px]">State</span><span>:  {userDetails.state ? (userDetails.state) : "---"}</span>
                      </div>
                      <div className="flex">
                        <span className="mr-3 font-semibold w-[70px]">Country</span><span>:  {userDetails.state ? (userDetails.country) : "---"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                {!cart.cartItems || cart.cartItems.length === 0 ? (
                    <div className="mx-auto flex flex-col items-center justify-start py-5">
                        <p className="text-slate-400 text-[30px] text-center">
                            No cart available
                        </p>
                    </div>
                    ):(
                    <div className="mx-auto flex flex-col items-center justify-start py-5">
                        <div className=" bg-white rounded-lg shadow-lg p-6 w-[90%]">
                          <h1 className="text-gray-900 text-2xl font-medium mb-4">Cart Details</h1>
                          <div className="flex">
                            <span className="mr-3 font-semibold w-[90px]">Cart ID </span><span>:  {cart?.id}</span>
                          </div>
                          <div className="flex">
                            <span className="mr-3 font-semibold w-[90px]">Total (LKR) </span><span>:  {cart?.totalAmount}</span>
                          </div>
                          
                          
                          <h2 className="text-gray-900 text-xl font-medium my-7">Cart Items</h2>
                          <div className="mt-4">
                              <table className="min-w-full border border-gray-300">
                                  <thead>
                                  <tr>
                                      <th className="py-2 px-4 border-b">Product</th>
                                      <th className="py-2 px-4 border-b">Product Id</th>
                                      <th className="py-2 px-4 border-b">Quantity</th>
                                      <th className="py-2 px-4 border-b">Price (LKR)</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {cart.cartItems?.map((item: any, index: any) => (
                                      <tr key={index.toString()}>
                                      <td className="py-2 px-4 border-b text-center">{item.product.name}</td>
                                      <td className="py-2 px-4 border-b text-center">{item.product.id}</td>
                                      <td className="py-2 px-4 border-b text-center">{item.quantity}</td>
                                      <td className="py-2 px-4 border-b text-center">{item.price}</td>
                                      </tr>
                                  ))}
                                  </tbody>
                              </table>
                          </div>
                        </div>
                    </div>
                ) }
                <hr />
                {!order || order.length === 0 ? (
                    <div className="mx-auto flex flex-col items-center justify-start py-5">
                        <p className="text-slate-400 text-[30px] text-center">
                            No orders available
                        </p>
                    </div>
                    ):(
                    <div className="mx-auto flex flex-col items-center justify-start py-5">
                        <div className=" bg-white rounded-lg shadow-lg p-6 w-[90%]">
                          <h1 className="text-gray-900 text-2xl font-medium mb-4">Order Details</h1>
                          <div className="mt-4">
                              <table className="min-w-full border border-gray-300">
                                  <thead>
                                  <tr>
                                      <th className="py-2 px-4 border-b">Order ID</th>
                                      <th className="py-2 px-4 border-b">Total (LKR)</th>
                                      <th className="py-2 px-4 border-b">Status</th>
                                      <th className="py-2 px-4 border-b">Order Date</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {order?.map((item: any, index: any) => (
                                      <tr key={index.toString()}>
                                      <td className="py-2 px-4 border-b text-center">{item.id}</td>
                                      <td className="py-2 px-4 border-b text-center">{item.subTotal}</td>
                                      <td className="py-2 px-4 border-b text-center">{item.status}</td>
                                      <td className="py-2 px-4 border-b text-center">{new Date(item.orderDate).toLocaleDateString()}</td>
                                      </tr>
                                  ))}
                                  </tbody>
                              </table>
                          </div>
                        </div>
                    </div>
                )}
                <hr />
              </div>
        </section>
      </div>
    </React.Fragment>
  );
}
