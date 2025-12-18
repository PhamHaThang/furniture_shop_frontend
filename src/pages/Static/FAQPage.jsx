import { useState } from "react";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { Breadcrumb } from "../../components/common";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      name: "Đặt hàng & Thanh toán",
      faqs: [
        {
          question: "Làm thế nào để đặt hàng trên HOMI Shop?",
          answer:
            "Bạn có thể đặt hàng bằng cách: 1) Tìm kiếm và chọn sản phẩm yêu thích, 2) Thêm vào giỏ hàng, 3) Điền thông tin giao hàng, 4) Chọn phương thức thanh toán và hoàn tất đặt hàng.",
        },
        {
          question: "HOMI Shop chấp nhận những phương thức thanh toán nào?",
          answer:
            "Chúng tôi chấp nhận thanh toán khi nhận hàng (COD) và chuyển khoản ngân hàng (BANK). Thông tin tài khoản sẽ được gửi qua email sau khi đặt hàng.",
        },
        {
          question: "Tôi có thể đặt hàng mà không cần tài khoản không?",
          answer:
            "Không, bạn cần tạo tài khoản để đặt hàng. Việc này giúp bạn theo dõi đơn hàng và quản lý thông tin cá nhân dễ dàng hơn.",
        },
        {
          question: "Làm sao để sử dụng mã giảm giá?",
          answer:
            "Tại trang thanh toán, nhập mã giảm giá vào ô 'Mã khuyến mãi' và nhấn 'Áp dụng'. Mã giảm giá sẽ được áp dụng nếu đơn hàng đáp ứng điều kiện.",
        },
      ],
    },
    {
      name: "Vận chuyển & Giao hàng",
      faqs: [
        {
          question: "Phí vận chuyển được tính như thế nào?",
          answer:
            "Phí vận chuyển được tính dựa trên địa chỉ giao hàng và trọng lượng đơn hàng. Đơn hàng từ 5.000.000đ được miễn phí vận chuyển toàn quốc.",
        },
        {
          question: "Thời gian giao hàng là bao lâu?",
          answer:
            "Thời gian giao hàng dự kiến: Nội thành HCM và Hà Nội: 1-2 ngày, Các tỉnh thành khác: 3-5 ngày. Thời gian có thể thay đổi tùy theo địa chỉ và điều kiện thời tiết.",
        },
        {
          question: "Tôi có thể theo dõi đơn hàng như thế nào?",
          answer:
            "Bạn có thể theo dõi đơn hàng bằng cách: 1) Đăng nhập tài khoản và xem mục 'Đơn hàng của tôi', hoặc 2) Sử dụng tính năng 'Tra cứu đơn hàng' với mã đơn hàng.",
        },
        {
          question:
            "Tôi có thể thay đổi địa chỉ giao hàng sau khi đặt hàng không?",
          answer:
            "Bạn có thể thay đổi địa chỉ giao hàng nếu đơn hàng chưa được xử lý. Vui lòng liên hệ hotline 1900 1836 để được hỗ trợ.",
        },
      ],
    },
    {
      name: "Đổi trả & Hoàn tiền",
      faqs: [
        {
          question: "Chính sách đổi trả của HOMI Shop như thế nào?",
          answer:
            "Bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng. Sản phẩm phải còn nguyên tem, nhãn mác, chưa qua sử dụng và có hóa đơn mua hàng.",
        },
        {
          question: "Làm sao để yêu cầu đổi trả?",
          answer:
            "Để yêu cầu đổi trả: 1) Liên hệ hotline 1900 1836 hoặc email support@homishop.com, 2) Cung cấp mã đơn hàng và lý do đổi trả, 3) Gửi sản phẩm theo hướng dẫn của nhân viên.",
        },
        {
          question: "Thời gian hoàn tiền là bao lâu?",
          answer:
            "Sau khi nhận được sản phẩm đổi trả và kiểm tra đạt yêu cầu, chúng tôi sẽ hoàn tiền trong 3-5 ngày làm việc (COD) hoặc 5-7 ngày làm việc (chuyển khoản).",
        },
      ],
    },
    {
      name: "Tài khoản & Bảo mật",
      faqs: [
        {
          question: "Làm sao để đăng ký tài khoản?",
          answer:
            "Nhấn 'Đăng ký' ở góc trên bên phải, điền đầy đủ thông tin (họ tên, email, số điện thoại, mật khẩu) và xác nhận email để hoàn tất đăng ký.",
        },
        {
          question: "Tôi quên mật khẩu, phải làm sao?",
          answer:
            "Nhấn 'Quên mật khẩu' tại trang đăng nhập, nhập email đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu qua email của bạn.",
        },
        {
          question: "Thông tin cá nhân của tôi có được bảo mật không?",
          answer:
            "Chúng tôi cam kết bảo mật thông tin cá nhân của bạn. Thông tin chỉ được sử dụng để xử lý đơn hàng và cải thiện dịch vụ. Xem chi tiết tại trang Chính sách bảo mật.",
        },
      ],
    },
    {
      name: "Sản phẩm & Bảo hành",
      faqs: [
        {
          question: "Sản phẩm có được bảo hành không?",
          answer:
            "Tất cả sản phẩm tại HOMI Shop đều được bảo hành theo chính sách của nhà sản xuất. Thời gian bảo hành tùy thuộc vào từng loại sản phẩm, thường từ 6-24 tháng.",
        },
        {
          question: "Làm sao để biết sản phẩm còn hàng hay không?",
          answer:
            "Tình trạng còn hàng được hiển thị trên trang chi tiết sản phẩm. Nếu hết hàng, bạn có thể đăng ký nhận thông báo khi có hàng trở lại.",
        },
        {
          question: "Hình ảnh sản phẩm có giống thực tế không?",
          answer:
            "Chúng tôi cố gắng chụp và hiển thị hình ảnh sản phẩm chính xác nhất. Tuy nhiên, màu sắc thực tế có thể khác một chút do điều kiện ánh sáng và màn hình hiển thị.",
        },
      ],
    },
  ];

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.faqs.length > 0);

  const toggleFAQ = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "FAQ" }]} className="mb-6" />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="text-primary-500" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-char-900 mb-4">
            Câu hỏi thường gặp
          </h1>
          <p className="text-char-500">
            Tìm câu trả lời cho những thắc mắc phổ biến về mua sắm tại HOMI Shop
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-char-400"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm câu hỏi..."
            className="w-full pl-12 pr-4 py-3 border border-beige-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* FAQ List */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-char-500">
              Không tìm thấy câu hỏi phù hợp. Vui lòng thử từ khóa khác hoặc
              liên hệ với chúng tôi.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-xl font-semibold text-char-900 mb-4">
                  {category.name}
                </h2>
                <div className="space-y-3">
                  {category.faqs.map((faq, faqIndex) => {
                    const isOpen = openIndex === `${categoryIndex}-${faqIndex}`;
                    return (
                      <div
                        key={faqIndex}
                        className="bg-white rounded-xl border border-beige-200 overflow-hidden">
                        <button
                          onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-beige-50 transition-colors">
                          <span className="font-medium text-char-900 pr-4">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`flex-shrink-0 text-char-400 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                            size={20}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4">
                            <p className="text-char-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact */}
        <div className="mt-12 text-center bg-beige-50 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-char-900 mb-2">
            Không tìm thấy câu trả lời?
          </h2>
          <p className="text-char-500 mb-4">
            Liên hệ với đội ngũ hỗ trợ của chúng tôi để được giúp đỡ
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:19001836"
              className="text-primary-600 font-medium hover:underline">
              1900 1836
            </a>
            <span className="hidden sm:inline text-beige-400">|</span>
            <a
              href="mailto:support@homishop.com"
              className="text-primary-600 font-medium hover:underline">
              support@homishop.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
