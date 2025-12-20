import { Routes, Route } from "react-router-dom";
import { MainLayout, AdminLayout, AuthLayout } from "./components/layout";
import { ProtectedRoute } from "./components/common";
import {
  AboutPage,
  AdminDashboardPage,
  ContactPage,
  FAQPage,
  GuidePage,
  NotFoundPage,
  PrivacyPage,
  ReturnPolicyPage,
  HomePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ProductsPage,
  ProductDetailPage,
  OrderTrackingPage,
  TermsPage,
  WishlistPage,
  BrandsPage,
  CategoriesPage,
  PromotionPage,
  CartPage,
  ProfilePage,
  OrderDetailPage,
  OrdersPage,
  CheckoutPage,
  AdminUsersPage,
  AdminProductsPage,
  AdminCategoriesPage,
  AdminBrandsPage,
  AdminOrdersPage,
  AdminOrderDetailPage,
  AdminReviewsPage,
  AdminPromotionsPage,
} from "./pages";
import TestUI from "./TestUI";
const App = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute requireAdmin={true} />}>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="promotions" element={<AdminPromotionsPage />} />
        </Route>
      </Route>
      <Route path="/" element={<MainLayout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="categories/:slug" element={<ProductsPage />} />
        <Route path="brands" element={<BrandsPage />} />
        <Route path="brands/:slug" element={<ProductsPage />} />
        <Route path="promotions" element={<PromotionPage />} />

        {/* Static routes */}
        <Route path="order-tracking" element={<OrderTrackingPage />} />
        <Route path="guide" element={<GuidePage />} />
        <Route path="return-policy" element={<ReturnPolicyPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>
        <Route path="testUI" element={<TestUI />} />
        {/* Not found routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
