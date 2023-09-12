import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSingleProduct } from "../../API/Products/ProductAPI";
import { VIEWS } from "../../utils/Views";
import imgPlaceholder from "../../assets/images/img_placeholder.png";
import { useAppSelector } from "../../app/hooks";
import { awsS3UrlGenerate } from "../../utils/Utilities";

export default function SingleProductAdmin() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState([]) as any;
  const [galleryCoverImage, setGalleryCoverImage] = useState("");
  const [galleryImages, setGalleryImages] = useState([]) as any;
  const [bearerToken, setBearerToken] = useState("");
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    handleGetProductDetails(id);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
  }, []);

  const handleGetProductDetails = async (productId: any) => {
    const getProductDetailsResponse = await getSingleProduct({ id: productId });
    if (getProductDetailsResponse.success) {
      setProductDetails(getProductDetailsResponse.data);
      setGalleryImages(getProductDetailsResponse.data?.image);
      setGalleryCoverImage(getProductDetailsResponse.data?.image[0]);
    } else {
      console.log("Error:", getProductDetailsResponse.error);
    }
  };

  const handleChangeImage = (imgUrl: any) => {
    setGalleryCoverImage(imgUrl);
  };



  return (
    <React.Fragment>

      <div className="p-5 mt-24">
        <section className="text-gray-700 body-font overflow-hidden bg-white">
          <div className="container px-5 py-12 mx-auto">
            <button
              className="rounded-full border-2 p-3 h-fit w-fit m-2"
              onClick={() => navigate(VIEWS.ADMIN_PRODUCTS)}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div className="lg:w-4/5 mx-auto flex flex-wrap">
              <div className="lg:w-1/2 w-full flex flex-col justify-center">
                <img
                  alt="ecommerce"
                  className="object-cover object-center rounded border border-gray-200"
                  src={awsS3UrlGenerate(galleryCoverImage) || imgPlaceholder}
                />
                <div className="flex flex-row justify-center items-center mt-5">
                  {galleryImages.map((item: any, index: any) => (
                    <img
                      key={index.toString()}
                      className="w-20 h-28 rounded-lg bg-slate-500 m-2 cursor-pointer object-cover object-center"
                      src={awsS3UrlGenerate(item)}
                      onClick={() => handleChangeImage(item)}
                    />
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                <h2 className="text-sm title-font text-gray-500 tracking-widest">
                  {productDetails.category?.name || ""}
                </h2>
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                  {productDetails.name}
                </h1>
                <p className="leading-relaxed">{productDetails.description}</p>
                <div className="flex flex-col mt-6 items-start pb-5 border-b-2 border-gray-200 mb-5">
                  <div className="flex">
                    <span className="mr-3">ID: {productDetails.id}</span>
                  </div>
                  <div className="flex">
                    <span className="mr-3">Color : {productDetails.color}</span>
                  </div>
                  <div className="flex">
                    <span className="mr-3">
                      Discount : {productDetails.discount + "%"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="mr-3">
                      Quantity : {productDetails.quantity}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="mr-3">
                      Price : {"Rs. " + productDetails.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </React.Fragment>
  );
}
