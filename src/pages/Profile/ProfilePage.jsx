import { useState } from "react";
import { User, MapPin, Lock, LogOut } from "lucide-react";
import { Breadcrumb } from "../../components/common";
import { useAuth } from "../../contexts";
import { ProfileTab, AddressTab, PasswordTab } from "./components";
import { Button } from "../../components/ui";
const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const tabs = [
    { id: "profile", label: "Thông tin cá nhân", icon: User },
    { id: "address", label: "Địa chỉ", icon: MapPin },
    { id: "password", label: "Đổi mật khẩu", icon: Lock },
  ];
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Tài khoản" }]} className="mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-beige-200 p-6">
            {/* User Info */}
            <div className="text-center mb-6 pb-6 border-b border-beige-200">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-beige-100 mx-auto mb-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary-500">
                    {user?.fullName?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <h2 className="text-lg font-semibold text-char-900">
                {user?.fullName}
              </h2>
              <p className="text-sm text-char-500">{user?.email}</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-primary-50 text-primary-600"
                        : "text-char-600 hover:bg-beige-50"
                    }`}>
                    <Icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left mt-2 cursor-pointer">
                <LogOut size={18} />
                <span className="font-medium">Đăng xuất</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-beige-200 p-6">
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "password" && <PasswordTab />}
            {activeTab === "address" && <AddressTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
