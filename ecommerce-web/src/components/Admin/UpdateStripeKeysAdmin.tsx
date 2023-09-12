import React, { useEffect, useState } from 'react'
import InputField from '../Common/InputField'
import Button from '../Common/Button';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { VIEWS } from '../../utils/Views';
import LoadingSpinner from '../Common/LoadingSpinner';
import { getSingleStripeKey, updateStripeKey } from '../../API/Admin/AdminAPI';


const UpdateStripeKeysAdmin = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const stripeKeyId = searchParams.get("id");
    const [bearerToken, setBearerToken] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [stripeKey, setStripeKey] = useState<any>({});
    const [showSecretKey, setShowSecretKey] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setBearerToken(token);
        }
    }, []);
    
    useEffect(() => {

        fetcSingleStripeKey();

    }, [bearerToken]);

    const fetcSingleStripeKey = async () => {

        const payload: any = {
            id: stripeKeyId
        }

        const getSingleStripeKeyResponse = await getSingleStripeKey(bearerToken, payload);
        if (getSingleStripeKeyResponse.success) {
            setStripeKey(getSingleStripeKeyResponse.data);
            setPublicKey(getSingleStripeKeyResponse.data.stripePublicKey);
            setSecretKey(getSingleStripeKeyResponse.data.stripeSecretKey);
        } else {
            console.log("Error:", getSingleStripeKeyResponse.error);
        }
    };


    const handleUpdateStripeKeys = async () => {

        const payload: any = {
            id: stripeKeyId,
            publicKey,
            secretKey
        };

        if(publicKey === ""){
            toast.error("Please enter public key..!!");
        } if(publicKey === ""){
            toast.error("Please enter secret key..!!");
        } else {
            try {
                setIsLoading(true);
                const response = await updateStripeKey(bearerToken, payload);
                if (response.success) {
                    toast.success("Stripe key updated successfully");
                    setIsLoading(false);
                } else {
                    toast.error(response.error);
                    setIsLoading(false);
                    console.error(response.error)
                }
            } catch (error) {
                console.log(error);
                setIsLoading(false);
                console.error(error)
            }
        }
        
        
    };


    return (
        <React.Fragment>
          <div className="mt-24 items-center justify-center w-screen h-screen">
            {isLoading ? <LoadingSpinner /> : null}
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-6 text-center">
                Update Stripe Keys
            </h1>
            <div className="w-[600px] mx-auto bg-white p-8 rounded-md shadow-md">
                <button className="rounded-full border-2 p-3 h-fit w-fit m-2" onClick={() => navigate(VIEWS.ADMIN_STRIPE_KEYS)}>
                    <i className="fa-solid fa-arrow-left"></i>
                </button>



                    <InputField
                        label="Public Key"
                        type="text"
                        placeholder="Enter public key"
                        value={publicKey}
                        onChange={setPublicKey}
                    />
                    <div className="mb-5 ">
                    
                        {showSecretKey ? (
                            <div>
                                <span className="block text-gray-700 text-sm font-bold ">Secret Key</span>
                                <input
                                type="text"
                                className=" mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                                value={secretKey}
                                onChange={e => setSecretKey(e.target.value)}
                                />
                            </div>
                            
                        ) : (
                            <InputField
                                label="Secret Key"
                                type="password"
                                placeholder="Enter public key"
                                value={secretKey}
                                onChange={setSecretKey}
                            />
                        )}
                            
                    </div>

                    <div className="flex justify-end">
                        <label className=" block text-gray-700 text-sm font-bold mb-4 ">
                                <input
                                    type="checkbox"
                                    checked={showSecretKey}
                                    onChange={() => setShowSecretKey((prevShow) => !prevShow)}
                                    />
                                    Show
                        </label>
                    </div>
                    

              <Button name="Update Stripe Keys" handleAction={handleUpdateStripeKeys} />
            </div>
          </div>
        </React.Fragment>
    );

}

export default UpdateStripeKeysAdmin
