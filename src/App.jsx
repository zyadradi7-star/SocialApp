import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Login from "./Auth/Login/Login";
import Register from "./Auth/Register/Register";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import NotFound from "./Components/NotFound/NotFound";
import { CounterContextProvider } from "./Contexts/CounterContext";
import { AuthContextProvider } from "./Contexts/AuthContext";
import ProtectRoute from "./Components/ProtectRoute/ProtectRoute";
import ProtectAuth from "./Components/ProtectAuth/ProtectAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PostDetails from "./Components/postDetails/postDetails";
import ChangePassword from "./Components/ChangePassword/ChangePassword";
import { ToastContainer, toast } from "react-toastify";

const queryClient = new QueryClient();
function App() {
  let route = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <ProtectAuth>
              <Login />
            </ProtectAuth>
          ),
        },
        {
          path: "register",
          element: (
            <ProtectAuth>
              <Register />
            </ProtectAuth>
          ),
        },
        {
          path: "home",
          element: (
            <ProtectRoute>
              <Home />
            </ProtectRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectRoute>
              <Profile />
            </ProtectRoute>
          ),
        },
        {
          path: "postDetails/:id",
          element: (
            <ProtectRoute>
              <PostDetails />
            </ProtectRoute>
          ),
        },
        {
          path: "changePassword",
          element: (
            <ProtectRoute>
              <ChangePassword />
            </ProtectRoute>
          ),
        },
        { path: "navbar", element: <Navbar /> },
        { path: "footer", element: <Footer /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <CounterContextProvider>
            <RouterProvider router={route} />
            <ToastContainer />
            <ReactQueryDevtools />
          </CounterContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
