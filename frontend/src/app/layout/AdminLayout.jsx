import { Outlet } from "react-router";
import { useState } from "react";
import AdminNavbar from "../../admin/components/AdminNavbar";
import AdminSidebar from "../../admin/components/AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <AdminNavbar
        onToggleSidebar={() => setSidebarOpen(true)}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="max-w-[1440px] mx-auto flex">
        <AdminSidebar
          openSidebar={sidebarOpen}
          setOpenSidebar={setSidebarOpen}
        />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;