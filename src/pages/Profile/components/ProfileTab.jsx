import { useState } from "react";
import { User, Mail, Phone, Camera } from "lucide-react";
import { Button, Input, Spinner } from "../../../components/ui";
import { userService } from "../../../services";
import { useAuth } from "../../../contexts";
import toast from "react-hot-toast";
const ProfileTab = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileData, setProfileData] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file tối đa 5MB");
      return;
    }

    setUploadingAvatar(true);
    try {
      const res = await userService.uploadAvatar(file);
      updateUser(res.user);
      toast.success("Cập nhật ảnh đại diện thành công");
    } catch (error) {
      console.error("Upload avatar error:", error);
      toast.error(error.message || "Không thể cập nhật ảnh đại diện");
    } finally {
      setUploadingAvatar(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }

    if (profileData.phone && !/^[0-9]{10,11}$/.test(profileData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await userService.updateProfile({
        fullName: profileData.name,
        phone: profileData.phone,
      });
      updateUser(res.user);
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      toast.error(error.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex items-center gap-6 pb-6 border-b border-beige-200">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-beige-100 flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={40} className="text-char-400" />
            )}
          </div>
          <label
            htmlFor="avatar-upload"
            className={`absolute bottom-0 right-0 p-2 bg-primary-500 rounded-full cursor-pointer hover:bg-primary-600 transition-colors ${
              uploadingAvatar ? "opacity-50 cursor-not-allowed" : ""
            }`}>
            {uploadingAvatar ? (
              <Spinner size="xs" />
            ) : (
              <Camera size={16} className="text-white" />
            )}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-char-900">
            {user?.fullName}
          </h3>
          <p className="text-char-500">{user?.email}</p>
        </div>
      </div>
      {/* Profile Form */}
      <h2 className="text-xl font-semibold text-char-900 mb-6 mt-6">
        Thông tin cá nhân
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Họ và tên"
            name="name"
            value={profileData.name}
            onChange={handleChange}
            error={errors.name}
            icon={<User size={18} className="text-char-400" />}
          />
          <Input
            label="Email"
            type="email"
            value={profileData.email}
            disabled
            icon={<Mail size={18} className="text-char-400" />}
            helperText="Email không thể thay đổi"
          />
          <Input
            label="Số điện thoại"
            name="phone"
            value={profileData.phone}
            onChange={handleChange}
            error={errors.phone}
            icon={<Phone size={18} className="text-char-400" />}
            className="md:col-span-2"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProfileTab;
