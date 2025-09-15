import AdminNavbar from "@/components/shared/AdminNavbar";
import Sidebar from "@/components/shared/Sidebar";
import { Outlet } from "react-router-dom";

const ManageLayout = () => {
  return (
    <div className="flex h-screen bg-white font-sans">
      <Sidebar />
      <div className="flex flex-1 flex-col relative">
        <div className="fixed left-[240px] right-0 top-0 z-50">
          <AdminNavbar />
        </div>
        <main className="flex-1 overflow-y-auto  pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManageLayout;
