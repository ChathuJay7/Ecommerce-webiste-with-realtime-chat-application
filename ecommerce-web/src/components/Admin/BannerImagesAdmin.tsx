import React, { useEffect, useState } from "react";
import imgPlaceholder from "../../assets/images/img_placeholder.png";
import Button from "../Common/Button";
import { Link } from "react-router-dom";
import { VIEWS } from "../../utils/Views";


export default function BannerImagesAdmin() {
  const [bearerToken, setBearerToken] = useState("");

  useEffect(() => {
    // Retrieve the bearer token from localStorage or wherever you store it
    const token = localStorage.getItem("accessToken");
    if (token) {
      setBearerToken(token);
    }
  }, []);



  return (
    <React.Fragment>
        <div className="px-24 mt-20 w-screen">
            Banner Images
        </div>

    </React.Fragment>
  );
}
