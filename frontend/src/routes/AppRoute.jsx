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



const AppRoute = () => {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);


  useEffect(() => {
    dispatch(getMeThunk())
      .unwrap()
      .then(() => {
        dispatch(getCartThunk());
      })
      .catch(() => {
         
      });
  }, [dispatch]);

  const router = createBrowserRouter([
   {
  path: "/admin",
  element: <AdminLayout />, // AdminLayout handles its own security
  children: [
    { path: "", element: <AdminDashboard /> },
    { path: "add-product", element: <AddProducts /> },
    { path: "edit-product/:id", element: <EditProduct /> },
    { path: "products", element: <AllProducts /> },
    { path: "orders", element: <AllOrders /> },
    { path: "orders/:id", element: <OrderSummary /> },
  ],
},


    {
      path: "/",
      element: <UserLayout />,
      children: [
        { path: "", element: <Home/> },
        { path: "shop", element: <Products /> },
        { path: "shop/:id", element: <SingleProduct /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <Contact /> },
        {path:"cart" , element: <Cart/>},
        {
          element: <ProtectedRoute />, 
          children: [
            { path: "profile", element: <ProfilePage /> },
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