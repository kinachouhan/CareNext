import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router"; 

// Admin Imports
import AdminLayout from "../app/layout/AdminLayout";
import AdminDashboard from "../admin/pages/AdminDashboard";
import AddProducts from "./../admin/pages/AddProducts";
import EditProduct from "../admin/pages/EditProduct";
import AllProducts from "../admin/pages/AllProducts";
import AllOrders from "../admin/pages/AllOrders";
import OrderSummary from "../admin/pages/OrderSummary";

// User Imports
import UserLayout from "../app/layout/UserLayout";
import Home from "../features/home/page/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Products from "../features/products/page/Products";
import SingleProduct from "../features/products/page/SingleProduct";
import ProfilePage from "./../features/profile/ui/ProfilePage";

// Auth & Security Imports
import AuthLayout from "../app/layout/AuthLayout";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import Cart from "../features/cart/page/Cart";
import { useDispatch, useSelector } from "react-redux";
import { getCartThunk } from "../slice/cart/cartThunk";
import { getMeThunk } from "../slice/auth/authThunk";
import Wishlist from "../features/wishlist/page/Wishlist";
import { getWishlistThunk } from "../slice/wishlist/wishlistThunk";
import Orders from "../features/orders/ui/Orders";
import SavedAddresses from "../features/address/page/SaveAddresses";
import CheckoutPage from "../features/checkout/page/CheckoutPage";
import UpiPaymentPage from "../features/checkout/page/UpiPaymentPage";
import OrderDetailsPage from "../features/orders/ui/OrderDetails";

const AppRoute = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch session checks cleanly without blocking unwrap promises
    dispatch(getMeThunk());
    dispatch(getCartThunk());
    dispatch(getWishlistThunk());
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/admin",
      element: <ProtectedRoute adminOnly={true} />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { path: "", element: <AdminDashboard /> },
            { path: "add-product", element: <AddProducts /> },
            { path: "edit-product/:id", element: <EditProduct /> },
            { path: "products", element: <AllProducts /> },
            { path: "orders", element: <AllOrders /> },
            { path: "orders/:id", element: <OrderSummary /> },
          ],
        },
      ],
    },

    {
      path: "/",
      element: <UserLayout />,
      children: [
        { path: "", element: <Home /> },
        { path: "shop", element: <Products /> },
        { path: "shop/:id", element: <SingleProduct /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <Contact /> },
        { path: "cart", element: <Cart /> },
        { path: "wishlist", element: <Wishlist /> },
        {
          element: <ProtectedRoute />, 
          children: [
            { path: "profile", element: <ProfilePage /> },
            { path: "orders", element: <Orders /> },
            { path: "addresses", element: <SavedAddresses /> },
            { path: "checkout", element: <CheckoutPage /> },
            { path: "checkout/upi", element: <UpiPaymentPage /> },
            { path: "orders/:id", element: <OrderDetailsPage /> },
          ],
        },
      ],
    },

    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoute;