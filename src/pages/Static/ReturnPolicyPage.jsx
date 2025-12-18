import {
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Phone,
} from "lucide-react";
import { Breadcrumb } from "../../components/common";

const ReturnPolicyPage = () => {
  const policies = [
    {
      icon: Clock,
      title: "Thời gian đổi trả",
      items: [
        "Đổi trả trong vòng 7 ngày kể từ ngày nhận hàng",
        "Sản phẩm lỗi do nhà sản xuất: đổi trả trong 30 ngày",
        "Sản phẩm điện tử: bảo hành theo chính sách của hãng",
      ],
    },
    {
      icon: CheckCircle,
      title: "Điều kiện đổi trả",
      items: [
        "Sản phẩm còn nguyên tem, nhãn mác",
        "Chưa qua sử dụng, còn nguyên bao bì",
        "Có hóa đơn mua hàng hoặc mã đơn hàng",
        "Sản phẩm không bị hư hỏng do người dùng",
      ],
    },
    {
      icon: XCircle,
      title: "Sản phẩm không được đổi trả",
      items: [
        "Sản phẩm đặt theo yêu cầu riêng",
        "Sản phẩm đã qua sử dụng hoặc lắp đặt",
        "Sản phẩm khuyến mãi, giảm giá đặc biệt",
        "Sản phẩm hư hỏng do sử dụng sai cách",
      ],
    },
  ];

  const steps = [
    {
      step: 1,
      title: "Liên hệ CSKH",
      description: "Gọi hotline 1900 1836 hoặc gửi email để yêu cầu đổi trả",
    },
    {
      step: 2,
      title: "Xác nhận yêu cầu",
      description: "Nhân viên sẽ xác nhận điều kiện và hướng dẫn quy trình",
    },
    {
      step: 3,
      title: "Gửi sản phẩm",
      description: "Đóng gói và gửi sản phẩm theo hướng dẫn của nhân viên",
    },
    {
      step: 4,
      title: "Kiểm tra & Hoàn tiền",
      description: "Chúng tôi kiểm tra và hoàn tiền trong 3-5 ngày làm việc",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Chính sách đổi trả" }]} className="mb-6" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="text-primary-500" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-char-900 mb-4">
            Chính sách đổi trả
          </h1>
          <p className="text-char-500 max-w-2xl mx-auto">
            HOMI Shop cam kết mang đến trải nghiệm mua sắm tốt nhất. Nếu không
            hài lòng với sản phẩm, bạn có thể đổi trả theo chính sách dưới đây.
          </p>
        </div>

        {/* Policy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {policies.map((policy, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-beige-200 p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <policy.icon className="text-primary-500" size={24} />
              </div>
              <h2 className="text-lg font-semibold text-char-900 mb-4">
                {policy.title}
              </h2>
              <ul className="space-y-2">
                {policy.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="text-char-600 text-sm flex items-start gap-2 mt-1">
                    <span className="text-primary-500 ">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Process */}
        <div className="bg-white rounded-xl border border-beige-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-char-900 mb-8 text-center">
            Quy trình đổi trả
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold ">
                  {item.step}
                </div>
                <h3 className="font-semibold text-char-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-char-500 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Info */}
        <div className="bg-beige-50 rounded-xl p-6 mb-12">
          <h2 className="text-xl font-semibold text-char-900 mb-4">
            Thông tin hoàn tiền
          </h2>
          <div className="space-y-4 text-char-600">
            <p>
              <strong>Thanh toán COD:</strong> Hoàn tiền qua chuyển khoản ngân
              hàng trong 3-5 ngày làm việc sau khi nhận được sản phẩm đổi trả.
            </p>
            <p>
              <strong>Thanh toán chuyển khoản:</strong> Hoàn tiền về tài khoản
              gốc trong 5-7 ngày làm việc.
            </p>
            <p>
              <strong>Phí vận chuyển:</strong> HOMI Shop chịu phí vận chuyển đổi
              trả nếu sản phẩm bị lỗi do nhà sản xuất. Các trường hợp khác,
              khách hàng chịu phí vận chuyển.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 text-white">
          <Phone className="mx-auto mb-4" size={40} />
          <h2 className="text-2xl font-bold mb-2">Cần hỗ trợ?</h2>
          <p className="mb-4 opacity-90">
            Liên hệ với chúng tôi để được tư vấn và hỗ trợ đổi trả
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="bg-white/20 rounded-lg px-6 py-3">
              <p className="text-sm opacity-80">Hotline</p>
              <p className="text-xl font-bold">1900 1836</p>
            </div>
            <div className="bg-white/20 rounded-lg px-6 py-3">
              <p className="text-sm opacity-80">Email</p>
              <p className="text-xl font-bold">support@homishop.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
