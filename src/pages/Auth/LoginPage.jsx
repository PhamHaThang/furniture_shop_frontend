import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Button, Input, Spinner } from "../../components/ui";
import { useAuth } from "../../contexts";
import { ROUTES } from "../../config";
import toast from "react-hot-toast";
import logo from "../../assets/logo1.png";
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const from = location.state?.from?.pathname || ROUTES.HOME;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login(formData.email, formData.password);
      toast.success("Đăng nhập thành công!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || "Đăng nhập thất bại");
    }
  };
  return (
    <>
      {/* Logo */}
      <div className="text-center mb-8">
        <Link to={ROUTES.HOME} className="inline-block">
          <img src={logo} alt="Logo" className="h-15 mx-auto" />
        </Link>
        <p className="text-char-500 mt-2">Đăng nhập vào tài khoản của bạn</p>
      </div>
      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="your@email.com"
            icon={<Mail size={18} className="text-char-400" />}
            autoComplete="email"
          />

          <Input
            label="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            icon={<Lock size={18} className="text-char-400" />}
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-500 border-beige-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-char-600">
                Ghi nhớ đăng nhập
              </span>
            </label>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-sm text-primary-500 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>
      </div>

      {/* Register Link */}
      <p className="text-center mt-6 text-char-600">
        Chưa có tài khoản?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="text-primary-500 font-medium hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </>
  );
};

export default LoginPage;
