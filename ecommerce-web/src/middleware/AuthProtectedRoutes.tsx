import { useAppSelector } from "../app/hooks";
import { VIEWS } from "../utils/Views";
import { Navigate, Outlet } from "react-router-dom";

const AuthProtectedRoutes = () => {
  const { isAuth } = useAppSelector((state) => state.auth);
  const accessToken = localStorage.getItem("accessToken");
  return isAuth && accessToken ? <Outlet /> : <Navigate to={VIEWS.SIGNIN} />;
};

export default AuthProtectedRoutes;
