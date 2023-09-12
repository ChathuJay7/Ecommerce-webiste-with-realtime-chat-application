import React from "react";
import TopNav from "../../components/Common/TopNav";
import CheckoutStatus from "../../components/Checkout/CheckoutStatus";
import Footer from "../../components/Common/Footer";
import { VIEWS } from "../../utils/Views";

export default function CheckoutFailed() {
  return (
    <React.Fragment>
      <TopNav notificationCount={0} />
      <CheckoutStatus
        statusTitle={"Please try again. Payment failed."}
        statusIcon={"fa-regular fa-circle-xmark"}
        isError={true}
        actionName={"Try payment again"}
        actionLink={VIEWS.CHECKOUT}
      />
      <Footer />
    </React.Fragment>
  );
}
