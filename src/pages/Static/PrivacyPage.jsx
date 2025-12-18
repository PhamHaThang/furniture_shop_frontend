import { Shield, Eye, Lock, Database, UserCheck, Mail } from "lucide-react";
import { Breadcrumb } from "../../components/common";

const PrivacyPage = () => {
  const sections = [
    {
      icon: Database,
      title: "Thông tin chúng tôi thu thập",
      content: `HOMI Shop thu thập các loại thông tin sau:

**Thông tin cá nhân:**
• Họ tên, địa chỉ email, số điện thoại
• Địa chỉ giao hàng
• Thông tin thanh toán (không bao gồm số thẻ ngân hàng)

**Thông tin tự động:**
• Địa chỉ IP, loại trình duyệt, thiết bị sử dụng
• Thông tin về cách bạn tương tác với website
• Cookies và các công nghệ theo dõi tương tự`,
    },
    {
      icon: Eye,
      title: "Cách chúng tôi sử dụng thông tin",
      content: `Chúng tôi sử dụng thông tin thu thập được để:

• Xử lý và giao đơn hàng
• Liên lạc về đơn hàng, khuyến mãi và dịch vụ
• Cải thiện trải nghiệm người dùng trên website
• Phân tích xu hướng mua sắm để cải tiến sản phẩm
• Ngăn chặn gian lận và bảo vệ an toàn
• Tuân thủ các nghĩa vụ pháp lý`,
    },
    {
      icon: UserCheck,
      title: "Chia sẻ thông tin",
      content: `HOMI Shop có thể chia sẻ thông tin của bạn với:

• **Đối tác vận chuyển:** Để giao hàng đến địa chỉ của bạn
• **Đối tác thanh toán:** Để xử lý giao dịch an toàn
• **Nhà cung cấp dịch vụ:** Hỗ trợ email marketing, phân tích dữ liệu
• **Cơ quan pháp luật:** Khi có yêu cầu theo quy định

Chúng tôi KHÔNG bán thông tin cá nhân của bạn cho bên thứ ba vì mục đích thương mại.`,
    },
    {
      icon: Lock,
      title: "Bảo mật thông tin",
      content: `Chúng tôi áp dụng các biện pháp bảo mật để bảo vệ thông tin của bạn:

• Mã hóa SSL/TLS cho tất cả giao dịch
• Hệ thống firewall và phần mềm chống virus
• Hạn chế quyền truy cập vào dữ liệu cá nhân
• Đào tạo nhân viên về bảo mật thông tin
• Kiểm tra và cập nhật hệ thống định kỳ

Mặc dù vậy, không có phương thức truyền dữ liệu nào trên internet là an toàn 100%. Chúng tôi không thể đảm bảo an ninh tuyệt đối cho thông tin của bạn.`,
    },
    {
      icon: Shield,
      title: "Quyền của bạn",
      content: `Bạn có các quyền sau đây đối với thông tin cá nhân:
        • Quyền truy cập: Yêu cầu xem thông tin chúng tôi lưu trữ về bạn
        • Quyền chỉnh sửa: Cập nhật thông tin không chính xác
        • Quyền xóa: Yêu cầu xóa thông tin cá nhân (có điều kiện)
        • Quyền từ chối: Từ chối nhận email marketing
        • Quyền khiếu nại: Liên hệ cơ quan bảo vệ dữ liệu nếu cần
        Để thực hiện các quyền này, vui lòng liên hệ support@homishop.com`,
    },
    {
      icon: Mail,
      title: "Cookies và theo dõi",
      content: `Website sử dụng cookies và công nghệ tương tự để:

• Ghi nhớ đăng nhập và giỏ hàng của bạn
• Phân tích lưu lượng truy cập website
• Cá nhân hóa nội dung và quảng cáo
• Cải thiện trải nghiệm người dùng

**Loại cookies chúng tôi sử dụng:**
• Cookies thiết yếu (cần thiết cho hoạt động website)
• Cookies phân tích (Google Analytics)
• Cookies quảng cáo (để hiển thị quảng cáo phù hợp)

Bạn có thể tắt cookies trong cài đặt trình duyệt, nhưng điều này có thể ảnh hưởng đến một số tính năng của website.`,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Chính sách bảo mật" }]} className="mb-6" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-primary-500" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-char-900 mb-4">
            Chính sách bảo mật
          </h1>
          <p className="text-char-500 max-w-2xl mx-auto">
            HOMI Shop cam kết bảo vệ quyền riêng tư và thông tin cá nhân của
            bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và
            bảo vệ thông tin của bạn.
          </p>
          <p className="text-sm text-char-400 mt-2">
            Cập nhật lần cuối: 01/12/2025
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-beige-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <section.icon className="text-primary-500" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-char-900">
                  {section.title}
                </h2>
              </div>
              <div className="text-char-600 whitespace-pre-line leading-relaxed prose prose-sm max-w-none">
                {section.content.split("\n").map((line, i) => {
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return (
                      <p key={i} className="font-semibold text-char-800 mt-3">
                        {line.replace(/\*\*/g, "")}
                      </p>
                    );
                  }
                  if (line.startsWith("•")) {
                    return (
                      <p key={i} className="ml-4">
                        {line}
                      </p>
                    );
                  }
                  return <p key={i}>{line}</p>;
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Children's Privacy */}
        <div className="mt-6 bg-yellow-50 rounded-xl border border-yellow-200 p-6">
          <h3 className="font-semibold text-char-900 mb-2">
            Quyền riêng tư của trẻ em
          </h3>
          <p className="text-char-600">
            Website của chúng tôi không dành cho người dưới 16 tuổi. Chúng tôi
            không cố ý thu thập thông tin từ trẻ em. Nếu bạn là phụ huynh và
            phát hiện con bạn đã cung cấp thông tin cho chúng tôi, vui lòng liên
            hệ để chúng tôi xóa thông tin đó.
          </p>
        </div>

        {/* Updates */}
        <div className="mt-6 bg-beige-50 rounded-xl p-6">
          <h3 className="font-semibold text-char-900 mb-2">
            Thay đổi chính sách
          </h3>
          <p className="text-char-600 mb-4">
            Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Mọi
            thay đổi sẽ được đăng tải trên trang này với ngày cập nhật mới.
            Chúng tôi khuyến khích bạn kiểm tra định kỳ để nắm bắt các thay đổi.
          </p>
        </div>

        {/* Contact */}
        <div className="mt-6 text-center bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Có câu hỏi về bảo mật?</h2>
          <p className="mb-4 opacity-90">
            Liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào về chính sách
            bảo mật
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:privacy@homishop.com"
              className="bg-white/20 rounded-lg px-6 py-3 hover:bg-white/30 transition-colors">
              <p className="text-sm opacity-80">Email</p>
              <p className="font-bold">privacy@homishop.com</p>
            </a>
            <a
              href="tel:19001836"
              className="bg-white/20 rounded-lg px-6 py-3 hover:bg-white/30 transition-colors">
              <p className="text-sm opacity-80">Hotline</p>
              <p className="font-bold">1900 1836</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
