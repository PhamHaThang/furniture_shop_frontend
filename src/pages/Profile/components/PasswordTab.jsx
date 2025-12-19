import { useState } from "react";
import { Lock } from "lucide-react";
import { Button, Input, Spinner } from "../../../components/ui";
import { userService } from "../../../services";
import toast from "react-hot-toast";

const PasswordTab = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng nhập mật khẩu xác nhận";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      toast.success("Đổi mật khẩu thành công");
    } catch (error) {
      toast.error(error.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <h2 className="text-xl font-semibold text-char-900 mb-6">Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <Input
          label="Mật khẩu hiện tại"
          type="password"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={handleChange}
          error={errors.currentPassword}
          icon={<Lock size={18} className="text-char-400" />}
        />
        <Input
          label="Mật khẩu mới"
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          helperText="Mật khẩu phải có ít nhất 6 ký tự"
          icon={<Lock size={18} className="text-char-400" />}
        />
        <Input
          label="Xác nhận mật khẩu mới"
          type="password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          icon={<Lock size={18} className="text-char-400" />}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Đang đổi...
              </>
            ) : (
              "Đổi mật khẩu"
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default PasswordTab;
