import { Menu, UserCircle2, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router"; 
import { logout } from "../../slice/auth/authSlice";

const AdminNavbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleLogout = () => {
    localStorage.removeItem("isMasterAdmin");
    dispatch(logout())
    navigate("/auth/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 p-3 sm:p-4 bg-[#F5F7FB]">
      <div className="max-w-[1400px] mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 h-16 px-4 sm:px-6 flex items-center justify-between gap-4">

        <div className="flex items-center gap-4 sm:gap-6">
  
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden p-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-cyan-50 hover:text-[#06A1B7] transition-colors"
            title="Open Menu"
          >
            <Menu size={24} />
          </button>

          <img
           onClick={()=> navigate("/admin")}
            src="/Logo.png"
            alt="Logo"
            className="h-7 sm:h-9 w-auto object-contain cursor-pointer"
          />
        </div>

        {/* Center: Title (Desktop only) */}
        <div className="hidden lg:block text-[#06A1B7] font-bold text-center absolute left-1/2 -translate-x-1/2">
          <h1 className="text-xl tracking-wide">Admin Panel</h1>
        </div>

        {/* Right Side: Profile & Logout */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* Profile Badge */}
          <div className="flex items-center gap-3 p-1.5 pr-4 rounded-xl bg-gray-50 border border-gray-100">
            <UserCircle2 size={32} className="text-[#06A1B7]" />
            <div className="hidden sm:block text-left">
              <h2 className="font-bold text-gray-800 text-sm leading-tight">
                Darpan
              </h2>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold block mt-0.5">
                Admin
              </span>
            </div>
          </div>

          {/* Divider line */}
          <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 bg-white sm:bg-red-50 text-red-600 sm:hover:bg-red-600 sm:hover:text-white rounded-xl transition-all border border-transparent sm:border-red-100 font-semibold shadow-sm"
          >
            <LogOut size={20} />
            <span className="hidden sm:block text-sm">Logout</span>
          </button>

        </div>

      </div>
    </header>
  );
};

export default AdminNavbar;