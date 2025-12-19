import {
  Building2,
  Clock,
  Facebook,
  FolderTree,
  HeadphonesIcon,
  Instagram,
  LayoutDashboard,
  Mail,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  Shield,
  ShoppingCart,
  Star,
  Ticket,
  Truck,
  Twitter,
  Users,
  Youtube,
} from "lucide-react";

// API Configuration
export const API_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

export const CHECK_PAYMENT_URL =
  import.meta.env.VITE_CHECK_PAYMENT_URL_API || "";

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [12, 24, 36, 48];
export const PAGINATION_LIMITS = {
  PRODUCTS: 12,
  ORDERS: 10,
  ADMIN_PRODUCTS: 10,
  ADMIN_ORDERS: 10,
  ADMIN_USERS: 10,
  ADMIN_REVIEWS: 10,
  ADMIN_PROMOTIONS: 10,
};

// Shipping Fee
export const SHIPPING_FEE = 30000; // VND

// Order Status
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const ORDER_STATUS_LABELS = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipped: "Đang giao hàng",
  delivered: "Đã giao hàng",
  cancelled: "Đã hủy",
};

export const ORDER_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
};
export const PAYMENT_STATUS_LABELS = {
  pending: "Chờ thanh toán",
  completed: "Đã thanh toán",
  failed: "Thanh toán thất bại",
};
// Payment Methods
export const PAYMENT_METHODS = {
  COD: "COD",
  BANK: "BANK",
};

export const PAYMENT_METHOD_LABELS = {
  COD: "Thanh toán khi nhận hàng",
  BANK: "Chuyển khoản ngân hàng",
};

// Toast Duration
export const TOAST_DURATION = 3000;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  USER: "user",
  CART: "cart",
  WISHLIST: "wishlist",
};

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/:slug",
  CATEGORIES: "/categories",
  CATEGORY_DETAIL: "/categories/:slug",
  BRANDS: "/brands",
  BRAND_DETAIL: "/brands/:slug",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_SUCCESS: "/order-success",
  ORDER_TRACKING: "/order-tracking",
  WISHLIST: "/wishlist",
  PROFILE: "/profile",
  ORDERS: "/orders",
  ORDER_DETAIL: "/orders/:id",
  PROMOTIONS: "/promotions",
  // Static pages
  GUIDE: "/guide",
  RETURN_POLICY: "/return-policy",
  FAQ: "/faq",
  ABOUT: "/about",
  CONTACT: "/contact",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  // Admin routes
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_BRANDS: "/admin/brands",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_USERS: "/admin/users",
  ADMIN_REVIEWS: "/admin/reviews",
  ADMIN_PROMOTIONS: "/admin/promotions",
};

// Image Placeholder
export const PLACEHOLDER_IMAGE = "https://placehold.co/600x400?text=Image";
export const PLACEHOLDER_AVATAR = "https://placehold.co/400x400?text=Avatar";
export const PLACEHOLDER_PRODUCT = "https://placehold.co/600x400?text=Product";

// Social Media Links
export const SOCIAL_MEDIA_LINKS = [
  { icon: Facebook, href: "https://www.facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://x.com", label: "Twitter" },
  { icon: Youtube, href: "https://www.youtube.com/", label: "Youtube" },
];
// Header Nav Links
export const HEADER_NAV_LINKS = [
  { label: "Trang chủ", path: ROUTES.HOME },
  { label: "Sản phẩm", path: ROUTES.PRODUCTS },
  { label: "Danh mục", path: ROUTES.CATEGORIES },
  { label: "Thương hiệu", path: ROUTES.BRANDS },
  { label: "Khuyến mãi", path: ROUTES.PROMOTIONS },
];
// Footer Links
export const FOOTER_LINKS = {
  shop: [
    { label: "Sản phẩm", path: ROUTES.PRODUCTS },
    { label: "Danh mục", path: ROUTES.CATEGORIES },
    { label: "Thương hiệu", path: ROUTES.BRANDS },
    { label: "Khuyến mãi", path: ROUTES.PROMOTIONS },
  ],
  support: [
    { label: "Tra cứu đơn hàng", path: ROUTES.ORDER_TRACKING },
    { label: "Hướng dẫn mua hàng", path: ROUTES.GUIDE },
    { label: "Chính sách đổi trả", path: ROUTES.RETURN_POLICY },
    { label: "FAQ", path: ROUTES.FAQ },
  ],
  company: [
    { label: "Về chúng tôi", path: ROUTES.ABOUT },
    { label: "Liên hệ", path: ROUTES.CONTACT },
    { label: "Điều khoản sử dụng", path: ROUTES.TERMS },
    { label: "Chính sách bảo mật", path: ROUTES.PRIVACY },
  ],
};
// Sidebar Admin Links
export const ADMIN_SIDEBAR_LINKS = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { path: "/admin/users", icon: Users, label: "Người dùng" },
  { path: "/admin/products", icon: Package, label: "Sản phẩm" },
  { path: "/admin/categories", icon: FolderTree, label: "Danh mục" },
  { path: "/admin/brands", icon: Building2, label: "Thương hiệu" },
  { path: "/admin/orders", icon: ShoppingCart, label: "Đơn hàng" },
  { path: "/admin/reviews", icon: Star, label: "Đánh giá" },
  { path: "/admin/promotions", icon: Ticket, label: "Khuyến mãi" },
];
// Contact Information
export const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Địa chỉ",
    content: "Km10, Nguyễn Trãi, P. Hà Đông, Hà Nội",
    link: "https://maps.google.com",
  },
  {
    icon: Phone,
    title: "Hotline",
    content: "1900 1836",
    link: "tel:19001836",
  },
  {
    icon: Mail,
    title: "Email",
    content: "support@homishop.com",
    link: "mailto:support@homishop.com",
  },
  {
    icon: Clock,
    title: "Giờ làm việc",
    content: "8:00 - 21:00 (Thứ 2 - CN)",
    link: null,
  },
];
// Store Locations
export const STORE_LOCATIONS = [
  {
    name: "HOMI Shop - Hà Nội",
    address: "Km10, Nguyễn Trãi, P. Hà Đông, Hà Nội",
    phone: "024 1234 5678",
    hours: "8:00 - 21:00",
  },
  {
    name: "HOMI Shop - Quận 1",
    address: "123 Đường ABC, Phường Bến Nghé, Quận 1, TP.HCM",
    phone: "028 1234 5678",
    hours: "8:00 - 21:00",
  },
  {
    name: "HOMI Shop - Quận 7",
    address: "456 Đường XYZ, Phường Tân Phong, Quận 7, TP.HCM",
    phone: "028 8765 4321",
    hours: "8:00 - 21:00",
  },
];
// Feature Highlights
export const FEATURE_HIGHLIGHTS = [
  {
    icon: Truck,
    title: "Miễn phí vận chuyển",
    desc: "Đơn hàng từ 5 triệu",
  },
  {
    icon: Shield,
    title: "Bảo hành 12 tháng",
    desc: "Chính sách bảo hành",
  },
  {
    icon: HeadphonesIcon,
    title: "Hỗ trợ 24/7",
    desc: "Tư vấn miễn phí",
  },
  {
    icon: RotateCcw,
    title: "Đổi trả 30 ngày",
    desc: "Hoàn tiền 100%",
  },
];
// SORT OPTIONS
export const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
  { value: "name-asc", label: "Tên A-Z" },
  { value: "name-desc", label: "Tên Z-A" },
  { value: "best-seller", label: "Bán chạy" },
];
