import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { FOOTER_LINKS, ROUTES, SOCIAL_MEDIA_LINKS } from "../../config";
import logo from "../../assets/logo1.png";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-char-900 text-beige-100">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Contact */}
          <div className="lg:col-span-1">
            <Link to={ROUTES.HOME} className="inline-block mb-4">
              <img src={logo} alt="Logo" className="h-10 object-contain" />
            </Link>
            <p className="text-beige-300 mb-6">
              Cửa hàng nội thất cao cấp với hàng ngàn sản phẩm chất lượng cho
              ngôi nhà của bạn.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-beige-300">
                <Phone size={18} className="text-primary-400" />
                <span>1900 1836</span>
              </div>
              <div className="flex items-center gap-3 text-beige-300">
                <Mail size={18} className="text-primary-400" />
                <span>support@homishop.com</span>
              </div>
              <div className="flex items-start gap-3 text-beige-300">
                <MapPin size={18} className="text-primary-400 mt-1" />
                <span>Km10, Nguyễn Trãi, P. Hà Đông, Hà Nội</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Mua sắm</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-beige-300 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Hỗ trợ</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-beige-300 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Công ty</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-beige-300 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4 mt-8 pt-8 border-t border-char-700">
          <span className="text-beige-300">Theo dõi chúng tôi:</span>
          {SOCIAL_MEDIA_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-beige-300 hover:text-primary-400 hover:bg-char-800 rounded-lg transition-colors"
              aria-label={social.label}>
              <social.icon size={20} />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-char-950 py-4">
        <div className="container mx-auto px-4 text-center text-beige-400 text-sm">
          <p>© {currentYear} HOMI Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
