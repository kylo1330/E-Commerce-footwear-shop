import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Register from "./components/auth/register";
import Login from "./components/auth/Login";
import ListPost from "./components/admin/ListPost";
import CreateFootwear from "./components/admin/CreateFootwear";
import EditPost from "./components/admin/EditPost";
import UserListPost from "./components/user/UserListPost";
import Viewdetails from "./components/user/viewdetails";
import Cart from "./components/user/Cart";
import ConfirmationPage from "./components/user/ConfirmationPage";



const router = createBrowserRouter([
    { path: '/', element: <App/> }, // Root route
    { path: '/register', element: <Register/> }, // Register route
    { path: '/login', element: <Login/> }, // Login route
    { path: '/admin/create', element: <CreateFootwear/> },
    { path: '/admin/list', element: <ListPost/> },
    { path: '/admin/posts/:footwearId/edit', element: <EditPost/> },
    { path: '/user/list/', element: <UserListPost/> },

    { path: '/shoe_details/:footwearId/', element: <Viewdetails /> },
    { path: '/cart/', element: <Cart/> },
    { path: '/confirmation/', element: <ConfirmationPage /> }


    
    


]);

export default router;
