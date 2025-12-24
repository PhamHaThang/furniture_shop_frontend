import { useState, useEffect } from "react";
import { X, Eye, EyeOff, MapPin, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { adminService, uploadService } from "../../../services";
import { Button, Input, Select } from "../../../components";
const UserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    avatar: "",
    address: [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      phone: "",
      role: "user",
      avatar: "",
      address: [],
    });
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn tệp hình ảnh hợp lệ.");
      return;
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước tệp không vượt quá 5MB.");
      return;
    }
    // Preview image immediately using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    if (isOpen) {
      if (user)
        setFormData((prev) => ({
          ...prev,
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          role: user.role || "user",
          avatar: user.avatar || "",
          address: user.address || [],
          password: "",
        }));
      else resetForm();
    }
  }, [user, isOpen]);

  const handleAddAddress = () => {
    setFormData({
      ...formData,
      address: [
        ...formData.address,
        {
          fullName: "",
          phone: "",
          province: "",
          district: "",
          ward: "",
          address: "",
          isDefault: formData.address.length === 0,
        },
      ],
    });
  };
  const handleAddressChange = (index, field, value) => {
    const newAddress = [...formData.address];

    // Nếu isDefault được chọn, đặt tất cả các địa chỉ khác thành false
    if (field === "isDefault" && value === true) {
      newAddress.forEach((addr, addrIndex) => {
        if (addrIndex !== index) {
          addr.isDefault = false;
        }
      });
    }

    newAddress[index] = {
      ...newAddress[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      address: newAddress,
    });
  };
  const handleRemoveAddress = (index) => {
    const newAddress = formData.address.filter((_, i) => i !== index);
    setFormData({ ...formData, address: newAddress });
  };
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Họ tên là bắt buộc.");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email là bắt buộc.");
      return false;
    }
    if (!user && !formData.password.trim()) {
      toast.error("Mật khẩu là bắt buộc khi tạo người dùng mới.");
      return false;
    } else if (formData.password && formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }
    if (formData.address.length > 0) {
      for (let i = 0; i < formData.address.length; i++) {
        const addr = formData.address[i];
        if (
          !addr.fullName?.trim() ||
          !addr.phone?.trim() ||
          !addr.province?.trim() ||
          !addr.district?.trim() ||
          !addr.ward?.trim() ||
          !addr.address?.trim()
        ) {
          toast.error(`Vui lòng điền đầy đủ thông tin cho Địa chỉ ${i + 1}.`);
          return false;
        }
      }
    }

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      let imageUrl = formData.avatar;
      // If image is a base64 string, upload it
      // If image is base64, upload to Cloudinary first
      if (imageUrl && imageUrl.startsWith("data:image/")) {
        setUploading(true);
        try {
          // Convert base64 to blob
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], "brand-logo.jpg", { type: blob.type });

          // Upload to Cloudinary
          const result = await uploadService.uploadImage(file);
          imageUrl = result.data.url;
        } catch {
          toast.error("Không thể tải ảnh lên");
          setLoading(false);
          setUploading(false);
          return;
        } finally {
          setUploading(false);
        }
      }
      const data = { ...formData, avatar: imageUrl };
      if (!data.password) delete data.password;

      if (user) {
        await adminService.updateUserById(user._id, data);
        toast.success("Cập nhật người dùng thành công!");
      } else {
        await adminService.createUser(data);
        toast.success("Tạo người dùng thành công!");
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-char-900">
            {user ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </h2>
          <button
            onClick={() => {
              onClose();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Input
            label="Họ tên *"
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            required
          />
          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            disabled={!!user}
          />
          <Input
            label={`Mật khẩu ${!user ? "*" : ""}`}
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required={!user}
            placeholder={user ? "Để trống nếu không đổi" : ""}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600">
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            }
          />
          <Input
            label="Số điện thoại"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <Select
            label="Vai trò *"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { value: "user", label: "Người dùng" },
              { value: "admin", label: "Quản trị viên" },
            ]}
            placeholder="Chọn vai trò"
            required
          />

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh đại diện
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex items-center justify-center">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-2xl font-semibold">
                    {formData.fullName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                    uploading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}>
                  <Upload className="w-4 h-4" />
                  {uploading ? "Đang tải lên..." : "Chọn ảnh"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Định dạng: JPG, PNG. Tối đa 5MB
                </p>
                {formData.avatar && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: "" })}
                    className="text-xs text-red-600 hover:text-red-700 mt-1 cursor-pointer">
                    Xóa ảnh
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Địa chỉ
              </label>
              <button
                type="button"
                onClick={handleAddAddress}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
                + Thêm địa chỉ
              </button>
            </div>
            {formData.address.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                Chưa có địa chỉ nào
              </p>
            ) : (
              <div className="space-y-3">
                {formData.address.map((addr, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg space-y-2 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <span className="text-sm font-medium text-gray-700">
                          Địa chỉ {index + 1}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAddress(index)}
                        className="text-red-600 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Họ tên"
                        type="text"
                        value={addr.fullName || ""}
                        onChange={(e) =>
                          handleAddressChange(index, "fullName", e.target.value)
                        }
                        required
                      />
                      <Input
                        label="Số điện thoại"
                        type="tel"
                        value={addr.phone || ""}
                        onChange={(e) =>
                          handleAddressChange(index, "phone", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        label="Tỉnh/Thành"
                        type="text"
                        value={addr.province || ""}
                        onChange={(e) =>
                          handleAddressChange(index, "province", e.target.value)
                        }
                        required
                      />
                      <Input
                        label="Quận/Huyện"
                        type="text"
                        value={addr.district || ""}
                        onChange={(e) =>
                          handleAddressChange(index, "district", e.target.value)
                        }
                        required
                      />
                      <Input
                        type="text"
                        label="Phường/Xã"
                        value={addr.ward || ""}
                        onChange={(e) =>
                          handleAddressChange(index, "ward", e.target.value)
                        }
                        required
                      />
                    </div>
                    <Input
                      type="text"
                      label="Địa chỉ cụ thể (Số nhà, đường)"
                      value={addr.address || ""}
                      onChange={(e) =>
                        handleAddressChange(index, "address", e.target.value)
                      }
                      required
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={addr.isDefault || false}
                        onChange={(e) =>
                          handleAddressChange(
                            index,
                            "isDefault",
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-600">Địa chỉ mặc định</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => {
                onClose();
              }}
              variant="outline"
              className="flex-1">
              Hủy
            </Button>

            <Button
              variant="primary"
              type="submit"
              loading={loading || uploading}
              disabled={loading || uploading}
              className="flex-1 ">
              {loading || uploading
                ? "Đang xử lý..."
                : user
                ? "Cập nhật"
                : "Tạo mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
