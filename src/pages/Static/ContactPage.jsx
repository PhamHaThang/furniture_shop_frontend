import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { Breadcrumb } from "../../components/common";
import { Button, Input, Select, Spinner, Textarea } from "../../components/ui";
import toast from "react-hot-toast";
import { CONTACT_INFO, STORE_LOCATIONS } from "../../config";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setLoading(false);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Liên hệ" }]} className="mb-6" />

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-char-900 mb-4">
          Liên hệ với chúng tôi
        </h1>
        <p className="text-char-500 max-w-2xl mx-auto">
          Bạn có câu hỏi hoặc cần hỗ trợ? Đừng ngần ngại liên hệ với đội ngũ
          HOMI Shop. Chúng tôi luôn sẵn sàng giúp đỡ bạn!
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {CONTACT_INFO.map((info, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-beige-200 p-5 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <info.icon className="text-primary-500" size={24} />
            </div>
            <h3 className="font-semibold text-char-900 mb-1">{info.title}</h3>
            {info.link ? (
              <a
                href={info.link}
                target={info.link.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-char-600 hover:text-primary-500">
                {info.content}
              </a>
            ) : (
              <p className="text-char-600">{info.content}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Contact Form */}
        <div className="bg-white rounded-xl border border-beige-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="text-primary-500" size={24} />
            <h2 className="text-xl font-semibold text-char-900">
              Gửi tin nhắn cho chúng tôi
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Họ và tên *"
                placeholder="Nhập họ tên"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email *"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Nhập email"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Số điện thoại"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
              <Select
                label="Chủ đề"
                placeholder="Chọn chủ đề"
                options={[
                  { value: "order", label: "Đơn hàng" },
                  { value: "product", label: "Sản phẩm" },
                  { value: "return", label: "Đổi trả" },
                  { value: "other", label: "Khác" },
                ]}
                name="subject"
                onChange={handleChange}
                value={formData.subject}
              />
            </div>

            <Textarea
              label="Nội dung *"
              placeholder="Nhập nội dung tin nhắn..."
              rows={5}
              required
              value={formData.message}
              name="message"
              onChange={handleChange}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Gửi tin nhắn
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Map */}
        <div className="bg-white rounded-xl border border-beige-200 overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.292401303917!2d105.7848415766531!3d20.980912980656502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accdd8a1ad71%3A0xa2f9b16036648187!2zSOG7jWMgdmnhu4duIEPDtG5nIG5naOG7hyBCxrB1IGNow61uaCB2aeG7hW4gdGjDtG5n!5e0!3m2!1svi!2s!4v1766046795579!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "400px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="HOMI Shop location"
          />
        </div>
      </div>

      {/* Store Locations */}
      <div>
        <h2 className="text-2xl font-bold text-char-900 mb-6 text-center">
          Hệ thống cửa hàng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STORE_LOCATIONS.map((store, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-beige-200 p-6">
              <h3 className="font-semibold text-char-900 mb-3">{store.name}</h3>
              <div className="space-y-2 text-sm text-char-600">
                <p className="flex items-start gap-2">
                  <MapPin
                    size={16}
                    className="mt-0.5 flex-shrink-0 text-primary-500"
                  />
                  {store.address}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="flex-shrink-0 text-primary-500" />
                  {store.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={16} className="flex-shrink-0 text-primary-500" />
                  {store.hours}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
