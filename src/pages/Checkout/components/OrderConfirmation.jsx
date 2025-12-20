import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Package,
  CheckCircle,
} from "lucide-react";
import { Button, Spinner } from "../../../components/ui";
import { formatPrice } from "../../../utils";
import { PLACEHOLDER_IMAGE } from "../../../config";

const OrderConfirmation = ({
  shippingAddress,
  paymentMethod,
  paymentVerified,
  items,
  subtotal,
  shippingFee,
  discountAmount,
  total,
  loading,
  onBack,
  onConfirm,
  notes,
}) => {
  return (
    <div className="bg-white rounded-xl border border-beige-200 p-6">
      <h2 className="text-lg font-semibold text-char-900 mb-6 flex items-center">
        <CheckCircle className="mr-2 text-primary-500" size={20} />
        Xác nhận thông tin đặt hàng
      </h2>

      {/* Shipping Address */}
      <div className="mb-6 p-4 bg-beige-50 rounded-lg">
        <h3 className="font-semibold text-char-900 mb-3 flex items-center">
          <MapPin className="mr-2 text-primary-500" size={18} />
          Địa chỉ giao hàng
        </h3>
        <div className="text-char-700 space-y-1">
          <p className="font-medium">{shippingAddress.fullName}</p>
          <p>{shippingAddress.phone}</p>
          <p>{shippingAddress.email}</p>
          <p className="text-char-600">
            {shippingAddress.address}, {shippingAddress.ward},{" "}
            {shippingAddress.district}, {shippingAddress.province}
          </p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6 p-4 bg-beige-50 rounded-lg">
        <h3 className="font-semibold text-char-900 mb-3 flex items-center">
          <CreditCard className="mr-2 text-primary-500" size={18} />
          Phương thức thanh toán
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-char-700">
            {paymentMethod === "COD"
              ? "Thanh toán khi nhận hàng (COD)"
              : "Chuyển khoản ngân hàng"}
          </p>
          {paymentMethod === "BANK" && paymentVerified && (
            <span className="flex items-center text-green-600 text-sm">
              <CheckCircle size={16} className="mr-1" />
              Đã xác nhận
            </span>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-6 p-4 bg-beige-50 rounded-lg">
        <h3 className="font-semibold text-char-900 mb-3 flex items-center">
          <Package className="mr-2 text-primary-500" size={18} />
          Sản phẩm đã đặt
        </h3>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex gap-3 pb-3 border-b border-beige-200 last:border-0">
              <img
                src={item.image || PLACEHOLDER_IMAGE}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium text-char-900 line-clamp-2">
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
      </div>

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-primary-50 rounded-lg">
        <h3 className="font-semibold text-char-900 mb-3">Tổng thanh toán</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-char-600">
            <span>Tạm tính</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-char-600">
            <span>Phí vận chuyển</span>
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
          <div className="flex justify-between text-lg font-bold text-char-900 pt-3 border-t border-primary-200">
            <span>Tổng cộng</span>
            <span className="text-primary-500">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
      {/* Notes */}
      <div className="mb-6 p-4 bg-beige-50 rounded-lg">
        <h3 className="font-semibold text-char-900 mb-3">Ghi chú đơn hàng</h3>
        <p className="text-char-700">{notes || "Không có ghi chú"}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2" size={18} />
          Quay lại
        </Button>
        <Button onClick={onConfirm} disabled={loading} size="lg">
          {loading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Đang xử lý...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2" size={18} />
              Xác nhận đặt hàng
            </>
          )}
        </Button>
      </div>

      {/* Note */}
      <p className="text-sm text-char-500 text-center mt-4">
        Bằng việc nhấn "Xác nhận đặt hàng", bạn đồng ý với{" "}
        <span className="text-primary-500 cursor-pointer hover:underline">
          điều khoản dịch vụ
        </span>{" "}
        của chúng tôi.
      </p>
    </div>
  );
};

export default OrderConfirmation;
