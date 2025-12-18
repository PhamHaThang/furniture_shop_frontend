import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui";
import { ROUTES } from "../../config";

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-200">404</h1>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-char-900 mb-4">
          Trang không tìm thấy
        </h2>
        <p className="text-char-500 mb-8 max-w-md mx-auto">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 items-center">
          <Link to={ROUTES.HOME}>
            <Button>
              <Home size={18} className="mr-2" />
              Về trang chủ
            </Button>
          </Link>
          <Link to={ROUTES.PRODUCTS}>
            <Button variant="outline">
              <Search size={18} className="mr-2" />
              Tìm sản phẩm
            </Button>
          </Link>
        </div>

        {/* Back Link */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 text-primary-500 hover:underline inline-flex items-center">
          <ArrowLeft size={16} className="mr-1" />
          Quay lại trang trước
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
