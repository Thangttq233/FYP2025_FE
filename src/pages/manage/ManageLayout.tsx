import AdminNavbar from "@/components/shared/AdminNavbar";
import Sidebar from "@/components/shared/Sidebar";
import { Outlet } from "react-router-dom";

const ManageLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col h-full relative w-full min-w-0">
        <div className="sticky top-0 z-40 w-full shadow-sm">
          <AdminNavbar />
        </div>
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-stone-50">
            <div className="w-full max-w-[1600px] mx-auto">
                <Outlet />
            </div>
        </main>
      </div>
    </div>
  );
};

export default ManageLayout;