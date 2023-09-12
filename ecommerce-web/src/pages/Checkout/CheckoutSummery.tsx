import React, { useEffect, useState } from "react";
import TopNav from "../../components/Common/TopNav";
import CheckoutStatus from "../../components/Checkout/CheckoutStatus";
import Footer from "../../components/Common/Footer";
import InputField from "../../components/Common/InputField";
import Button from "../../components/Common/Button";
import paymentLog from "../../assets/images/payments.png";
import { useLocation, useNavigate } from "react-router-dom";
import { getSingleOrder } from "../../API/Order/OrderAPI";
import { createShipping } from "../../API/Shipping/ShippingAPI";
import { IShippingData } from "../../API/Shipping/interfaces/shipping-data.interface";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { createPayment } from "../../API/Checkout/CheckoutAPI";
import { IPaymentData } from "../../API/Checkout/interfaces/checkout-data.interface";
import { awsS3UrlGenerate } from "../../utils/Utilities";

export default function CheckoutSummery() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [orderSubTotal, setOrderSubTotal] = useState(0);
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
    handleGetOrderData(id);
  }, []);

  const handleGetOrderData = async (orderId: any) => {
    const response = await getSingleOrder({ id: orderId });
    if (response.success) {
      console.log("CHECK : ", response.data.status);
      setOrderStatus(response.data?.status);
      setCartItems(JSON.parse(response.data.orderItems).cartItems);
      setOrderSubTotal(response.data.subTotal);
    } else {
      console.log("Error:", response.error);
    }
  };

  const handleCreateShipping = async () => {
    if (address === "") {
      toast.error("Please enter address..!!");
    } else if (state === "") {
      toast.error("Please enter state..!!");
    } else if (country === "") {
      toast.error("Please enter country..!!");
    } else if (phoneNumber === "") {
      toast.error("Please enter phoneNumber..!!");
    } else {
      try {
        setIsLoading(true);
        const shippingData: IShippingData = {
          orderId: id,
          address: address,
          state: state,
          country: country,
          phoneNumber: phoneNumber,
        };
        const response = await createShipping(shippingData, accessToken);
        if (response.success) {
          setAddress("");
          setState("");
          setCountry("");
          setPhoneNumber("");
          handlePlaceOrder();
          setIsLoading(false);
        } else {
          console.log("Error:", response.error);
          setIsLoading(false);
        }
      } catch (error: any) {
        console.log(error);
        setIsLoading(false);
      }
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    const paymentData: IPaymentData = {
      orderId: id,
    };
    const response = await createPayment(paymentData, accessToken);
    if (response.success) {
      setIsLoading(false);
      window.location.replace(response.data.checkoutUrl);
    } else {
      setIsLoading(false);
      console.log("Error:", response.error);
    }
  };

  return (
    <React.Fragment>
      <TopNav notificationCount={0} />
      <div className="h-fit p-10">
        <h1 className="mt-32 text-slate-800 text-3xl font-bold">
          Order Details
        </h1>
        <div className="w-full flex flex-col md:flex-row mt-10">
          <div className="w-full md:w-1/2 h-screen rounded-xl">
            {orderStatus === "PENDING" ? (
              <div>
                <h1 className="mt-8 text-slate-600 text-2xl font-bold ml-5">
                  Shipping Details
                </h1>
                <div className="p-10">
                  <InputField
                    label={"Address"}
                    type={"text"}
                    placeholder={"ex: No 32/A, Rajmalwatta Road, Battaramulla"}
                    value={address}
                    onChange={setAddress}
                  />
                  <InputField
                    label={"State"}
                    type={"text"}
                    placeholder={"Western"}
                    value={state}
                    onChange={setState}
                  />
                  <InputField
                    label={"Country"}
                    type={"text"}
                    placeholder={"Sri Lanka"}
                    value={country}
                    onChange={setCountry}
                  />
                  <InputField
                    label={"Phone Number"}
                    type={"text"}
                    placeholder={"+XX XXX XXXX"}
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                  />
                </div>
              </div>
            ) : (
              <div>
                <h1 className="mt-8 text-slate-600 text-2xl font-bold ml-5">
                  Order has been already paid..!!
                </h1>
              </div>
            )}
            <div></div>
          </div>
          <div className="w-full md:w-1/2 h-screen bg-slate-100 rounded-xl">
            <h1 className="mt-8 text-slate-600 text-2xl font-bold ml-5">
              Items Summery
            </h1>
            <div className="p-10">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-emerald-100">
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item: any, index: any) => (
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
                      <th className="font-normal text-sm py-3">{item.price}</th>
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr className="h-px my-4 bg-slate-300 border-0" />
              <div className="w-full flex justify-between items-center">
                <p className="font-bold text-md">Delivery</p>
                <p className="mr-6">Free</p>
              </div>
              <hr className="h-px my-4 bg-slate-300 border-0" />
              <div className="w-full flex justify-between items-center">
                <p className="font-bold text-md">Sub Total</p>
                <p className="font-bold text-lg mr-6">{orderSubTotal} LKR</p>
              </div>
              <hr className="h-px my-4 bg-slate-300 border-0" />
              <div className="w-full flex flex-row justify-between items-center my-12">
                <p className="font-semibold text-md">
                  Pay with Visa, MasterCard, Amex
                </p>
                <img className="h-16 w-auto" src={paymentLog} alt="" />
              </div>
              {orderStatus === "PENDING" ? (
                <Button name={"Checkout"} handleAction={handleCreateShipping} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {isLoading ? <LoadingSpinner /> : null}
      <ToastContainer />
    </React.Fragment>
  );
}
