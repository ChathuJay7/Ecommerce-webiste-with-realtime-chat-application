import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VIEWS } from "../../utils/Views";

export default function ProductItem(props: {
  productId: string;
  name: string;
  price: number;
  image: string;
  hoverImage: string;
}) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleViewSingleProduct = () => {
    navigate(`${VIEWS.SINGLEPRODUCT + "?id=" + props.productId}`);
  };

  return (
    <React.Fragment>
      <div
        className="w-auto h-fit p-2 rounded-xl bg-white shadow-md cursor-pointer"
        onClick={handleViewSingleProduct}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-auto h-auto overflow-x-hidden  relative">
          <img
            className="h-80 rounded-t-xl w-full object-cover"
            src={isHovered ? props.hoverImage : props.image}
          />
        </div>
        <div className="mt-4 pl-2 mb-2 flex justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-0">
              {props.name}
            </p>
            <p className="text-md text-gray-800 font-bold mt-3">
              {props.price}.00 LKR
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
