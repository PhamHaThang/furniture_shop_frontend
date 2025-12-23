import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Trash2,
} from "lucide-react";
import { adminService } from "../../services";
import { formatPrice } from "../../utils";
import {
  PAYMENT_STATUS_CONFIG,
  PLACEHOLDER_IMAGE,
  STATUS_ORDERS_MAP,
} from "../../config";
import toast from "react-hot-toast";
import {
  Button,
  ConfirmModal,
  EmptyState,
  LoadingScreen,
} from "../../components";
const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await adminService.getOrderById(id);
      console.log("Fetched order:", response);
      setOrder(response.order);
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải chi tiết đơn hàng");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrder();
  }, [id, navigate]);
  const handleStatusChange = async (newStatus) => {
    try {
      await adminService.updateOrderStatus(id, newStatus);
      toast.success("Cập nhật trạng thái đơn hàng thành công");
      fetchOrder();
    } catch (error) {
      toast.error(error.message || "Không thể cập nhật trạng thái đơn hàng");
    }
  };
  const handlePaymentStatusChange = async (newPaymentStatus) => {
    try {
      await adminService.updatePaymentStatus(id, newPaymentStatus);
      toast.success("Cập nhật trạng thái thanh toán thành công");
      fetchOrder();
    } catch (error) {
      toast.error(error.message || "Không thể cập nhật trạng thái thanh toán");
    }
  };
  const handleDelete = async () => {
    try {
      await adminService.deleteOrder(id);
      toast.success("Xóa đơn hàng thành công");
      navigate("/admin/orders");
    } catch (error) {
      toast.error(error.message || "Không thể xóa đơn hàng");
    } finally {
      setDeleteConfirm(false);
    }
  };
  if (loading) {
    return <LoadingScreen />;
  }
  if (!order) {
    return (
      <EmptyState
        icon={Package}
        title="Không tìm thấy chi tiết đơn hàng"
        description="Vui lòng thử lại sau hoặc quay lại danh sách đơn hàng."
        action={
          <Button
            variant="primary"
            onClick={() => navigate("/admin/orders")}
            leftIcon={<ArrowLeft />}>
            Quay lại danh sách
          </Button>
        }
      />
    );
  }
  const StatusIcon = STATUS_ORDERS_MAP[order.status]?.icon || Clock;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/orders"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-char-900">
              Đơn hàng #{order.code}
            </h1>
            <p className="text-gray-500">
              {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
        <Button
          variant="danger"
          leftIcon={<Trash2 />}
          onClick={() => setDeleteConfirm(true)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-500 mb-2">Trạng thái đơn hàng</p>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`w-full text-sm font-medium rounded-lg px-3 py-2 border cursor-pointer ${
                  STATUS_ORDERS_MAP[order.status]?.color || "bg-gray-100"
                }`}
                disabled={
                  order.status === "delivered" || order.status === "cancelled"
                }>
                {Object.entries(STATUS_ORDERS_MAP).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-gray-500 mb-2">
                Trạng thái thanh toán
              </p>
              <select
                value={order.payment?.status || "pending"}
                onChange={(e) => handlePaymentStatusChange(e.target.value)}
                className={`w-full text-sm font-medium rounded-lg px-3 py-2 border cursor-pointer ${
                  PAYMENT_STATUS_CONFIG[order.payment?.status]?.color ||
                  "bg-gray-100"
                }`}>
                {Object.entries(PAYMENT_STATUS_CONFIG).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-char-900">
                Sản phẩm ({order.items?.length || 0})
              </h2>
            </div>
            <div className="divide-y">
              {order.items?.map((item, index) => (
                <div key={index} className="p-4 flex gap-4">
                  <img
                    src={item.product?.images?.[0] || PLACEHOLDER_IMAGE}
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-char-900 truncate">
                      {item.product?.name || "Sản phẩm không tồn tại"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Đơn giá: {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-char-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Notes */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-semibold text-char-900 mb-2">
              Ghi chú
            </h2>
            <p className="text-gray-600">
              {order.notes ? order.notes : "Không có ghi chú."}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-semibold text-char-900 mb-4">
              Thông tin khách hàng
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <span>{order.user?.fullName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>{order.user?.email}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-semibold text-char-900 mb-4">
              Địa chỉ giao hàng
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <span>{order.shippingAddress?.fullName}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <span>{order.shippingAddress?.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <span>
                  {order.shippingAddress?.address},{" "}
                  {order.shippingAddress?.ward},{" "}
                  {order.shippingAddress?.district},{" "}
                  {order.shippingAddress?.province}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-semibold text-char-900 mb-4">
              Thông tin thanh toán
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span>
                  {order.payment?.method === "COD"
                    ? "Thanh toán khi nhận hàng"
                    : order.payment?.method === "BANK"
                    ? "Chuyển khoản ngân hàng"
                    : order.payment?.method}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">Trạng thái:</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    order.payment?.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : order.payment?.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                  {order.payment?.status === "completed"
                    ? "Đã thanh toán"
                    : order.payment?.status === "pending"
                    ? "Chờ thanh toán"
                    : "Thanh toán thất bại"}
                </span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-semibold text-char-900 mb-4">
              Tổng cộng
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(order.subTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>{formatPrice(order.shippingFee || 0)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Tổng tiền</span>
                <span className="text-primary-500">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmModal
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa đơn hàng ${order.code}? Hành động này không thể hoàn tác.`}
          isOpen={Boolean(deleteConfirm)}
          onClose={() => setDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default OrderDetailPage;
