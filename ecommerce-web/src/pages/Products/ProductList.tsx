import React, { useEffect, useState } from "react";
import TopNav from "../../components/Common/TopNav";
import ProductItem from "../../components/Products/ProductItem";
import Footer from "../../components/Common/Footer";
import { getAllProducts } from "../../API/Products/ProductAPI";
import imgPlaceholder from "../../assets/images/img_placeholder.png";
import { awsS3UrlGenerate } from "../../utils/Utilities";
import axios from "axios";

export default function ProductList() {
  const [productList, setProductList] = useState([]) as any;
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(async () => {
      const getAllProductsResponse = await getAllProducts(pageNumber);
      if (getAllProductsResponse.success) {
        setProductList((prev: any) => {
          return [...prev, ...getAllProductsResponse.data];
        });
        setLoading(false);
      } else {
        console.log("Error:", getAllProductsResponse.error);
      }
    }, 0);
  }, [pageNumber]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setLoading(true);
      setPageNumber((prev: any) => prev + 1);
    }
  };

  return (
    <React.Fragment>
      <TopNav notificationCount={0} />
      <div className="px-24 mt-48">
        {productList.length === 0 ? (
          <p className="text-slate-400 text-md text-center h-screen mt-96">
            Empty products list
          </p>
        ) : null}
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
          {productList
            .map((item: any, index: any) => (
              <ProductItem
                key={index.toString()}
                productId={item.id}
                name={item.name}
                price={item.price}
                image={awsS3UrlGenerate(item?.image[0]) || imgPlaceholder}
                hoverImage={awsS3UrlGenerate(item?.image[1])}
              />
            ))
            .reverse()}
        </div>
        {loading && <p>Loading....</p>}
      </div>
      <Footer />
    </React.Fragment>
  );
}
