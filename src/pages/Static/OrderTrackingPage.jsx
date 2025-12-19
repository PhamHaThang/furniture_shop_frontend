import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package, ArrowRight, AlertCircle } from "lucide-react";
import { Breadcrumb } from "../../components/common";
import { Button, Input, Spinner } from "../../components/ui";
import { orderService } from "../../services";
import { ROUTES } from "../../config";
import { formatPrice, formatDateTime } from "../../utils";
import { useAuth } from "../../contexts";

const OrderTrackingPage = () => {
  const [orderCode, setOrderCode] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderCode.trim()) {
      setError("Vui lòng nhập mã đơn hàng");
      return;
    }
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await orderService.getOrderByCode(orderCode.trim());
      setOrder(response.order);
    } catch (err) {
      setError(err.message || "Không tìm thấy đơn hàng với mã này");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      pending: {
        label: "Chờ xác nhận",
        color: "bg-yellow-100 text-yellow-700",
        step: 1,
      },
      processing: {
        label: "Đang xử lý",
        color: "bg-blue-100 text-blue-700",
        step: 2,
      },
      shipped: {
        label: "Đang giao hàng",
        color: "bg-purple-100 text-purple-700",
        step: 3,
      },
      delivered: {
        label: "Đã giao hàng",
        color: "bg-green-100 text-green-700",
        step: 4,
      },
      cancelled: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-700",
        step: 0,
      },
    };
    return (
      statusMap[status] || { label: status, color: "bg-gray-100", step: 0 }
    );
  };

  const steps = [
    { key: "pending", label: "Đặt hàng" },
    { key: "processing", label: "Xử lý" },
    { key: "shipped", label: "Vận chuyển" },
    { key: "delivered", label: "Hoàn thành" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Tra cứu đơn hàng" }]} className="mb-6" />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-char-900 mb-4">
            Tra cứu đơn hàng
          </h1>
          <p className="text-char-500">
            Nhập mã đơn hàng để theo dõi tình trạng giao hàng
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-char-400"
                size={20}
              />
              <Input
                type="text"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                placeholder="Nhập mã đơn hàng (VD: ORD-XXXXXX)"
              />
            </div>
            <Button type="submit" disabled={loading} className="px-6">
              {loading ? <Spinner size="sm" /> : "Tra cứu"}
            </Button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Order Result */}
        {order && (
          <div className="bg-white rounded-xl border border-beige-200 overflow-hidden">
            {/* Header */}
            <div className="bg-beige-50 p-4 border-b border-beige-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-char-500">Mã đơn hàng</p>
                  <p className="text-xl font-bold text-char-900">
                    #{order.code}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getStatusConfig(order.status).color
                  }`}>
                  {getStatusConfig(order.status).label}
                </span>
              </div>
              <p className="text-sm text-char-500 mt-2">
                Ngày đặt: {formatDateTime(order.createdAt)}
              </p>
            </div>

            {/* Timeline */}
            {order.status !== "cancelled" && (
              <div className="p-6 border-b border-beige-200">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const currentStep = getStatusConfig(order.status).step;
                    const isCompleted = index + 1 <= currentStep;
                    const isCurrent = index + 1 === currentStep;

                    return (
                      <div key={step.key} className="flex-1 relative">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                              isCompleted
                                ? "bg-green-500 text-white"
                                : "bg-beige-200 text-char-400"
                            } ${isCurrent ? "ring-4 ring-green-200" : ""}`}>
                            {index + 1}
                          </div>
                          <span
                            className={`text-xs mt-2 text-center ${
                              isCompleted
                                ? "text-green-600 font-medium"
                                : "text-char-400"
                            }`}>
                            {step.label}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`absolute top-5 left-1/2 w-full h-1 ${
                              index + 1 < currentStep
                                ? "bg-green-500"
                                : "bg-beige-200"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="p-4 border-b border-beige-200">
              <h3 className="font-semibold text-char-900 mb-3">
                Sản phẩm ({order.items?.length || 0})
              </h3>
              <div className="space-y-3">
                {order.items?.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-char-900 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-sm text-char-500">
                        {formatPrice(item.price)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <p className="text-sm text-char-500">
                    và {order.items.length - 3} sản phẩm khác...
                  </p>
                )}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="p-4 border-b border-beige-200">
              <h3 className="font-semibold text-char-900 mb-2">
                Địa chỉ giao hàng
              </h3>
              <p className="text-char-600">
                {order.shippingAddress?.fullName} -{" "}
                {order.shippingAddress?.phone}
              </p>
              <p className="text-char-500 text-sm">
                {order.shippingAddress?.address}, {order.shippingAddress?.ward},{" "}
                {order.shippingAddress?.district},{" "}
                {order.shippingAddress?.province}
              </p>
            </div>

            {/* Total */}
            <div className="p-4 bg-beige-50">
              <div className="flex justify-between items-center">
                <span className="text-char-600">Tổng tiền</span>
                <span className="text-xl font-bold text-primary-500">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Login prompt */}
        {!user && (
          <div className="mt-8 text-center p-6 bg-beige-50 rounded-xl">
            <Package className="mx-auto text-primary-500 mb-3" size={40} />
            <h3 className="font-semibold text-char-900 mb-2">
              Quản lý đơn hàng dễ dàng hơn
            </h3>
            <p className="text-char-500 mb-4">
              Đăng nhập để xem tất cả đơn hàng và theo dõi trạng thái chi tiết
            </p>
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="inline-flex items-center gap-2">
              Đăng nhập ngay
              <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
