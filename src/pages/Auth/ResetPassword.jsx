import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { Button, Input, Spinner } from "../../components/ui";
import { ROUTES } from "../../config";
import toast from "react-hot-toast";
import logo from "../../assets/logo1.png";
import { authService } from "../../services";
const ResetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    token: "",
  });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (!token) {
      toast.error("Token không hợp lệ hoặc đã hết hạn");
      navigate(ROUTES.FORGOT_PASSWORD);
      return;
    }
    setFormData((prev) => ({ ...prev, token }));
  }, [token, navigate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData);
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await authService.resetPassword({
        newPassword: formData.newPassword,
        token: formData.token,
      });
      toast.success(response?.message || "Đặt lại mật khẩu thành công!");
      navigate(ROUTES.LOGIN);
    } catch (err) {
      toast.error(err.message || "Đặt lại mật khẩu thất bại");
      if (err.error === "INVALID_TOKEN") {
        navigate(ROUTES.FORGOT_PASSWORD);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Logo */}
      <div className="text-center mb-8">
        <Link to={ROUTES.HOME} className="inline-block">
          <img src={logo} alt="Logo" className="h-15 mx-auto" />
        </Link>
        <p className="text-char-500 mt-2">
          Đổi mật khẩu mới cho tài khoản của bạn
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Mật khẩu mới"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            placeholder="••••••••"
            icon={<Lock size={18} className="text-char-400" />}
            helperText="Mật khẩu phải có ít nhất 6 ký tự"
            autoComplete="new-password"
          />

          <Input
            label="Xác nhận mật khẩu"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="••••••••"
            icon={<Lock size={18} className="text-char-400" />}
            autoComplete="new-password"
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Đang đặt lại mật khẩu...
              </>
            ) : (
              "Đặt lại mật khẩu"
            )}
          </Button>
        </form>
      </div>
      {/* Back to Login */}
      <p className="text-center mt-6">
        <Link
          to={ROUTES.LOGIN}
          className="text-primary-500 hover:underline flex items-center justify-center">
          <ArrowLeft size={16} className="mr-1" />
          Quay lại đăng nhập
        </Link>
      </p>
    </>
  );
};

export default ResetPassword;
