import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone } from "lucide-react";
import { Button, Input, Spinner } from "../../components/ui";
import { useAuth } from "../../contexts";
import { ROUTES } from "../../config";
import toast from "react-hot-toast";
import logo from "../../assets/logo1.png";
const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      toast.success("Đăng ký thành công!");
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error(error.message || "Đăng ký thất bại");
    }
  };

  return (
    <>
      {/* Logo */}
      <div className="text-center mb-8">
        <Link to={ROUTES.HOME} className="inline-block">
          <img src={logo} alt="Logo" className="h-15 mx-auto" />
        </Link>
        <p className="text-char-500 mt-2">Tạo tài khoản mới của bạn</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Họ và tên"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Nguyễn Văn A"
            icon={<User size={18} className="text-char-400" />}
            autoComplete="name"
          />

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
            label="Số điện thoại (tùy chọn)"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="0901234567"
            icon={<Phone size={18} className="text-char-400" />}
            autoComplete="tel"
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

          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 text-primary-500 border-beige-300 rounded focus:ring-primary-500 mt-1"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-char-600">
              Tôi đồng ý với{" "}
              <Link to="/terms" className="text-primary-500 hover:underline">
                Điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link to="/privacy" className="text-primary-500 hover:underline">
                Chính sách bảo mật
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Đang đăng ký...
              </>
            ) : (
              "Đăng ký"
            )}
          </Button>
        </form>
      </div>

      {/* Login Link */}
      <p className="text-center mt-6 text-char-600">
        Đã có tài khoản?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="text-primary-500 font-medium hover:underline">
          Đăng nhập
        </Link>
      </p>
    </>
  );
};

export default RegisterPage;
