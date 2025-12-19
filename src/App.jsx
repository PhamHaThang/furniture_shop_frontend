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
        </Route>
      </Route>
      <Route path="/" element={<MainLayout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />
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
          <Route path="wishlist" element={<WishlistPage />} />
        </Route>
        <Route path="testUI" element={<TestUI />} />
        {/* Not found routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
