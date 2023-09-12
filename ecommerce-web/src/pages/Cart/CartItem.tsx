import React, { useEffect, useState } from "react";
import { removeCartItem } from "../../API/Cart/CartAPI";
//import { removeCartItem } from "../../API/Cart/CartAPI";

export default function CartItem(props: {
  cartItemId: string,
  name: string,
  price: number,
  quantity: string,
  image: string,
  onRemoveCartItem: (cartItemId: string) => void;
  onChangeQuantity: (cartItemId: string, newQuantity: number) => void;
}) {
  
  const [bearerToken, setBearerToken] = useState("");
  const [quantity, setQuantity] = useState(parseInt(props.quantity) || 1);

  useEffect(() => {
    // Retrieve the bearer token from localStorage or wherever you store it
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
  }, []);

  const handleRemoveCartItem = async (id: any) => {
      props.onRemoveCartItem(props.cartItemId);
  }

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    props.onChangeQuantity(props.cartItemId, newQuantity);
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    handleQuantityChange(newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      handleQuantityChange(newQuantity);
    }
  };

  return (
    <tr className="border-b border-gray-200">
      <td className="py-2 px-4">
        <div className="flex items-center">
          <img className="w-16 h-16 mr-4" src={props.image} alt={props.name} />
          <p className="text-gray-900 text-lg">{props.name}</p>
        </div>
      </td>
      <td className="py-2 px-4">
        <p className="text-gray-900 text-lg">Rs. {props.price.toFixed(2)}</p>
      </td>
      <td className="py-2 px-4">
      <div className="flex items-center">
          <button
            className="border border-gray-300 rounded-l-md px-3 py-1"
            onClick={handleDecrement}
          >
            -
          </button>
          <input
            type="number"
            className="border-t border-b border-gray-300 text-center px-3 py-1 w-10"
            value={quantity}
            min="1"
            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
          />
          <button
            className="border border-gray-300 rounded-l-md px-3 py-1"
            onClick={handleIncrement}
          >
            +
          </button>
        </div>
      </td>
      <td className="py-2 px-4">
        <button onClick={handleRemoveCartItem} className="text-red-500"><i className="fas fa-trash-alt"></i></button>
      </td>
    </tr>
  );
}
