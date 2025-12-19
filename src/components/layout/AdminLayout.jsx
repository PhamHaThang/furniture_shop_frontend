import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo1.png";
import { useAuth } from "../../contexts";
import { ADMIN_SIDEBAR_LINKS } from "../../config";
import { ChevronLeft, LogOut, X, Home, Menu } from "lucide-react";
const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-char-900 text-white transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-char-700">
          {isSidebarOpen && (
            <img src={logo} alt="Logo" className="h-8  object-contain" />
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-char-800 transition-colors cursor-pointer">
            <ChevronLeft
              className={`w-5 h-5 transition-transform ${
                !isSidebarOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-char-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {ADMIN_SIDEBAR_LINKS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-500 text-white"
                    : "text-gray-300 hover:bg-char-800 hover:text-white"
                }`
              }
              onClick={() => setIsMobileSidebarOpen(false)}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-char-700 p-4">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-char-800 hover:text-white transition-colors mb-2">
            <Home className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span>Về trang chủ</span>}
          </NavLink>
          {isSidebarOpen && (
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer">
            <LogOut className="w-5 h-5 flex-shrink-0 " />
            {isSidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              Xin chào,{" "}
              <span className="font-medium">
                {user.fullName.split(" ").slice(-1)[0]}
              </span>
            </span>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                {user?.fullName
                  ?.split(" ")
                  .map((n) => n.charAt(0))
                  .join("")
                  .toUpperCase()}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
