import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button, Input, Spinner } from "../../components/ui";
import { authService } from "../../services";
import { ROUTES } from "../../config";
import toast from "react-hot-toast";
import logo from "../../assets/logo1.png";
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const validate = () => {
    if (!email.trim()) {
      setError("Vui lòng nhập email");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ");
    }
    return !error;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await authService.forgotPassword({ email });
      setSent(true);
      toast.success(response?.message || "Đã gửi email đặt lại mật khẩu!");
    } catch (err) {
      toast.error(err.message || "Gửi email thất bại");
    } finally {
      setLoading(false);
    }
  };
  if (sent) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-char-900 mb-4">
          Kiểm tra email của bạn
        </h1>
        <p className="text-char-600 mb-2">
          Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến email{" "}
          <span className="font-medium text-char-900">{email}</span>
        </p>
        <p className="text-sm text-char-500 mb-6 italic">
          Không nhận được email? Kiểm tra thư mục spam hoặc
        </p>
        <Button
          variant="outline"
          onClick={() => setSent(false)}
          className="mb-4">
          Gửi lại email
        </Button>
        <div>
          <Link
            to={ROUTES.LOGIN}
            className="text-primary-500 hover:underline text-sm">
            <ArrowLeft size={16} className="inline mr-1" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME} className="inline-block">
            <img src={logo} alt="Logo" className="h-15 mx-auto" />
          </Link>
          <p className="text-char-500 mt-2">
            Khôi phục mật khẩu tài khoản của bạn
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-char-600 mb-6 text-center">
            Nhập email đã đăng ký, chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu
            cho bạn.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              error={error}
              placeholder="your@email.com"
              icon={<Mail size={18} className="text-char-400" />}
              autoComplete="email"
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Đang gửi...
                </>
              ) : (
                "Gửi email khôi phục"
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
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
