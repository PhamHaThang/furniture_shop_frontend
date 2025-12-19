import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useAuth, useCart, useWishlist } from "../../contexts";
import { PLACEHOLDER_IMAGE } from "../../config";
import { formatPrice } from "../../utils";
import toast from "react-hot-toast";

const ProductCard = ({ product, horizontal = false }) => {
  const { isAuthenticated } = useAuth();
  const { addItem: addToCart } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlist();
  const inWishlist = isInWishlist(product._id);
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }

    addToCart({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images?.[0],
      quantity: 1,
    });
    toast.success("Đã thêm vào giỏ hàng");
  };
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm vào yêu thích");
      return;
    }

    if (inWishlist) {
      removeFromWishlist(product._id);
      toast.success("Đã xóa khỏi yêu thích");
    } else {
      addToWishlist({
        _id: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        images: product.images,
      });
      toast.success("Đã thêm vào yêu thích");
    }
  };
  // Horizontal/List View
  if (horizontal) {
    return (
      <Link
        to={`/products/${product.slug}`}
        className="group flex bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        {/* Image Container */}
        <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden bg-beige-100">
          <img
            src={product.images?.[0] || PLACEHOLDER_IMAGE}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Stock Badge */}
          {product.stock === 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              Hết hàng
            </div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded">
              Còn {product.stock}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            {/* Category & Brand */}
            <div className="flex items-center gap-2 text-xs text-char-500 mb-1">
              {product.category?.name && (
                <span className="truncate">{product.category.name}</span>
              )}
              {product.brand?.name && (
                <>
                  <span>•</span>
                  <span className="truncate">{product.brand.name}</span>
                </>
              )}
            </div>

            {/* Name */}
            <h3 className="font-medium text-char-900 mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors text-lg">
              {product.name}
            </h3>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-char-500 line-clamp-2 mb-2">
                {product.description}
              </p>
            )}

            {/* Rating */}
            {product.totalReviews > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium text-char-700">
                  {product.averageRating?.toFixed(1)}
                </span>
                <span className="text-sm text-char-500">
                  ({product.totalReviews} đánh giá)
                </span>
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between">
            {/* Price */}
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleWishlist}
                className={`p-2 rounded-full border transition-colors cursor-pointer ${
                  inWishlist
                    ? "bg-red-500 text-white border-red-500"
                    : "border-beige-300 text-char-600 hover:bg-primary-500 hover:text-white hover:border-primary-500"
                }`}>
                <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer">
                <ShoppingCart size={18} />
                {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-beige-100">
        <img
          src={product.images?.[0] || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full shadow-md transition-colors cursor-pointer ${
              inWishlist
                ? "bg-red-500 text-white"
                : "bg-white text-char-600 hover:bg-primary-500 hover:text-white"
            }`}>
            <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Add to Cart Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full py-2 bg-white text-char-900 font-medium rounded-lg hover:bg-primary-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer">
            <ShoppingCart size={18} />
            {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
          </button>
        </div>

        {/* Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
            Hết hàng
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded">
            Còn {product.stock}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category & Brand */}
        <div className="flex items-center gap-2 text-xs text-char-500 mb-1">
          {product.category?.name && (
            <span className="truncate">{product.category.name}</span>
          )}
          {product.brand?.name && (
            <>
              <span>•</span>
              <span className="truncate">{product.brand.name}</span>
            </>
          )}
        </div>

        {/* Name */}
        <h3 className="font-medium text-char-900 mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.totalReviews > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-char-700">
              {product.averageRating?.toFixed(1)}
            </span>
            <span className="text-sm text-char-500">
              ({product.totalReviews})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
