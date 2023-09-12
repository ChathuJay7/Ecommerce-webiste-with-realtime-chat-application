import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../API/User/UserAPI';
import { getAllProducts } from '../../API/Products/ProductAPI';
import { getAllOrders } from '../../API/Order/OrderAPI';
import { Link, useLocation } from 'react-router-dom';
import { VIEWS } from '../../utils/Views';

export const DashboardAdmin = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [bearerToken, setBearerToken] = useState("");
  const [userList, setUserList] = useState([]) as any;
  const [productList, setProductList] = useState([]) as any;
  const [orderList, setOrderList] = useState([]) as any;

  const fetchUsers = async () => {
    const getAllProductsResponse = await getAllUsers();
    if (getAllProductsResponse.success) {
      setUserList(getAllProductsResponse.data);
    } else {
      console.log("Error:", getAllProductsResponse.error);
    }
  };

  const fetchProducts = async () => {
    const getAllProductsResponse = await getAllProducts();
    if (getAllProductsResponse.success) {
      setProductList(getAllProductsResponse.data);
    } else {
      console.log("Error:", getAllProductsResponse.error);
    }
  };

  const fetchOrders = async () => {
    const getAllOrdersResponse = await getAllOrders(bearerToken);
    if (getAllOrdersResponse.success) {
      setOrderList(getAllOrdersResponse.data);
    } else {
      console.log("Error:", getAllOrdersResponse.error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
    fetchOrders();
  }, [location]);

  return (
    <div className="flex flex-wrap justify-center items-center h-screen w-screen px-10">
      <div className='bg-white h-[50%] w-full flex justify-center items-center mx-auto px-10'>
        <div className='bg-gray-300 h-[80%] w-full flex justify-center items-center mx-auto px-10'>
          <div className="w-full md:w-1/3 p-4 cursor-pointer">
            <Link to={VIEWS.ADMIN_USERS}>
              <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-8 text-center text-white shadow-lg hover:shadow-xl">
                <h3 className="text-2xl font-semibold mb-4"><i className="fas fa-user mr-2"></i>Users</h3>
                <p className="text-4xl font-bold">{userList.length}</p>
              </div>
            </Link>
          </div>

          <div className="w-full md:w-1/3 p-4 cursor-pointer">
            <Link to={VIEWS.ADMIN_PRODUCTS}>
              <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-8 text-center text-white shadow-lg hover:shadow-xl">
                <h3 className="text-2xl font-semibold mb-4"><i className="fas fa-box mr-2"></i>Products</h3>
                <p className="text-4xl font-bold">{productList.length}</p>
              </div>
            </Link>
          </div>

          <div className="w-full md:w-1/3 p-4 cursor-pointer">
            <Link to={VIEWS.ADMIN_ORDERS}>
              <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-8 text-center text-white shadow-lg hover:shadow-xl">
                <h3 className="text-2xl font-semibold mb-4"><i className="fas fa-book mr-2"></i>Orders</h3>
                <p className="text-4xl font-bold">{orderList.length}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

