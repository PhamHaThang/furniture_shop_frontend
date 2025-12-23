import { ArrowLeft, CreditCard, Check, CheckCircle } from "lucide-react";
import { Button, Textarea, Spinner } from "../../../components/ui";
import { formatPrice } from "../../../utils";

const PaymentSection = ({
  paymentMethod,
  paymentVerified,
  checkingPayment,
  notes,
  total,
  contentBank,
  onPaymentMethodChange,
  onCheckPayment,
  onNotesChange,
  onBack,
  onNext,
}) => {
  const paymentMethods = [
    { value: "COD", label: "Thanh toán khi nhận hàng" },
    { value: "BANK", label: "Chuyển khoản ngân hàng" },
  ];

  return (
    <div className="bg-white rounded-xl border border-beige-200 p-6">
      <h2 className="text-lg font-semibold text-char-900 mb-6 flex items-center">
        <CreditCard className="mr-2 text-primary-500" size={20} />
        Phương thức thanh toán
      </h2>

      <div className="space-y-4 mb-6">
        {paymentMethods.map((method) => (
          <div key={method.value}>
            <label
              className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                paymentMethod === method.value
                  ? "border-primary-500 bg-primary-50"
                  : "border-beige-200"
              }`}>
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                checked={paymentMethod === method.value}
                onChange={onPaymentMethodChange}
                className="mr-3"
              />
              <span className="font-medium">{method.label}</span>
              {method.value === "BANK" && paymentVerified && (
                <span className="ml-auto flex items-center text-green-600">
                  <CheckCircle size={18} className="mr-1" />
                  Đã xác nhận
                </span>
              )}
            </label>

            {/* Bank Transfer QR Code */}
            {method.value === "BANK" && paymentMethod === method.value && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-center text-sm text-char-600 mb-3">
                  Quét mã QR để chuyển khoản
                </p>
                <img
                  src={`https://img.vietqr.io/image/MBBANK-3850162111302-compact2.png?amount=${total}&addInfo=${contentBank}&accountName=PHAM%20HA%20THANG`}
                  alt="QR-Checkout"
                  className="w-100 h-100 object-contain mx-auto"
                />
                <p className="text-center text-sm text-char-500 mt-3">
                  Số tiền:{" "}
                  <span className="font-semibold text-primary-500">
                    {formatPrice(total)}
                  </span>
                </p>
                <p className="text-center text-sm text-char-500">
                  Nội dung chuyển khoản:{" "}
                  <span className="font-semibold text-primary-500">
                    {contentBank}
                  </span>
                </p>
                <div className="mt-4 flex justify-center">
                  {paymentVerified ? (
                    <div className="flex items-center text-green-600 font-medium">
                      <CheckCircle size={20} className="mr-2" />
                      Thanh toán đã được xác nhận
                    </div>
                  ) : (
                    <Button
                      onClick={onCheckPayment}
                      disabled={checkingPayment}
                      variant="outline"
                      className="border-primary-500 text-primary-500 hover:bg-primary-50">
                      {checkingPayment ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Đang kiểm tra...
                        </>
                      ) : (
                        <>
                          <Check size={18} className="mr-2" />
                          Xác nhận đã thanh toán
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="mb-6">
        <Textarea
          label="Ghi chú đơn hàng (tùy chọn)"
          name="notes"
          value={notes}
          onChange={onNotesChange}
          rows={3}
          placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2" size={18} />
          Quay lại
        </Button>
        <Button onClick={onNext}>Tiếp tục</Button>
      </div>
    </div>
  );
};

export default PaymentSection;
