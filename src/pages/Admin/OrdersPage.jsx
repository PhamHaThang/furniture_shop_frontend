import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Filter,
  Trash2,
} from "lucide-react";
import { adminService } from "../../services";
import { formatPrice } from "../../utils";
import toast from "react-hot-toast";
import { PAYMENT_STATUS_CONFIG, STATUS_ORDERS_MAP } from "../../config";
import { Button, Input, Select, Pagination } from "../../components";
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", paymentStatus: "" });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getOrders({
        page: pagination.page,
        limit: pagination.limit,
        search,
        status: filters.status,
        paymentStatus: filters.paymentStatus,
        sort: "-createdAt",
      });
      setOrders(response.orders || []);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages,
      }));
    } catch (error) {
      toast.error(error.message || "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    search,
    filters.status,
    filters.paymentStatus,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      toast.success("Cập nhật trạng thái đơn hàng thành công");
      fetchOrders();
    } catch (error) {
      toast.error(error.message || "Không thể cập nhật trạng thái đơn hàng");
    }
  };
  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      await adminService.updateOrderPaymentStatus(orderId, newPaymentStatus);
      toast.success("Cập nhật trạng thái thanh toán thành công");
      fetchOrders();
    } catch (error) {
      toast.error(error.message || "Không thể cập nhật trạng thái thanh toán");
    }
  };

  const handleDeleteClick = async (order) => {
    setDeletingOrder(order);
    setShowDeleteConfirm(true);
  };
  const handleDeleteConfirm = async () => {
    try {
      await adminService.deleteOrder(deletingOrder._id);
      setOrders((prev) => prev.filter((o) => o._id !== deletingOrder._id));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
      toast.success("Xóa đơn hàng thành công");
    } catch (error) {
      toast.error(error.message || "Không thể xóa đơn hàng");
    } finally {
      setShowDeleteConfirm(false);
      setDeletingOrder(null);
    }
  };
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeletingOrder(null);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-char-900">Quản lý đơn hàng</h1>
        <p className="text-gray-500">
          Quản lý và xử lý đơn hàng của khách hàng
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative lg:col-span-2">
            <Input
              type="text"
              placeholder="Tìm kiếm mã đơn, tên khách hàng..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full"
              leftIcon={<Search className="w-5 h-5 text-gray-400" />}
            />
          </div>
          <Select
            value={filters.status}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, status: e.target.value }));
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            options={[
              { value: "", label: "Tất cả trạng thái" },
              ...Object.entries(STATUS_ORDERS_MAP).map(([key, val]) => ({
                value: key,
                label: val.label,
              })),
            ]}
            placeholder=""
            className="w-full"
          />
          <Select
            placeholder=""
            value={filters.paymentStatus}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                paymentStatus: e.target.value,
              }));
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="w-full"
            options={[
              { value: "", label: "Tất cả thanh toán" },
              ...Object.entries(PAYMENT_STATUS_CONFIG).map(([key, val]) => ({
                value: key,
                label: val.label,
              })),
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="text-primary-500 hover:text-primary-600 font-medium">
                        {order.code}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-char-900">
                          {order.shippingAddress?.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.shippingAddress?.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer ${
                          STATUS_ORDERS_MAP[order.status]?.color ||
                          "bg-gray-100"
                        }`}
                        disabled={
                          order.status === "delivered" ||
                          order.status === "cancelled"
                        }>
                        {Object.entries(STATUS_ORDERS_MAP).map(([key, val]) => (
                          <option key={key} value={key}>
                            {val.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.payment?.status || "pending"}
                        onChange={(e) =>
                          handlePaymentStatusChange(order._id, e.target.value)
                        }
                        className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer ${
                          PAYMENT_STATUS_CONFIG[order.payment?.status]?.color ||
                          "bg-gray-100"
                        }`}>
                        {Object.entries(PAYMENT_STATUS_CONFIG).map(
                          ([key, val]) => (
                            <option key={key} value={key}>
                              {val.label}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex cursor-pointer"
                          title="Xem chi tiết">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(order)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer "
                          title="Xóa đơn hàng">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <p className="text-sm text-gray-500">
            Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
            trong {pagination.total} kết quả
          </p>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-char-900">
                    Xóa đơn hàng
                  </h3>
                  <p className="text-sm text-char-600">
                    Mã: {deletingOrder.code}
                  </p>
                </div>
              </div>
              <p className="text-char-700 mb-6">
                Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể
                hoàn tác.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleDeleteCancel}>
                  Hủy
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={handleDeleteConfirm}>
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
