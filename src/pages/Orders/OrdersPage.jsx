import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Eye } from "lucide-react";
import { Button, Badge, LoadingScreen } from "../../components/ui";
import { Breadcrumb, EmptyState, Pagination } from "../../components/common";
import { orderService } from "../../services";
import { usePagination } from "../../hooks";
import { ROUTES, PAGINATION_LIMITS, STATUS_ORDERS_MAP } from "../../config";
import { formatPrice, formatDateTime } from "../../utils";
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { page, totalPages, setPage, setTotalItems, paginationParams } =
    usePagination({ initialLimit: PAGINATION_LIMITS.ORDERS });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getUserOrders(paginationParams);
        setOrders(response.orders || []);
        setTotalItems(response.pagination?.total || 0);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  const getStatusBadge = (status) => {
    const config = STATUS_ORDERS_MAP[status] || {
      label: status,
      variant: "default",
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Đơn hàng của tôi" }]} className="mb-6" />
      <h1 className="text-2xl font-bold text-char-900 mb-8">
        Đơn hàng của tôi
      </h1>
      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Chưa có đơn hàng"
          description="Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!"
          action={
            <Link to={ROUTES.PRODUCTS}>
              <Button>Mua sắm ngay</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl border border-beige-200 overflow-hidden">
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-beige-50 border-b border-beige-200">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-char-500">Mã đơn hàng</p>
                      <p className="font-semibold text-char-900">
                        #{order.code}
                      </p>
                    </div>
                    <div className="hidden sm:block border-l border-beige-300 pl-4">
                      <p className="text-sm text-char-500">Ngày đặt</p>
                      <p className="font-medium text-char-700">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    <Link to={`${ROUTES.ORDERS}/${order.code}`}>
                      <Button variant="outline" size="sm">
                        <Eye size={16} className="mr-1" />
                        Chi tiết
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <div className="space-y-3">
                    {order.items?.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <img
                          src={
                            item.image ||
                            item.product?.images?.[0] ||
                            "/placeholder.jpg"
                          }
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-char-900 line-clamp-1">
                            {item.name ||
                              item.product?.name ||
                              "Sản phẩm không tồn tại"}
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
                    {order.items?.length > 2 && (
                      <p className="text-sm text-char-500">
                        và {order.items.length - 2} sản phẩm khác...
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-beige-200">
                  <div className="text-sm text-char-500">
                    {order.items?.length} sản phẩm
                  </div>
                  <div className="text-right">
                    <span className="text-char-500 mr-2">Tổng tiền:</span>
                    <span className="text-xl font-bold text-primary-500">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersPage;
