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
  // Static pages
  PROMOTIONS: "/promotions",
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
