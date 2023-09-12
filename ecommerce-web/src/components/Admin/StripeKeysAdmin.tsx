import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { VIEWS } from "../../utils/Views";
import { getAllStripeKeys } from "../../API/Admin/AdminAPI";

export default function StripeKeysAdmin() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [bearerToken, setBearerToken] = useState("");
  const [stripeKeys, setStripeKeys] = useState([]) as any;
  const navigate = useNavigate();
  const [showSecretKey, setShowSecretKey] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setBearerToken(token);
        }
    }, []);

    useEffect(() => {

        fetchStripeKeys();

    }, [bearerToken]);


  const fetchStripeKeys = async () => {
    const getAllStripeKeyResponse = await getAllStripeKeys(bearerToken);
    if (getAllStripeKeyResponse.success) {
      setStripeKeys(getAllStripeKeyResponse.data);
    } else {
      console.log("Error:", getAllStripeKeyResponse.error);
    }
  };

  const stripSecretKeyToDots = (secretKey: any) => {
    return secretKey ? "*".repeat(secretKey.length) : "";
  };


  return (
    <React.Fragment>
        <div className="p-5 mt-20 w-[80%] mx-auto h-screen">

            <section className="text-gray-700 body-font overflow-hidden bg-white justify-center items-center">
                <div className="container px-5 py-12 mx-auto">

                    <div className="mx-auto flex flex-row justify-between items-center w-[90%]">
                        <div>
                            <button className="rounded-full border-2 p-3 h-fit w-fit m-2 flex-end" onClick={() => navigate(VIEWS.ADMIN_DASHBOARD)}>
                                <i className="fa-solid fa-arrow-left"></i>
                            </button>
                        </div>
                        <div className="flex flex-row">
                            <div className="mt-1/2 mb-4">
                                <Link to={VIEWS.ADMIN_UPDATE_STRIPE_KEYS + "?id=" + stripeKeys[0]?.id}>
                                    <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                                        Update Stripe Keys
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto flex flex-col items-center justify-start py-5">
                        <div className=" bg-white rounded-lg shadow-lg p-6 w-[90%]">
                            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                                Stripe Key Settings
                            </h1>

                            <div className="flex flex-col mt-6 items-start pb-5">
                                <div className="flex mb-5">
                                    <span className="mr-3 font-semibold w-[100px]">Stripe Key Id</span><span className="text-sm">:  {stripeKeys[0]?.id}</span>
                                </div>
                                <div className="flex mb-5">
                                    <span className="mr-3 font-semibold w-[100px]">Public Key</span><span className="text-[11.5px]">:  {stripeKeys[0]?.stripePublicKey}</span>
                                </div>
                                    <div className="flex mb-3">
                                        <span className="mr-3 font-semibold w-[100px]">Secret Key</span>

                                        {showSecretKey ? (
                                            <span className="text-[11.5px]">: {stripeKeys[0]?.stripeSecretKey}</span>
                                        ) : (
                                            <span className="p-1 w-[200px] text-[11.5px] inline-block">
                                                {stripSecretKeyToDots(stripeKeys[0]?.stripeSecretKey)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="ml-[120px]">
                                        <button
                                            className="text-xs border-2 border-blue-500 px-2 py-1 rounded"
                                            onClick={() => setShowSecretKey((prevShow) => !prevShow)}
                                        >
                                            {showSecretKey ? "Hide" : "Show"}
                                        </button>
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
