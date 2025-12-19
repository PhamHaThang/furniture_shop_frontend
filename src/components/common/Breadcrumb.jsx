import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = ({ items = [], className = "" }) => {
  const location = useLocation();

  const breadcrumbItems =
    items.length > 0 ? items : generateBreadcrumbs(location.pathname);

  return (
    <nav
      className={`flex items-center text-sm ${className}`}
      aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1">
        <li>
          <Link
            to="/"
            className="text-char-500 hover:text-primary-500 transition-colors flex items-center">
            <Home size={16} />
          </Link>
        </li>
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight size={16} className="text-char-400 mx-1" />
            {index === breadcrumbItems.length - 1 || !item.path ? (
              <span className="text-char-900 font-medium">{item.label}</span>
            ) : (
              <Link
                to={item.path}
                className="text-char-500 hover:text-primary-500 transition-colors">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Helper function to generate breadcrumbs from pathname
const generateBreadcrumbs = (pathname) => {
  const pathnames = pathname.split("/").filter((x) => x);

  const pathLabels = {
    products: "Sản phẩm",
    categories: "Danh mục",
    brands: "Thương hiệu",
    cart: "Giỏ hàng",
    checkout: "Thanh toán",
    profile: "Tài khoản",
    orders: "Đơn hàng",
    addresses: "Địa chỉ",
    wishlist: "Yêu thích",
    admin: "Quản trị",
    dashboard: "Dashboard",
    users: "Người dùng",
    reviews: "Đánh giá",
    promotions: "Khuyến mãi",
  };

  return pathnames.map((name, index) => {
    const path = `/${pathnames.slice(0, index + 1).join("/")}`;
    const label = pathLabels[name] || decodeURIComponent(name);

    return {
      label,
      path: index < pathnames.length - 1 ? path : undefined,
    };
  });
};

export default Breadcrumb;
