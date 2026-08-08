import { Outlet, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import AdminNavbar from "../../admin/components/AdminNavbar";
import AdminSidebar from "../../admin/components/AdminSidebar";

const AdminLayout = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const masterAdminEmail = "darpan@gmail.com";
  const isLocalStorageAdmin = localStorage.getItem("isMasterAdmin") === "true";
  
  // Dynamically compute authorization status based on current Redux state + localStorage
  const userEmail = user?.email?.toLowerCase().trim() || "";
  const isAuthorized = isLocalStorageAdmin || userEmail === masterAdminEmail;

  useEffect(() => {
    // If loading is done and they are NOT authorized, kick them out
    if (!isLoading && !isAuthorized) {
      navigate("/auth/login", { replace: true });
    }
  }, [isLoading, isAuthorized, user, navigate]);

  // Show a quick loader while it synchronizes state
  if (isLoading && !isLocalStorageAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F7FB]">
        <div className="w-8 h-8 border-4 border-[#06A1B7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <AdminNavbar onToggleSidebar={() => setSidebarOpen(true)} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="max-w-[1440px] mx-auto flex">
        <AdminSidebar openSidebar={sidebarOpen} setOpenSidebar={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;