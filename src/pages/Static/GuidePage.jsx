import {
  ShoppingCart,
  Search,
  CreditCard,
  Truck,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../../components/common";
import { Button } from "../../components/ui";
import { ROUTES } from "../../config";

const GuidePage = () => {
  const steps = [
    {
      icon: Search,
      title: "1. Tìm kiếm sản phẩm",
      description:
        "Duyệt qua các danh mục hoặc sử dụng thanh tìm kiếm để tìm sản phẩm bạn yêu thích. Bạn có thể lọc theo giá, thương hiệu, và nhiều tiêu chí khác.",
      tips: [
        "Sử dụng bộ lọc để thu hẹp kết quả tìm kiếm",
        "Xem đánh giá từ người mua trước",
        "So sánh giá giữa các sản phẩm tương tự",
      ],
    },
    {
      icon: ShoppingCart,
      title: "2. Thêm vào giỏ hàng",
      description:
        "Khi đã chọn được sản phẩm ưng ý, nhấn nút 'Thêm vào giỏ hàng'. Bạn có thể tiếp tục mua sắm hoặc tiến hành thanh toán.",
      tips: [
        "Kiểm tra số lượng trước khi thêm",
        "Sản phẩm trong giỏ hàng được lưu tự động",
        "Bạn có thể thêm sản phẩm vào danh sách yêu thích để mua sau",
      ],
    },
    {
      icon: CreditCard,
      title: "3. Thanh toán",
      description:
        "Điền đầy đủ thông tin giao hàng và chọn phương thức thanh toán. Nhập mã giảm giá nếu có để được ưu đãi.",
      tips: [
        "Kiểm tra kỹ địa chỉ giao hàng",
        "Áp dụng mã giảm giá trước khi thanh toán",
        "Chọn phương thức thanh toán phù hợp",
      ],
    },
    {
      icon: Truck,
      title: "4. Theo dõi đơn hàng",
      description:
        "Sau khi đặt hàng thành công, bạn có thể theo dõi trạng thái đơn hàng thông qua mã đơn hàng hoặc trong tài khoản của mình.",
      tips: [
        "Lưu lại mã đơn hàng để tra cứu",
        "Kiểm tra email để nhận thông báo cập nhật",
        "Liên hệ hotline nếu có vấn đề",
      ],
    },
    {
      icon: CheckCircle,
      title: "5. Nhận hàng",
      description:
        "Kiểm tra sản phẩm khi nhận hàng. Nếu có vấn đề, bạn có thể liên hệ với chúng tôi để được hỗ trợ đổi trả.",
      tips: [
        "Kiểm tra sản phẩm trước khi thanh toán COD",
        "Giữ lại hóa đơn để đổi trả nếu cần",
        "Đánh giá sản phẩm để giúp người mua khác",
      ],
    },
  ];

  const faqs = [
    {
      question: "Làm sao để tạo tài khoản?",
      answer:
        "Nhấn vào nút 'Đăng ký' ở góc trên bên phải, điền đầy đủ thông tin và xác nhận email để hoàn tất đăng ký.",
    },
    {
      question: "Tôi có thể mua hàng mà không cần đăng ký không?",
      answer:
        "Không, bạn phải tạo tài khoản để theo dõi đơn hàng và nhận các ưu đãi đặc biệt.",
    },
    {
      question: "Phí vận chuyển được tính như thế nào?",
      answer:
        "Phí vận chuyển được tính dựa trên địa chỉ giao hàng và trọng lượng đơn hàng. Đơn hàng từ 5.000.000đ được miễn phí vận chuyển.",
    },
    {
      question: "Tôi có thể hủy đơn hàng không?",
      answer:
        "Bạn có thể hủy đơn hàng khi đơn hàng đang ở trạng thái 'Chờ xác nhận'. Sau khi đơn hàng đã được xử lý, vui lòng liên hệ hotline để được hỗ trợ.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Hướng dẫn mua hàng" }]} className="mb-6" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-char-900 mb-4">
            Hướng dẫn mua hàng
          </h1>
          <p className="text-char-500 max-w-2xl mx-auto">
            Mua sắm tại HOMI Shop thật dễ dàng! Làm theo các bước đơn giản sau
            để sở hữu những sản phẩm nội thất yêu thích.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-beige-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                    <step.icon className="text-primary-500" size={28} />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-char-900 mb-2">
                    {step.title}
                  </h2>
                  <p className="text-char-600 mb-4">{step.description}</p>
                  <div className="bg-beige-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-char-700 mb-2">
                      💡 Mẹo hữu ích:
                    </p>
                    <ul className="space-y-1">
                      {step.tips.map((tip, tipIndex) => (
                        <li
                          key={tipIndex}
                          className="text-sm text-char-600 flex items-center gap-2 mt-1">
                          <span className="text-primary-500">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-char-900 mb-6 flex items-center gap-2">
            <HelpCircle className="text-primary-500" />
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-beige-200 p-5">
                <h3 className="font-semibold text-char-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-char-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Sẵn sàng mua sắm?</h2>
          <p className="mb-6 opacity-90">
            Khám phá hàng ngàn sản phẩm nội thất chất lượng cao với giá tốt nhất
          </p>
          <Link to={ROUTES.PRODUCTS}>
            <Button variant="secondary">
              Bắt đầu mua sắm
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
