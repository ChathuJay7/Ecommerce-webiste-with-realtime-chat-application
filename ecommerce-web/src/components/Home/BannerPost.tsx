import React, { useEffect, useState } from "react";

export default function BannerPost() {
  const [bannerImage, setBannerImage] = useState(0);

  const handlePrevious = () => {
    bannerImage <= 0 ? setBannerImage(4) : setBannerImage(bannerImage - 1);
  };

  const handleNext = () => {
    bannerImage >= 4 ? setBannerImage(0) : setBannerImage(bannerImage + 1);
  };

  const imagesArr = [
    "https://agentestudio.com/uploads/post/image/91/main_fashion-website-design-cover.jpg",
    "https://morecustomersapp.com/wp-content/uploads/2020/08/banner-and-eCommerce.jpg",
    "https://img.freepik.com/free-vector/online-shopping-horizontal-banner-illustration_1284-57252.jpg",
    "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/clothing-store-banner-design-template-e7332aaf6402c88cb4623bf8eb6f97e2_screen.jpg",
    "https://static.vecteezy.com/ti/gratis-vektor/p1/662992-abstrakt-fashion-banner-design-gratis-vector.jpg",
  ];

  return (
    <React.Fragment>
      <div
        style={{ backgroundImage: `url(${imagesArr[bannerImage]})` }}
        className="relative w-full h-96 bg-emerald-500 rounded-xl mt-2 mb-20 flex item-center bg-cover bg-center bg-no-repeat overflow-hidden"
      >
        <div className="w-full flex flex-row justify-between text-5xl text-slate-100 m-5 text-opacity-50">
          <button onClick={handlePrevious}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button onClick={handleNext}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}
