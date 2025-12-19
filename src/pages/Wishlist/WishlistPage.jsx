import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import {
  Button,
  ConfirmModal,
  LoadingScreen,
  ProductCard,
} from "../../components/ui";
import { Breadcrumb, EmptyState } from "../../components/common";
import { useAuth, useWishlist } from "../../contexts";
import { ROUTES } from "../../config";
import toast from "react-hot-toast";

const WishlistPage = () => {
  const { isAuthenticated } = useAuth();
  const { items, loading, clearWishlist, syncWithServer } = useWishlist();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      syncWithServer();
    }
  }, [isAuthenticated, syncWithServer]);

  const handleClearAll = () => {
    try {
      clearWishlist();
      toast.success("Đã xóa tất cả");
    } catch {
      toast.error("Không thể xóa danh sách yêu thích");
    }
    setShowClearConfirm(false);
  };
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Sản phẩm yêu thích" }]} className="mb-6" />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-char-900">
          Sản phẩm yêu thích ({items.length})
        </h1>
        {items.length > 0 && (
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-600"
            onClick={() => setShowClearConfirm(true)}>
            <Trash2 size={18} className="mr-2" />
            Xóa tất cả
          </Button>
        )}
      </div>

      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearAll}
        title="Xóa tất cả yêu thích"
        message="Bạn có chắc muốn xóa tất cả sản phẩm yêu thích?"
        confirmText="Xóa tất cả"
        variant="danger"
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Chưa có sản phẩm yêu thích"
          description="Hãy khám phá và thêm sản phẩm yêu thích của bạn"
          action={
            <Link to={ROUTES.PRODUCTS}>
              <Button>Khám phá sản phẩm</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
