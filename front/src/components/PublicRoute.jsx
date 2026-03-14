import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const PublicRoute = () => {
  const { authUser, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );

  return authUser ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
