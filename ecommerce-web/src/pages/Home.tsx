import React, { useEffect, useState } from "react";
import { getLoggedInUser } from "../API/Auth/AuthAPI";
import { loggedInUser } from "../app/Redux/User/UserActions";
import TopNav from "../components/Common/TopNav";
import Footer from "../components/Common/Footer";
import BannerPost from "../components/Home/BannerPost";
import ProductItem from "../components/Products/ProductItem";
import { getAllProducts } from "../API/Products/ProductAPI";
import imgPlaceholder from "../assets/images/img_placeholder.png";
import { useAppDispatch } from "../app/hooks";
import { awsS3UrlGenerate } from "../utils/Utilities";

export default function Home() {
  const dispatch = useAppDispatch();
  const accessToken: string | null = localStorage.getItem("accessToken");
  const [productList, setProductList] = useState([]) as any;
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    handleGetLoggedInUser();
    handleGetAllProducts();
  }, [dispatch]);

  const handleGetLoggedInUser = async () => {
    const loggedInUserResponse = await getLoggedInUser(accessToken);
    if (loggedInUserResponse.success) {
      dispatch(loggedInUser(loggedInUserResponse.data.userId));
    } else {
      console.log("Error:", loggedInUserResponse.error);
    }
  };

  const handleGetAllProducts = async () => {
    const getAllProductsResponse = await getAllProducts(pageNumber);
    if (getAllProductsResponse.success) {
      setProductList(getAllProductsResponse.data);
    } else {
      console.log("Error:", getAllProductsResponse.error);
    }
  };

  return (
    <React.Fragment>
      <TopNav notificationCount={0} />
      <div className="p-5 mt-24 h-fit">
        <BannerPost />
        <div className="px-24 mt-24">
          <h1 className="text-5xl font-bold text-slate-800 mb-16">
            Feature Products
          </h1>
          {productList.length === 0 ? (
            <p className="text-slate-400 text-md text-center h-screen mt-96">
              Empty products list
            </p>
          ) : null}
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
            {productList.slice(0, 4).map((item: any, index: any) => (
              <ProductItem
                key={index.toString()}
                productId={item.id}
                name={item.name}
                price={item.price}
                image={awsS3UrlGenerate(item?.image[0]) || imgPlaceholder}
                hoverImage={awsS3UrlGenerate(item?.image[1])}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
}
