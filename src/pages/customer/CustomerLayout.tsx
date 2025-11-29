import { Outlet } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const CustomerLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white w-full relative">
      <Navbar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 py-4 md:px-8 md:py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default CustomerLayout;
