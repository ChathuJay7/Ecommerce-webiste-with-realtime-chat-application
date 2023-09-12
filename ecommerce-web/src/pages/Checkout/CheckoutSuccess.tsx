import React from "react";
import TopNav from "../../components/Common/TopNav";
import Footer from "../../components/Common/Footer";
import CheckoutStatus from "../../components/Checkout/CheckoutStatus";
import { VIEWS } from "../../utils/Views";

export default function CheckoutSuccess() {
  return (
    <React.Fragment>
      <TopNav notificationCount={0} />
      <CheckoutStatus
        statusTitle={"Thank you for purchase"}
        statusIcon={"fa-regular fa-circle-check"}
        isError={false}
        actionName={"View My Orders"}
        actionLink={VIEWS.MY_ORDERS}
      />
      <Footer />
    </React.Fragment>
  );
}
