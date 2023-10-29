import Navbar from "@/components/navbar";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedPage = () => {
  const token = sessionStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default ProtectedPage;
