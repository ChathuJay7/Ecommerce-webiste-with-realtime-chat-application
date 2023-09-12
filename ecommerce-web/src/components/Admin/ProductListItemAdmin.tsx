import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { VIEWS } from "../../utils/Views";
import { Link } from "react-router-dom";

export default function ProductListItemAdmin(props: {
    productId: string,
    name: string,
    color: string,
    price: number,
    discount: number,
    quantity: number,
    description: string,
    image: string,
    onRemoveProduct: (id: string) => void;
    }) {
  
  const [bearerToken, setBearerToken] = useState("");
  const navigate = useNavigate();

  const handleViewSingleProduct = () => {
    navigate(`${VIEWS.ADMIN_SINGLE_PRODUCT + "?id=" + props.productId}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
  }, []);

  const handleRemovProduct = async (id: any) => {
    props.onRemoveProduct(props.productId);
  }

  return (
    <tr className="border-b border-gray-200">
      <td className="py-2 px-4">
        <div className="flex items-center cursor-pointer" onClick={handleViewSingleProduct}>
          <img className="w-16 h-16 mr-4" src={props.image} alt={props.name} />
          <p className="text-gray-900 text-lg font-semibold">{props.name}</p>
        </div>
      </td>
      <td className="py-2 px-4">
        <p className="text-gray-900 text-lg font-semibold">{props.color}</p>
      </td>
      <td className="py-2 px-4">
        <p className="text-gray-900 text-lg font-semibold">Rs. {props.price.toFixed(2)}</p>
      </td>
      <td className="py-2 px-4">
        <p className="text-gray-900 text-lg font-semibold">{props.discount}%</p>
      </td>
      <td className="py-2 px-4">
        <p className="text-gray-900 text-lg font-semibold">{props.quantity}</p>
      </td>
      <td className="py-2 px-4">
      <Link to={VIEWS.ADMIN_UPDATE_PRODUCT + "?id=" + props.productId}><button className="mr-2"><i className="fas fa-edit"></i></button></Link>
        <button onClick={handleRemovProduct} className="text-red-500"><i className="fas fa-trash-alt"></i></button>
      </td>

    </tr>
  );
}
