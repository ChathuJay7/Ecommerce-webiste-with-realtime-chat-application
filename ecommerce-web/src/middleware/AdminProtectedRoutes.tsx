import { useAppSelector } from "../app/hooks";
import { decodeJwt } from "../utils/Utilities";
import { VIEWS } from "../utils/Views";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoutes = () => {
  const { isAuth } = useAppSelector((state) => state.auth);
  const accessToken = localStorage.getItem("accessToken");
  const { role } = decodeJwt(accessToken);
  console.log("CHECK", isAuth && accessToken && role === "ADMIN");
  return isAuth && accessToken && role === "ADMIN" ? (
    <Outlet />
  ) : (
    <Navigate to={VIEWS.SIGNIN} />
  );
};

export default AdminProtectedRoutes;
