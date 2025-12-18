import { Routes, Route } from "react-router-dom";
import { MainLayout, AdminLayout } from "./components/layout";
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
} from "./pages";
import { HomePage } from "./pages/Home";
import TestUI from "./TestUI";
import { OrderTrackingPage, TermsPage } from "./pages/Static";
const App = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute requireAdmin={true} />}>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
        </Route>
      </Route>
      <Route path="/" element={<MainLayout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
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

        <Route path="testUI" element={<TestUI />} />
        {/* Not found routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
