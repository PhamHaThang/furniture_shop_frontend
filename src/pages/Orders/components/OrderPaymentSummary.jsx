import { CreditCard } from "lucide-react";
import { formatPrice } from "../../../utils";

const OrderPaymentSummary = ({
  payment,
  subTotal,
  shippingFee,
  discount,
  totalAmount,
}) => {
  const getPaymentMethodLabel = (method) => {
    return method === "COD"
      ? "Thanh toán khi nhận hàng"
      : "Chuyển khoản ngân hàng";
  };

  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return {
          label: "Đã thanh toán",
          className: "bg-green-100 text-green-700",
        };
      case "pending":
        return {
          label: "Chờ thanh toán",
          className: "bg-yellow-100 text-yellow-700",
        };
      default:
        return {
          label: "Thanh toán thất bại",
          className: "bg-red-100 text-red-700",
        };
    }
  };

  const statusInfo = getPaymentStatusLabel(payment?.status);

  return (
    <div className="bg-white rounded-xl border border-beige-200 p-6">
      <h2 className="text-lg font-semibold text-char-900 mb-4 flex items-center">
        <CreditCard className="mr-2 text-primary-500" size={20} />
        Thanh toán
      </h2>
      <div className="flex items-center justify-between mb-4">
        <p className="text-char-600">
          {getPaymentMethodLabel(payment?.method)}
        </p>
        <span
          className={`px-2 py-1 text-xs rounded-full ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
      </div>

      <div className="space-y-2 pt-4 border-t border-beige-200">
        <div className="flex justify-between text-char-600">
          <span>Tạm tính</span>
          <span>{formatPrice(subTotal)}</span>
        </div>
        <div className="flex justify-between text-char-600">
          <span>Phí vận chuyển</span>
          <span>
            {shippingFee === 0 ? (
              <span className="text-green-500">Miễn phí</span>
            ) : (
              formatPrice(shippingFee || 0)
            )}
          </span>
        </div>
        {discount?.amount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Giảm giá {discount?.code && `(${discount.code})`}</span>
            <span>-{formatPrice(discount.amount)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-semibold text-char-900 pt-2 border-t border-beige-200">
          <span>Tổng cộng</span>
          <span className="text-primary-500">{formatPrice(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentSummary;
