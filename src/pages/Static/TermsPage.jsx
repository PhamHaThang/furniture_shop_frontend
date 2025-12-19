import { FileText, CheckCircle } from "lucide-react";
import { Breadcrumb } from "../../components/common";

const TermsPage = () => {
  const sections = [
    {
      title: "1. Giới thiệu",
      content: `Chào mừng bạn đến với HOMI Shop. Khi truy cập và sử dụng website homishop.com, bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây. Vui lòng đọc kỹ trước khi sử dụng dịch vụ của chúng tôi.

HOMI Shop có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong các điều khoản này vào bất cứ lúc nào. Các thay đổi có hiệu lực ngay khi được đăng tải trên website.`,
    },
    {
      title: "2. Điều kiện sử dụng",
      content: `Khi sử dụng website này, bạn cam kết:
• Có đủ năng lực pháp luật để thực hiện giao dịch
• Cung cấp thông tin chính xác, đầy đủ khi đăng ký tài khoản và đặt hàng
• Không sử dụng dịch vụ vào mục đích bất hợp pháp
• Không can thiệp hoặc làm ảnh hưởng đến hoạt động của website
• Bảo mật thông tin tài khoản và chịu trách nhiệm về mọi hoạt động dưới tài khoản của mình`,
    },
    {
      title: "3. Quy định về đặt hàng",
      content: `Khi đặt hàng tại HOMI Shop, bạn cần lưu ý:
• Kiểm tra kỹ thông tin sản phẩm, số lượng, giá cả trước khi xác nhận đơn hàng
• Cung cấp địa chỉ giao hàng chính xác và số điện thoại liên lạc
• Đơn hàng chỉ được xác nhận khi chúng tôi gửi email/tin nhắn xác nhận
• HOMI Shop có quyền từ chối hoặc hủy đơn hàng trong trường hợp phát hiện gian lận

Giá sản phẩm có thể thay đổi mà không cần báo trước. Giá áp dụng là giá tại thời điểm đặt hàng.`,
    },
    {
      title: "4. Chính sách thanh toán",
      content: `HOMI Shop chấp nhận các phương thức thanh toán sau:
• Thanh toán khi nhận hàng (COD)
• Chuyển khoản ngân hàng (BANK)

Đối với thanh toán chuyển khoản, đơn hàng sẽ được xử lý sau khi chúng tôi xác nhận nhận được thanh toán.

Trong trường hợp thanh toán không thành công hoặc phát hiện giao dịch bất thường, chúng tôi có quyền hủy đơn hàng và thông báo cho khách hàng.`,
    },
    {
      title: "5. Giao hàng và vận chuyển",
      content: `Thời gian giao hàng dự kiến:
• Nội thành TP.HCM và Hà Nội: 1-2 ngày làm việc
• Các tỉnh thành khác: 3-5 ngày làm việc

Phí vận chuyển được tính dựa trên địa chỉ và trọng lượng đơn hàng. Miễn phí vận chuyển cho đơn hàng từ 5.000.000đ.

HOMI Shop không chịu trách nhiệm về việc giao hàng chậm trễ do:
• Địa chỉ giao hàng không chính xác
• Khách hàng không thể nhận hàng
• Các yếu tố bất khả kháng (thiên tai, dịch bệnh...)`,
    },
    {
      title: "6. Chính sách đổi trả",
      content: `Khách hàng có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng với điều kiện:
• Sản phẩm còn nguyên tem, nhãn mác
• Chưa qua sử dụng, còn nguyên bao bì
• Có hóa đơn mua hàng hoặc mã đơn hàng

Sản phẩm không được đổi trả:
• Sản phẩm đặt theo yêu cầu riêng
• Sản phẩm khuyến mãi, giảm giá đặc biệt
• Sản phẩm hư hỏng do người dùng

Chi tiết xem tại trang Chính sách đổi trả.`,
    },
    {
      title: "7. Quyền sở hữu trí tuệ",
      content: `Tất cả nội dung trên website bao gồm nhưng không giới hạn: văn bản, hình ảnh, logo, biểu tượng, thiết kế, phần mềm... đều thuộc quyền sở hữu của HOMI Shop hoặc các đối tác được cấp phép.

Nghiêm cấm:
• Sao chép, tái sản xuất nội dung mà không có sự cho phép
• Sử dụng thương hiệu, logo của HOMI Shop mà không được ủy quyền
• Tạo ra các tác phẩm phái sinh từ nội dung của website`,
    },
    {
      title: "8. Giới hạn trách nhiệm",
      content: `HOMI Shop không chịu trách nhiệm về:
• Các thiệt hại gián tiếp, ngẫu nhiên phát sinh từ việc sử dụng website
• Nội dung của các website bên thứ ba được liên kết từ website của chúng tôi
• Việc gián đoạn dịch vụ do bảo trì hoặc lỗi kỹ thuật
• Các thông tin do người dùng đăng tải

Trong mọi trường hợp, trách nhiệm tối đa của HOMI Shop không vượt quá giá trị đơn hàng liên quan.`,
    },
    {
      title: "9. Luật áp dụng",
      content: `Các điều khoản này được điều chỉnh và giải thích theo pháp luật Việt Nam.

Mọi tranh chấp phát sinh từ hoặc liên quan đến các điều khoản này sẽ được giải quyết thông qua thương lượng. Trong trường hợp không đạt được thỏa thuận, tranh chấp sẽ được đưa ra giải quyết tại Tòa án có thẩm quyền tại Việt Nam.`,
    },
    {
      title: "10. Liên hệ",
      content: `Nếu có bất kỳ thắc mắc nào về các điều khoản sử dụng, vui lòng liên hệ:

CÔNG TY TNHH HOMI SHOP
Địa chỉ: Km10, Nguyễn Trãi, P. Hà Đông, Hà Nội
Hotline: 1900 1836
Email: support@homishop.com

Giờ làm việc: 8:00 - 21:00 (Thứ 2 - Chủ nhật)`,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Điều khoản sử dụng" }]} className="mb-6" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-primary-500" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-char-900 mb-4">
            Điều khoản sử dụng
          </h1>
          <p className="text-char-500">Cập nhật lần cuối: 01/12/2025</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-beige-200 p-6">
              <h2 className="text-xl font-semibold text-char-900 mb-4">
                {section.title}
              </h2>
              <div className="text-char-600 whitespace-pre-line leading-relaxed">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Acceptance */}
        <div className="mt-8 bg-beige-50 rounded-xl p-6 flex items-start gap-4">
          <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-char-900 mb-2">
              Xác nhận đồng ý
            </h3>
            <p className="text-char-600">
              Bằng việc sử dụng website và dịch vụ của HOMI Shop, bạn xác nhận
              đã đọc, hiểu và đồng ý với tất cả các điều khoản và điều kiện nêu
              trên.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
