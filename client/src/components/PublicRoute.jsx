import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PublicRoute() {
  const { currentUser } = useSelector((state) => state.user);

  // If the user is logged in, redirect them to the dashboard or any other page
  return currentUser ? <Navigate to="/dashboard" /> : <Outlet />;
}
