export enum VIEWS {
  // PUBLIC ROUTES
  HOME = "/",
  SIGNUP = "/signup",
  SIGNIN = "/signin",
  FORGOTPASSWORD = "/forgot-password",
  RESETPASSWORD = "/reset-password",
  PRODUCTS = "/products",
  SINGLEPRODUCT = "/product",
  CONTACT = "/contact",

  // PRIVATE ROUTES
  CHAT = "/chat",
  MYACCOUNT = "/my-account",
  CHANGEUSERDETAILS = "/my-account/user-details",
  CHANGEPASSWORD = "/my-account/change-password",
  CHECKOUT = "/checkout",
  CHECKOUT_SUCCESS = "/checkout-success",
  CHECKOUT_FAILED = "/checkout-failed",
  MY_ORDERS = "/my-orders",
  ADMIN_DASHBOARD = "/admin",
  ADMIN_PRODUCTS = "/admin/admin-products",
  ADMIN_SINGLE_PRODUCT = "/admin/admin-product",
  ADMIN_ADD_PRODUCT = "/admin/admin-add-product",
  ADMIN_UPDATE_PRODUCT = "/admin/admin-update-product",
  ADMIN_USERS = "/admin/admin-users",
  ADMIN_SINGLE_USER = "/admin/admin-user",
  ADMIN_ADD_USER = "/admin/admin-add-user",
  ADMIN_UPDATE_USER = "/admin/admin-update-user",
  ADMIN_ORDERS = "/admin/admin-orders",
  ADMIN_SINGLE_ORDER = "/admin/admin-order",
  ADMIN_CATEGORIES = "/admin/admin-categories",
  ADMIN_ADD_CATEGORIES = "/admin/admin-add-categories",
  ADMIN_UPDATE_CATEGORIES = "/admin/admin-update-categories",
  ADMIN_BANNER = "/admin/admin-banner",
  ADMIN_STRIPE_KEYS = "/admin/admin-stripe_keys",
  ADMIN_UPDATE_STRIPE_KEYS = "/admin/admin-update-stripe_keys",
  ADMIN_MY_ACCOUNT = "/admin/my-account",
  ADMIN_CHANGE_DETAILS = "/admin/admin-details",
  ADMIN_CHANGE_PASSWORD = "/admin/admin-password",
  CUSTOMER_DASHBOARD = "/customer",
  CART = "/cart",
}