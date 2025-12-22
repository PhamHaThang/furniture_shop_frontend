import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
} from "lucide-react";
import { Button, Spinner, Input, ConfirmModal } from "../../components/ui";
import { Breadcrumb, EmptyState } from "../../components/common";
import { useAuth, useCart } from "../../contexts";
import { cartService } from "../../services";
import { PLACEHOLDER_IMAGE, ROUTES } from "../../config";
import { formatPrice } from "../../utils";
import toast from "react-hot-toast";
const CartPage = () => {
  const { isAuthenticated } = useAuth();
  const {
    items,
    totalItems,
    totalAmount,
    discount,
    updateQuantity,
    removeItem,
    clearCart,
    setDiscount,
    syncWithServer,
  } = useCart();
  const navigate = useNavigate();
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  // Sync cart with server if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      syncWithServer();
    }
  }, [isAuthenticated, syncWithServer]);
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    // Tìm sản phẩm trong giỏ hàng
    const item = items.find((i) => i._id === productId);

    // Kiểm tra số lượng tồn kho
    if (typeof item?.stock === "number" && newQuantity > item.stock) {
      toast.error(`Chỉ còn ${item.stock} sản phẩm trong kho`);
      return;
    }
    setLoadingItemId(productId);
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Cập nhật số lượng thất bại");
    } finally {
      setLoadingItemId(null);
    }
  };
  const handleRemoveItem = async (productId) => {
    setLoadingItemId(productId);
    try {
      await removeItem(productId);
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Xóa sản phẩm thất bại");
    } finally {
      setLoadingItemId(null);
    }
  };
  const handleClearCart = async () => {
    setLoading(true);
    try {
      await clearCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast.error("Xóa giỏ hàng thất bại");
    } finally {
      setLoading(false);
      setShowClearConfirm(false);
    }
  };
  const handleApplyPromo = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    if (!promoCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }
    setApplyingPromo(true);
    try {
      const response = await cartService.applyDiscount(promoCode.trim());
      setDiscount(response?.discount?.amount || 0);
      toast.success("Áp dụng mã giảm giá thành công");
    } catch (error) {
      toast.error(error.message || "Áp dụng mã giảm giá thất bại");
    } finally {
      setApplyingPromo(false);
    }
  };
  const handleRemovePromo = async () => {
    try {
      if (isAuthenticated) {
        await cartService.removeDiscount();
      }
      setDiscount(0);
      setPromoCode("");
      toast.success("Xóa mã giảm giá thành công");
    } catch {
      toast.error("Xóa mã giảm giá thất bại");
    }
  };
  const subtotal = totalAmount;
  const discountAmount = discount || 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Giỏ hàng" }]} className="mb-6" />
        <EmptyState
          icon={ShoppingBag}
          title="Giỏ hàng trống"
          description="Bạn chưa có sản phẩm nào trong giỏ hàng"
          action={
            <Link to={ROUTES.PRODUCTS}>
              <Button>
                Tiếp tục mua sắm
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Giỏ hàng" }]} className="mb-6" />

      <h1 className="text-2xl font-bold text-char-900 mb-8">
        Giỏ hàng ({totalItems} sản phẩm)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 py-3 px-4 bg-beige-100 rounded-lg text-sm font-medium text-char-700 font-bold">
            <div className="col-span-6">Sản phẩm</div>
            <div className="col-span-2 text-center">Giá</div>
            <div className="col-span-2 text-center">Số lượng</div>
            <div className="col-span-2 text-right">Tổng</div>
          </div>

          {/* Items */}
          {items.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 px-4 bg-white rounded-lg border border-beige-200">
              {/* Product Info */}
              <div className="md:col-span-6 flex gap-4">
                <Link
                  to={`${ROUTES.PRODUCTS}/${item.slug}`}
                  className="flex-shrink-0">
                  <img
                    src={item.image || PLACEHOLDER_IMAGE}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    to={`${ROUTES.PRODUCTS}/${item.slug}`}
                    className="font-medium text-char-900 hover:text-primary-500 line-clamp-2">
                    {item.name}
                  </Link>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-sm text-red-500 hover:text-red-600 mt-2 flex items-center cursor-pointer"
                    disabled={loadingItemId === item._id}>
                    <Trash2 size={14} className="mr-1" />
                    Xóa
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="md:col-span-2 flex md:justify-center items-center">
                <span className="md:hidden text-char-500 mr-2">Giá:</span>
                <span className="font-medium">{formatPrice(item.price)}</span>
              </div>

              {/* Quantity */}
              <div className="md:col-span-2 flex md:justify-center items-center">
                <span className="md:hidden text-char-500 mr-2">Số lượng:</span>
                <div className="flex items-center border border-beige-300 rounded-lg">
                  <button
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity - 1)
                    }
                    className="px-3 py-1  text-char-600 hover:text-char-800 disabled:opacity-50 cursor-pointer"
                    disabled={loadingItemId === item._id || item.quantity <= 1}>
                    <Minus size={14} />
                  </button>
                  <span className="px-3 py-1 min-w-[40px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item._id, item.quantity + 1)
                    }
                    className="px-3 py-1 text-char-600 hover:text-char-800 disabled:opacity-50 cursor-pointer"
                    disabled={
                      loadingItemId === item._id || item.quantity >= item.stock
                    }>
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="md:col-span-2 flex md:justify-end items-center">
                <span className="md:hidden text-char-500 mr-2">Tổng:</span>
                <span className="font-semibold text-primary-500">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-between pt-4">
            <Link to={ROUTES.PRODUCTS}>
              <Button variant="outline">Tiếp tục mua sắm</Button>
            </Link>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-600"
              onClick={() => setShowClearConfirm(true)}
              disabled={loading}>
              <Trash2 size={18} className="mr-2" />
              Xóa tất cả
            </Button>
          </div>

          <ConfirmModal
            isOpen={showClearConfirm}
            onClose={() => setShowClearConfirm(false)}
            onConfirm={handleClearCart}
            title="Xóa giỏ hàng"
            message="Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?"
            confirmText="Xóa tất cả"
            variant="danger"
            loading={loading}
          />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-beige-50 rounded-xl p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-char-900 mb-4">
              Tóm tắt đơn hàng
            </h2>

            {/* Promo Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-char-700 mb-2">
                Mã giảm giá
              </label>
              {discount > 0 ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center text-green-600">
                    <Tag size={18} className="mr-2" />
                    <span className="font-medium">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    className="text-red-500 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Nhập mã"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyPromo}
                    disabled={applyingPromo}
                    className="whitespace-nowrap">
                    {applyingPromo ? <Spinner size="sm" /> : "Áp dụng"}
                  </Button>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-3 border-t border-beige-200 pt-4">
              <div className="flex justify-between text-char-600">
                <span>Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-char-600">
                <span>Phí vận chuyển</span>
                <span>Tính khi thanh toán</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-char-900 pt-3 border-t border-beige-200">
                <span>Tổng cộng</span>
                <span className="text-primary-500">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link to={ROUTES.CHECKOUT} className="block mt-6">
              <Button className="w-full" size="lg">
                Tiến hành thanh toán
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
