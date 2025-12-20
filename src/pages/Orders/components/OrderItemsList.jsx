import { Link } from "react-router-dom";
import { Package, Star, CheckCircle } from "lucide-react";
import { PLACEHOLDER_IMAGE, ROUTES } from "../../../config";
import { formatPrice } from "../../../utils";

const OrderItemsList = ({ items, canReview, reviewedProducts, onReview }) => {
  return (
    <div className="bg-white rounded-xl border border-beige-200 p-6">
      <h2 className="text-lg font-semibold text-char-900 mb-4 flex items-center">
        <Package className="mr-2 text-primary-500" size={20} />
        Sản phẩm đã đặt
      </h2>

      <div className="space-y-4">
        {items?.map((item, index) => (
          <div
            key={index}
            className="flex gap-4 py-4 border-b border-beige-100 last:border-0">
            <Link to={`${ROUTES.PRODUCTS}/${item.product?.slug || "#"}`}>
              <img
                src={
                  item.image || item.product?.images?.[0] || PLACEHOLDER_IMAGE
                }
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
            </Link>
            <div className="flex-1">
              <Link
                to={`${ROUTES.PRODUCTS}/${item.product?.slug || "#"}`}
                className="font-medium text-char-900 hover:text-primary-500">
                {item.name || item.product?.name || "Sản phẩm không tồn tại"}
              </Link>
              <p className="text-sm text-char-500 mt-1">
                {formatPrice(item.price)} x {item.quantity}
              </p>
              {canReview &&
                !reviewedProducts.has(item.product?._id || item.product) && (
                  <button
                    onClick={() => onReview(item)}
                    className="mt-2 text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1 cursor-pointer">
                    <Star size={14} />
                    Đánh giá sản phẩm
                  </button>
                )}
              {reviewedProducts.has(item.product?._id || item.product) && (
                <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle size={14} />
                  Đã đánh giá
                </p>
              )}
            </div>
            <p className="font-semibold text-char-900">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItemsList;
