import React, { useEffect, useState } from "react";
import TopNav from "../../components/Common/TopNav";
import Footer from "../../components/Common/Footer";
//import { getCartItems } from "../../API/Cart/CartAPI";
import CartItem from "./CartItem";
import {
  getCartDetails,
  removeCart,
  removeCartItem,
  updateCartItem,
} from "../../API/Cart/CartAPI";
import { useLocation, useNavigate } from "react-router-dom";
import imgPlaceholder from "../../assets/images/img_placeholder.png";
import Button from "../../components/Common/Button";
import { createOrder } from "../../API/Order/OrderAPI";
import { VIEWS } from "../../utils/Views";
import { awsS3UrlGenerate } from "../../utils/Utilities";
import { ICartData } from "../../API/Cart/interfaces/cart-data.interface";

export default function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const cartId = searchParams.get("id");
  const [bearerToken, setBearerToken] = useState("");
  const [cart, setCart] = useState<any>({});

  useEffect(() => {
    // Retrieve the bearer token from localStorage or wherever you store it
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
  }, []);

  useEffect(() => {
    fetchCart(cartId);
  }, [cart.id, location]);

  const fetchCart = async (id: any) => {
    try {
      const response = await getCartDetails(bearerToken, { id: id });

      if (response.success) {
        // Handle the successful response
        setCart(response.data);
      } else {
        // Handle the error case
        console.error(response.error);
      }
    } catch (error) {
      // Handle any exception during the API call
      console.error(error);
    }
  };

  const handleRemoveCartItem = async (id: any) => {
    try {
      const response = await removeCartItem(bearerToken, { id: id });

      if (response.success) {
        // Handle the successful response
        //setCart(response.data)

        console.log(response.data);
        fetchCart(cart?.id);
        //{cart.cartItems || cart.cartItems.length !== 0 && fetchCart(cart?.id);}
      } else {
        // Handle the error case
        console.error(response.error);
      }
    } catch (error) {
      // Handle any exception during the API call
      console.error(error);
    }
  };

  const handleChangeQuantity = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    try {
      const payload = {
        id: cartItemId,
        quantity: newQuantity,
      };

      const response = await updateCartItem(bearerToken, payload);

      if (response.success) {
        // Handle the successful response
        fetchCart(cart?.id);
      } else {
        // Handle the error case
        console.error(response.error);
      }
    } catch (error) {
      // Handle any exception during the API call
      console.error(error);
    }
  };

  const handleCreateOrder = async () => {
    const response = await createOrder(cartId, bearerToken);
    if (response.success) {
      const cartData: ICartData = {
        id: String(cartId),
      };
      await removeCart(bearerToken, cartData);
      navigate(`${VIEWS.CHECKOUT + "?id=" + response.data.id}`);
    } else {
      console.log("Error:", response.error);
    }
  };

  return (
    <React.Fragment>
      <TopNav notificationCount={0} />
      <div className="mx-auto mt-20 w-[90%]">
        {!cart.cartItems || cart.cartItems.length === 0 ? (
          <div className="flex items-center justify-center h-screen">
            <p className="text-slate-400 text-[30px] text-center">
              Your cart is empty
            </p>
          </div>
        ) : (
          <div className="mt-100 h-screen p-10">
            <section className="flex flex-col text-center text-gray-700 body-font overflow-hidden bg-gray-200 justify-center items-center mb-10 p-5">
              <div className="text-center flex">
                <p className="text-lg font-semibold">Total Cart Price (LKR):</p><span className="ml-3 text-lg font-semibold">{cart?.totalAmount}</span>
              </div>
              <div className="text-center flex">
                <p className="text-lg font-semibold">Created Date:</p><span className="ml-3 text-lg font-semibold">{new Date(cart?.createdAt).toLocaleDateString()}</span>
              </div>
            </section>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-left">Product</th>
                  <th className="py-2 px-4 text-left">Price (LKR)</th>
                  <th className="py-2 px-4 text-left">Quantity</th>
                  <th className="py-2 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems?.map((item: any, index: any) => (
                  <CartItem
                    key={index.toString()}
                    cartItemId={item.id}
                    name={item.product.name}
                    price={item.product.price}
                    quantity={item.quantity}
                    image={
                      awsS3UrlGenerate(item?.product.image[0]) || imgPlaceholder
                    }
                    onRemoveCartItem={handleRemoveCartItem}
                    onChangeQuantity={handleChangeQuantity}
                  />
                ))}
              </tbody>
            </table>
            <div className="flex justify-end items-center w-full">
              <div className="w-1/5 mt-10">
                <Button name={"Place Order"} handleAction={handleCreateOrder} />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </React.Fragment>
  );
}



