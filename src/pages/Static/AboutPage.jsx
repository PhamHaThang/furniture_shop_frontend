import {
  Users,
  Award,
  Target,
  Heart,
  Truck,
  Shield,
  Clock,
  Star,
} from "lucide-react";
import { Breadcrumb } from "../../components/common";
import { FEATURE_HIGHLIGHTS } from "../../config";

const AboutPage = () => {
  const stats = [
    { value: "10+", label: "Năm kinh nghiệm" },
    { value: "50K+", label: "Khách hàng" },
    { value: "5000+", label: "Sản phẩm" },
    { value: "98%", label: "Hài lòng" },
  ];

  const values = [
    {
      icon: Award,
      title: "Chất lượng",
      description:
        "Cam kết cung cấp sản phẩm nội thất chất lượng cao từ các thương hiệu uy tín",
    },
    {
      icon: Heart,
      title: "Tận tâm",
      description:
        "Luôn lắng nghe và đặt sự hài lòng của khách hàng lên hàng đầu",
    },
    {
      icon: Target,
      title: "Sáng tạo",
      description:
        "Không ngừng cập nhật xu hướng và đem đến những thiết kế mới nhất",
    },
    {
      icon: Shield,
      title: "Uy tín",
      description: "Xây dựng niềm tin qua từng sản phẩm và dịch vụ chất lượng",
    },
  ];

  const team = [
    {
      name: "Nguyễn Đức Anh",
      role: "Founder & CEO",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      name: "Phạm Hà Thắng",
      role: "Design Director",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      name: "Văn Thiên Phúc",
      role: "Operations Manager",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Về chúng tôi" }]} className="mb-6" />

      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-char-900 mb-4">Về HOMI Shop</h1>
        <p className="text-char-500 max-w-3xl mx-auto text-lg">
          Chúng tôi là đơn vị tiên phong trong lĩnh vực cung cấp nội thất cao
          cấp, mang đến không gian sống hoàn hảo cho mọi gia đình Việt.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-beige-200 p-6 text-center">
            <p className="text-3xl font-bold text-primary-500 mb-1">
              {stat.value}
            </p>
            <p className="text-char-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold text-char-900 mb-6">
            Câu chuyện của chúng tôi
          </h2>
          <div className="space-y-4 text-char-600">
            <p>
              HOMI Shop được thành lập năm 2025 với sứ mệnh mang đến những sản
              phẩm nội thất chất lượng cao, thiết kế đẹp với giá cả hợp lý cho
              người Việt.
            </p>
            <p>
              Xuất phát từ niềm đam mê với không gian sống, chúng tôi hiểu rằng
              ngôi nhà không chỉ là nơi để ở, mà còn là nơi để thư giãn, là nơi
              gắn kết gia đình và là nơi thể hiện cá tính riêng.
            </p>
            <p>
              Sau hơn 10 năm phát triển, HOMI Shop tự hào là địa chỉ tin cậy của
              hàng chục nghìn khách hàng trên toàn quốc, với hệ thống cửa hàng
              tại các thành phố lớn và nền tảng mua sắm trực tuyến tiện lợi.
            </p>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600"
            alt="HOMI Shop showroom"
            className="rounded-2xl shadow-lg"
          />
          <div className="absolute -bottom-6 -left-6 bg-primary-500 text-white p-6 rounded-xl shadow-lg">
            <p className="text-3xl font-bold">10+</p>
            <p className="text-sm opacity-90">Năm kinh nghiệm</p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-char-900 mb-8 text-center">
          Giá trị cốt lõi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <value.icon className="text-primary-500" size={28} />
              </div>
              <h3 className="font-semibold text-char-900 mb-1">
                {value.title}
              </h3>
              <p className="text-sm text-char-500">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-char-900 mb-8 text-center">
          Tại sao chọn HOMI Shop?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURE_HIGHLIGHTS.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="text-primary-500" size={28} />
              </div>
              <h3 className="font-semibold text-char-900 mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-char-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-char-900 mb-8 text-center">
          Đội ngũ của chúng tôi
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold text-char-900">{member.name}</h3>
              <p className="text-char-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-12 text-white">
        <Users className="mx-auto mb-4" size={48} />
        <h2 className="text-3xl font-bold mb-4">Hãy để chúng tôi giúp bạn</h2>
        <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
          Tạo nên không gian sống hoàn hảo với những sản phẩm nội thất chất
          lượng từ HOMI Shop
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
  );
};

export default AboutPage;
