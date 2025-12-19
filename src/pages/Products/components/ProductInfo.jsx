import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Star,
  Box,
  Scan,
  Smartphone,
} from "lucide-react";
import { Button } from "../../../components/ui";
import { ROUTES } from "../../../config";
import { formatPrice } from "../../../utils";

const ProductInfo = ({
  product,
  quantity,
  setQuantity,
  isInWishlist,
  onAddToCart,
  onAddToWishlist,
  onShow3D,
  onShowAR,
  reviewCount,
}) => {
  const avgRating = product.averageRating || 0;

  return (
    <div className="space-y-6">
      {/* Brand */}
      {product.brand && (
        <Link
          to={`${ROUTES.BRANDS}/${product.brand.slug}`}
          className="text-primary-500 font-medium hover:underline">
          {product.brand.name}
        </Link>
      )}

      {/* Name */}
      <h1 className="text-3xl font-bold text-char-900">{product.name}</h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={20}
              className={
                star <= avgRating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-char-300"
              }
            />
          ))}
        </div>
        <span className="text-char-600">({reviewCount} đánh giá)</span>
      </div>

      {/* Price */}
      <div className="text-3xl font-bold text-primary-500">
        {formatPrice(product.price)}
      </div>

      {/* Short Description */}
      {product.description && (
        <p className="text-char-600">
          {product.description.length > 100
            ? product.description.slice(0, 100) + "..."
            : product.description}
        </p>
      )}

      {/* Quantity */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <span className="font-medium text-char-700">Số lượng:</span>
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center border border-beige-300 rounded-lg">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 sm:px-4 py-2 text-char-600 hover:bg-beige-100"
              disabled={quantity <= 1}>
              <Minus size={18} />
            </button>
            <span className="px-3 sm:px-4 py-2 min-w-[60px] text-center font-medium">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="px-3 sm:px-4 py-2 text-char-600 hover:bg-beige-100"
              disabled={quantity >= product.stock}>
              <Plus size={18} />
            </button>
          </div>
          <span className="text-sm sm:text-base text-char-500">
            {product.stock > 0 ? `${product.stock} có sẵn` : "Hết hàng"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="flex-1 w-full sm:w-auto"
          onClick={onAddToCart}
          disabled={product.stock < 1}>
          <ShoppingCart className="mr-2" size={20} />
          <span className="hidden sm:inline">Thêm vào giỏ</span>
          <span className="sm:hidden">Thêm giỏ hàng</span>
        </Button>
        <div className="flex gap-3">
          <Button
            variant={isInWishlist ? "primary" : "outline"}
            size="lg"
            className="flex-1 sm:flex-none"
            onClick={onAddToWishlist}>
            <Heart size={20} className={isInWishlist ? "fill-white" : ""} />
          </Button>
          {product.model3DUrl && (
            <>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 sm:flex-none"
                onClick={onShow3D}
                title="Xem mô hình 3D">
                <span className="text-lg font-semibold">3D</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 sm:flex-none"
                onClick={onShowAR}
                title="Trải nghiệm AR">
                <span className="text-lg font-semibold">AR</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* AR Notice */}
      {product.model3DUrl && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 border border-purple-200">
          <div className="flex items-start gap-2 sm:gap-3">
            <Smartphone className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm sm:text-base text-purple-900 mb-1">
                Trải nghiệm AR - Đặt sản phẩm vào không gian thực
              </h4>
              <p className="text-xs sm:text-sm text-purple-700">
                Sử dụng điện thoại để xem sản phẩm này trong không gian sống của
                bạn. Hỗ trợ iOS (AR Quick Look) và Android (Scene Viewer).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-beige-200">
        <div className="text-center">
          <Truck className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-primary-500 mb-1 sm:mb-2" />
          <p className="text-xs sm:text-sm text-char-600">
            <span className="hidden sm:inline">
              Miễn phí vận chuyển từ 5 triệu
            </span>
            <span className="sm:hidden">Ship từ 5tr</span>
          </p>
        </div>
        <div className="text-center">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-primary-500 mb-1 sm:mb-2" />
          <p className="text-xs sm:text-sm text-char-600">
            <span className="hidden sm:inline">Bảo hành 12 tháng</span>
            <span className="sm:hidden">BH 12 tháng</span>
          </p>
        </div>
        <div className="text-center">
          <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-primary-500 mb-1 sm:mb-2" />
          <p className="text-xs sm:text-sm text-char-600">
            <span className="hidden sm:inline">Đổi trả 30 ngày</span>
            <span className="sm:hidden">Đổi 30 ngày</span>
          </p>
        </div>
      </div>

      {/* SKU & Category */}
      <div className="space-y-2 text-sm text-char-600">
        {product.sku && (
          <p>
            <span className="font-medium">SKU:</span> {product.sku}
          </p>
        )}
        {product.category && (
          <p>
            <span className="font-medium">Danh mục:</span>{" "}
            <Link
              to={`${ROUTES.CATEGORIES}/${product.category.slug}`}
              className="text-primary-500 hover:underline">
              {product.category.name}
            </Link>
          </p>
        )}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="font-medium">Màu sắc:</span>
            <div className="flex flex-wrap gap-1">
              {product.colors.map((color, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs">
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}
        {product.materials && product.materials.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="font-medium">Chất liệu:</span>
            <div className="flex flex-wrap gap-1">
              {product.materials.map((material, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                  {material}
                </span>
              ))}
            </div>
          </div>
        )}
        {product.tags && product.tags.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="font-medium">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
