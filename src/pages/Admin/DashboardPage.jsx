import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";
import { adminService } from "../../services";
import { formatPrice } from "../../utils";
import { StatCard, OrderStatusBadge } from "./components";
import { LoadingScreen } from "../../components";
const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    orderStats: null,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, ordersData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getOrders({ limit: 5, sort: "-createdAt" }),
        ]);
        console.log("Fetched dashboard data:", { statsData, ordersData });
        setStats(statsData);
        setRecentOrders(ordersData.orders || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const totalRevenue = stats.orderStats?.totalRevenue || 0;
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-char-900">Dashboard</h1>
        <p className="text-gray-500">Tổng quan về cửa hàng</p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng người dùng"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Tổng sản phẩm"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
          color="bg-green-500"
        />
        <StatCard
          title="Tổng đơn hàng"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          color="bg-purple-500"
        />
        <StatCard
          title="Doanh thu"
          value={formatPrice(totalRevenue)}
          icon={DollarSign}
          color="bg-primary-500"
        />
      </div>
      {/* Order Stats by Status */}
      {stats.orderStats?.orderCountByStatus && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-char-900 mb-4">
            Thống kê theo trạng thái đơn hàng
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.orderStats.orderCountByStatus.map((item) => (
              <div
                key={item._id}
                className="text-center p-4 bg-gray-50 rounded-lg">
                <OrderStatusBadge status={item._id} />
                <p className="text-2xl font-bold text-char-900 mt-2">
                  {item.count}
                </p>
                <p className="text-sm text-gray-500">
                  {formatPrice(item.total)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-char-900">
            Đơn hàng gần đây
          </h2>
          <Link
            to="/admin/orders"
            className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1">
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
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
                  Ngày tạo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500">
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
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
                          {order.user?.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
