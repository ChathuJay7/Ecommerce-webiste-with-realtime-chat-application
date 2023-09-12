import React from 'react';
import { Link } from 'react-router-dom';
import { VIEWS } from '../../utils/Views';

const SideBarAdmin = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 flex-shrink-0 mt-20">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      </div>
      <nav className="p-2">
        <ul className="space-y-2">
          <li>
            <Link
              to={VIEWS.ADMIN_DASHBOARD}
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
            </Link>
          </li>
          <li>
            <Link
              to={VIEWS.ADMIN_PRODUCTS}
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              <i className="fas fa-box mr-2"></i>Products
            </Link>
          </li>
          <li>
            <Link
              to={VIEWS.ADMIN_USERS}
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              <i className="fas fa-user mr-2"></i>Users
            </Link>
          </li>
          <li>
            <Link
              to={VIEWS.ADMIN_ORDERS}
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              <i className="fas fa-book mr-2"></i>Orders
            </Link>
          </li>
          <li>
            <Link
              to={VIEWS.ADMIN_CATEGORIES}
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              <i className="fa-solid fa-bars-staggered"></i> Categories
            </Link>
          </li>
          <li>
            <Link
              to={VIEWS.ADMIN_BANNER}
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              <i className="fa-solid fa-image"></i> Banner Images
            </Link>
          </li>
          <li>
            <Link
              to={VIEWS.ADMIN_STRIPE_KEYS}
              className="block py-2 px-4 rounded hover:bg-gray-700"
            >
              <i className="fa-solid fa-key"></i> Stripe Keys
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBarAdmin;
