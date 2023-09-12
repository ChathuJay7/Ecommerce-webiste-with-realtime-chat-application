import React, { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { VIEWS } from "./utils/Views";
import RealtimeChat from "./pages/Chat/RealtimeChat";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home";
import AuthProtectedRoutes from "./middleware/AuthProtectedRoutes";
import ProductList from "./pages/Products/ProductList";
import SingleProduct from "./pages/Products/SingleProduct";
import Contact from "./pages/Contact";
import CheckoutSuccess from "./pages/Checkout/CheckoutSuccess";
import CheckoutFailed from "./pages/Checkout/CheckoutFailed";
import AdminProtectedRoutes from "./middleware/AdminProtectedRoutes";
import AdminDashboard from "./pages/Admin/admin-dashboard";
import Cart from "./pages/Cart/Cart";
import ForgotPassword from "./pages/Auth/forgot-password";
import ResetPassword from "./pages/Auth/reset-password";
import ChangePassword from "./pages/Account/change-password";
import MyAccount from "./pages/Account/my-account";
import ChangeUserDetails from "./pages/Account/change-user-details";
import ProductPageAdmin from "./pages/Admin/admin-product-page";
import AddNewProductPageAdmin from "./pages/Admin/admin-add-new-product-page";
import UserPageAdmin from "./pages/Admin/admin-user-page";
import AddNewUserPageAdmin from "./pages/Admin/admin-add-new-user-page";
import OrderPageAdmin from "./pages/Admin/admin-order-page";
import CategoryPageAdmin from "./pages/Admin/admin-category";
import SingleProductPageAdmin from "./pages/Admin/admin-single-product-page";
import SingleUserPageAdmin from "./pages/Admin/admin-single-user-page";
import CheckoutSummery from "./pages/Checkout/CheckoutSummery";
import MyOrders from "./pages/Orders/MyOrders";
import AddCategoryAdmin from "./components/Admin/AddCategoryAdmin";
import AdminAddCategory from "./pages/Admin/admin-add-category";
import UpdateCategoryAdmin from "./components/Admin/UpdateCategoryAdmin";
import AdminUpdateCategory from "./pages/Admin/admin-update-category";
import SingleOrderPageAdmin from "./pages/Admin/admin-single-order-page";
import BannerPageAdmin from "./pages/Admin/admin-banner-page";
import AccountPageAdmin from "./pages/Admin/admin-account-page";
import ChangeDetailsPageAdmin from "./pages/Admin/admin-change-details";
import ChangePasswordPageAdmin from "./pages/Admin/admin-change-password";
import StripeKeysPageAdmin from "./pages/Admin/admin-stripe-keys-page";
import UpdateStripeKeysPageAdmin from "./pages/Admin/admin-update-stripe-keys-page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={VIEWS.SIGNUP} index element={<SignUp />} />
        <Route path={VIEWS.SIGNIN} element={<SignIn />} />
        <Route path={VIEWS.FORGOTPASSWORD} element={<ForgotPassword />} />
        <Route path={VIEWS.RESETPASSWORD} element={<ResetPassword />} />
        <Route path={VIEWS.HOME} element={<Home />} />
        <Route path={VIEWS.PRODUCTS} element={<ProductList />} />
        <Route path={VIEWS.SINGLEPRODUCT} element={<SingleProduct />} />
        <Route path={VIEWS.CONTACT} element={<Contact />} />
        <Route path="/" element={<AuthProtectedRoutes />}>
          <Route path={VIEWS.CHAT} element={<RealtimeChat />} />
          <Route path={VIEWS.MYACCOUNT} element={<MyAccount />}>
            <Route index element={<Navigate to={VIEWS.CHANGEUSERDETAILS} />} />
            <Route
              path={VIEWS.CHANGEUSERDETAILS}
              element={<ChangeUserDetails />}
            />
            <Route path={VIEWS.CHANGEPASSWORD} element={<ChangePassword />} />
          </Route>
          <Route path={VIEWS.CHECKOUT_SUCCESS} element={<CheckoutSuccess />} />
          <Route path={VIEWS.CHECKOUT_FAILED} element={<CheckoutFailed />} />
          <Route path={VIEWS.CART} element={<Cart />} />
          <Route path={VIEWS.CHECKOUT} element={<CheckoutSummery />} />
          <Route path={VIEWS.MY_ORDERS} element={<MyOrders />} />
        </Route>
        <Route path="/admin" element={<AdminProtectedRoutes />}>
          <Route path={VIEWS.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          <Route path={VIEWS.ADMIN_PRODUCTS} element={<ProductPageAdmin />} />
          <Route path={VIEWS.ADMIN_SINGLE_PRODUCT} element={<SingleProductPageAdmin />} />
          <Route path={VIEWS.ADMIN_ADD_PRODUCT} element={<AddNewProductPageAdmin />} />
          <Route path={VIEWS.ADMIN_UPDATE_PRODUCT} element={<AddNewProductPageAdmin />} />
          <Route path={VIEWS.ADMIN_USERS} element={<UserPageAdmin />} />
          <Route path={VIEWS.ADMIN_SINGLE_USER} element={<SingleUserPageAdmin />} />
          <Route path={VIEWS.ADMIN_ADD_USER} element={<AddNewUserPageAdmin />} />
          <Route path={VIEWS.ADMIN_UPDATE_USER} element={<AddNewUserPageAdmin />} />
          <Route path={VIEWS.ADMIN_ORDERS} element={<OrderPageAdmin />} />
          <Route path={VIEWS.ADMIN_SINGLE_ORDER} element={<SingleOrderPageAdmin />} />
          <Route path={VIEWS.ADMIN_CATEGORIES} element={<CategoryPageAdmin />} />
          <Route path={VIEWS.ADMIN_ADD_CATEGORIES} element={<AdminAddCategory />} />
          <Route path={VIEWS.ADMIN_UPDATE_CATEGORIES} element={<AdminUpdateCategory />} />
          <Route path={VIEWS.ADMIN_BANNER} element={<BannerPageAdmin />} />
          <Route path={VIEWS.ADMIN_STRIPE_KEYS} element={<StripeKeysPageAdmin />} />
          <Route path={VIEWS.ADMIN_UPDATE_STRIPE_KEYS} element={<UpdateStripeKeysPageAdmin />} />
          <Route path={VIEWS.ADMIN_MY_ACCOUNT} element={<AccountPageAdmin />}></Route>
          <Route path={VIEWS.ADMIN_CHANGE_DETAILS} element={<ChangeDetailsPageAdmin />}></Route>
          <Route path={VIEWS.ADMIN_CHANGE_PASSWORD} element={<ChangePasswordPageAdmin />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
