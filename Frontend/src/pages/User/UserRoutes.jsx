import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const UserRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo?.data?.isAdmin; // Adjust this based on your Redux state structure

  // **Fix: Avoid redirecting before Redux state is loaded**
  if (userInfo === undefined) return null; // Prevent flashing before loading

  return !isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default UserRoutes;
