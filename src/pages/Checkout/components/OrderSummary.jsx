import { Truck } from "lucide-react";
import { formatPrice } from "../../../utils";
import { PLACEHOLDER_IMAGE } from "../../../config";

const OrderSummary = ({
  items,
  subtotal,
  shippingFee,
  discountAmount,
  total,
}) => {
  return (
    <div className="bg-beige-50 rounded-xl p-6 sticky top-4">
      <h2 className="text-lg font-semibold text-char-900 mb-4">
        Đơn hàng của bạn
      </h2>

      {/* Items */}
      <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
        {items.map((item) => (
          <div key={item._id} className="flex gap-3">
            <img
              src={item.image || PLACEHOLDER_IMAGE}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="font-medium text-char-900 line-clamp-1">
                {item.name}
              </p>
              <p className="text-sm text-char-500">
                {formatPrice(item.price)} x {item.quantity}
              </p>
            </div>
            <p className="font-medium text-char-900">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="space-y-3 border-t border-beige-200 pt-4">
        <div className="flex justify-between text-char-600">
          <span>Tạm tính</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-char-600">
          <span className="flex items-center">
            <Truck size={16} className="mr-1" />
            Phí vận chuyển
          </span>
          <span>
            {shippingFee === 0 ? (
              <span className="text-green-500">Miễn phí</span>
            ) : (
              formatPrice(shippingFee)
            )}
          </span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Giảm giá</span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-semibold text-char-900 pt-3 border-t border-beige-200">
          <span>Tổng cộng</span>
          <span className="text-primary-500">{formatPrice(total)}</span>
        </div>
      </div>

      {shippingFee === 0 && (
        <p className="text-sm text-green-600 mt-4 text-center">
          Đơn hàng được miễn phí vận chuyển
        </p>
      )}
    </div>
  );
};

export default OrderSummary;
