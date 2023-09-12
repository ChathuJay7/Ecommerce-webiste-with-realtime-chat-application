import React, { useEffect, useState } from "react";
import TopNav from "../../components/Common/TopNav";
import { useLocation, useNavigate } from "react-router-dom";
import { getSingleProduct } from "../../API/Products/ProductAPI";
import { VIEWS } from "../../utils/Views";
import imgPlaceholder from "../../assets/images/img_placeholder.png";
import {
  addCartItem,
  createCart,
  getCartDetailsByUser,
} from "../../API/Cart/CartAPI";
import { toast } from "react-toastify";
import { useAppSelector } from "../../app/hooks";
import { awsS3UrlGenerate } from "../../utils/Utilities";

export default function SingleProduct() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState([]) as any;
  const [galleryCoverImage, setGalleryCoverImage] = useState("");
  const [galleryImages, setGalleryImages] = useState([]) as any;
  const [quantity, setQuantity] = useState(1);
  const [bearerToken, setBearerToken] = useState("");
  const [cart, setCart] = useState<any>({});
  const [userCart, setUserCart] = useState(false);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    handleGetProductDetails(id);
  }, []);

  useEffect(() => {
    // Retrieve the bearer token from localStorage or wherever you store it
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

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const checkCart = async () => {
    try {
      const response = await getCartDetailsByUser(bearerToken, user);

      if (response.success) {
        return response.data; // Return the cart data if it exists
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error(error);
    }

    return null; // Return null if there's an error or cart doesn't exist
  };

  const addCartItemToCart = async (cartId: string) => {
    try {
      const payload = {
        cartId: cartId,
        productId: productDetails.id,
        quantity: quantity,
      };

      const response = await addCartItem(bearerToken, payload);

      if (response.success) {
        console.log(response.data);
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createNewCart = async () => {
    try {
      const payload = {
        cartItems: [{ productId: productDetails.id, quantity: quantity }],
      };

      const response = await createCart(payload, bearerToken);

      if (response.success) {
        const updatedCart = await getCartDetailsByUser(bearerToken, user);
        if (updatedCart.success) {
          setCart(updatedCart.data);
        } else {
          console.error(updatedCart.error);
        }
        console.log(response.data);
      } else {
        console.error(response.error);
        toast.error(response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = async () => {
    if (!user.id) {
      navigate(VIEWS.CART);
    } else {
      const userCart = await checkCart();
      if (userCart) {
        addCartItemToCart(userCart.id);
        const updatedCart = await getCartDetailsByUser(bearerToken, user);
        if (updatedCart.success) {
          setCart(updatedCart.data);
        } else {
          console.error(updatedCart.error);
        }
        navigate(VIEWS.PRODUCTS);
      } else {
        createNewCart();
        const createdCart = await getCartDetailsByUser(bearerToken, user);
        if (createdCart.success) {
          setCart(createdCart.data);
        } else {
          console.error(createdCart.error);
        }
        navigate(VIEWS.PRODUCTS);
      }
    }
  };

  return (
    <React.Fragment>
      <TopNav notificationCount={0} />
      <div className="p-5 mt-24">
        <section className="text-gray-700 body-font overflow-hidden bg-white">
          <div className="container px-5 py-12 mx-auto">
            <button
              className="rounded-full border-2 p-3 h-fit w-fit m-2"
              onClick={() => navigate(VIEWS.PRODUCTS)}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div className="lg:w-4/5 mx-auto flex flex-wrap">
              <div className="lg:w-1/2 w-full flex flex-col justify-center">
                <img
                  alt="e-commerce"
                  className="object-cover object-center rounded border border-gray-200"
                  src={awsS3UrlGenerate(galleryCoverImage) || imgPlaceholder}
                />
                <div className="flex flex-row justify-center items-center mt-5">
                  {galleryImages.map((item: any, index: any) => (
                    <img
                      key={index.toString()}
                      className="w-20 h-28 rounded-lg bg-slate-500 m-2 cursor-pointer object-cover object-center shadow-md"
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
                    <span className="mr-3">Color : {productDetails.color}</span>
                  </div>
                  <div className="flex">
                    <span className="mr-3">
                      Discount : {productDetails.discount + "%"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-10">
                  <span className="title-font font-bold text-4xl text-gray-900">
                    {productDetails.price}.00 LKR
                  </span>
                  <div className="ml-auto">
                    <label htmlFor="quantity" className="mr-2">
                      Quantity:
                    </label>
                    <div className="flex items-center">
                      <button
                        onClick={handleDecrement}
                        className="border border-gray-300 rounded-l-md px-3 py-1"
                      >
                        -
                      </button>
                      <input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        min={1}
                        max={10}
                        className="border-t border-b border-gray-300 text-center px-3 py-1"
                      />
                      <button
                        onClick={handleIncrement}
                        className="border border-gray-300 rounded-r-md px-3 py-1"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center mt-3 ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
                  >
                    Add to cart <i className="fa-solid fa-cart-shopping ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </React.Fragment>
  );
}
