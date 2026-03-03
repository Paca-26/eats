import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <Outlet />
      <MobileBottomNav />
    </div>
  );
};

export default MainLayout;
