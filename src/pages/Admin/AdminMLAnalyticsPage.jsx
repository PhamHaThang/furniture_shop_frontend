import { useMemo, useState, useEffect } from "react";
import { RefreshCw, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { adminService } from "../../services";
import { Button, Select } from "../../components";
import { ClusterChart } from "./components";
import {
    getPresetDates,
    buildClusterStats,
    formatNumber,
    formatPrice,
} from "../../utils";
import { TIME_RANGE_OPTIONS } from "../../config/constants";
const AdminMLAnalyticsPage = () => {
    const [loading, setLoading] = useState(false);
    const [clusters, setClusters] = useState([]);
    const [timeRange, setTimeRange] = useState("30d");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        const preset = getPresetDates(timeRange);
        setStartDate(preset.startDate);
        setEndDate(preset.endDate);
    }, [timeRange]);

    const fetchAnalytics = async () => {
        if (timeRange === "custom") {
            if (!startDate || !endDate) {
                toast.error(
                    "Vui lòng chọn đầy đủ Ngày bắt đầu và Ngày kết thúc.",
                );
                return;
            }
            if (new Date(startDate) > new Date(endDate)) {
                toast.error(
                    "Ngày bắt đầu phải nhỏ hơn hoặc bằng Ngày kết thúc.",
                );
                return;
            }
        }
        setLoading(true);
        try {
            const params = {
                clusters,
            };
            if (startDate) {
                params.startDate = `${startDate}T00:00:00.000Z`;
            }
            if (endDate) {
                params.endDate = `${endDate}T23:59:59.999Z`;
            }
            const response = await adminService.getMLDashboard(params);
            setAnalytics(response.analytics || null);
        } catch (error) {
            toast.error(error.message || "Không thể tải ML analytics");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!endDate) return;
        fetchAnalytics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clusters, startDate, endDate]);
    const sentiment = analytics?.sentiment?.summary || {};
    const totalSentiment = sentiment.total || 0;
    const orderSummary = analytics?.orders?.summary || {};
    const reviewSummary = analytics?.reviews?.summary || {};
    const orderStatusDistribution =
        analytics?.orders?.status_distribution || [];
    const ratingDistribution = analytics?.reviews?.rating_distribution || [];
    const productClusterStats = useMemo(
        () => buildClusterStats(analytics?.clusters?.products?.clusters || []),
        [analytics],
    );

    const userClusterStats = useMemo(
        () => buildClusterStats(analytics?.clusters?.users?.clusters || []),
        [analytics],
    );
    const goodPercent = totalSentiment
        ? Math.round(((sentiment.good || 0) / totalSentiment) * 100)
        : 0;
    const badPercent = totalSentiment
        ? Math.round(((sentiment.bad || 0) / totalSentiment) * 100)
        : 0;
    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-char-900">
                        Admin ML Analytics
                    </h1>
                    <p className="text-gray-500">
                        Phân tích Recommendation, Clustering và Sentiment trong
                        hệ thống theo thời gian.
                    </p>
                </div>
                <Button
                    onClick={fetchAnalytics}
                    variant="outline"
                    leftIcon={
                        <RefreshCw
                            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                        />
                    }>
                    Làm mới dữ liệu
                </Button>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Select
                        label="Khoảng thời gian"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        options={TIME_RANGE_OPTIONS}
                    />

                    {timeRange === "custom" && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Từ ngày
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Đến ngày
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>
                        </>
                    )}

                    <Select
                        label="Số cụm KMeans"
                        value={String(clusters)}
                        onChange={(e) => setClusters(Number(e.target.value))}
                        options={[
                            { value: "3", label: "3 cụm" },
                            { value: "4", label: "4 cụm" },
                            { value: "5", label: "5 cụm" },
                            { value: "6", label: "6 cụm" },
                        ]}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <p className="text-sm text-gray-500">Good Reviews</p>
                    </div>
                    <p className="text-3xl font-bold text-char-900">
                        {sentiment.good || 0}
                    </p>
                    <p className="text-sm text-emerald-600 mt-1">
                        {goodPercent}%
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <p className="text-sm text-gray-500">Bad Reviews</p>
                    </div>
                    <p className="text-3xl font-bold text-char-900">
                        {sentiment.bad || 0}
                    </p>
                    <p className="text-sm text-rose-600 mt-1">{badPercent}%</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <p className="text-sm text-gray-500">
                            Tổng Reviews ML xử lý
                        </p>
                    </div>
                    <p className="text-3xl font-bold text-char-900">
                        {totalSentiment}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm text-gray-500">Tổng đơn hàng</p>
                    <p className="text-3xl font-bold text-char-900 mt-2">
                        {formatNumber(orderSummary.total_orders)}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm text-gray-500">Tổng doanh thu</p>
                    <p className="text-2xl font-bold text-char-900 mt-2">
                        {formatPrice(orderSummary.total_revenue)}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm text-gray-500">Giá trị đơn TB</p>
                    <p className="text-2xl font-bold text-char-900 mt-2">
                        {formatPrice(orderSummary.avg_order_value)}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm text-gray-500">Điểm rating TB</p>
                    <p className="text-3xl font-bold text-char-900 mt-2">
                        {Number(reviewSummary.avg_rating || 0).toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-base font-semibold text-char-900 mb-4">
                        Phân bổ trạng thái đơn hàng
                    </h3>
                    {orderStatusDistribution.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            Không có dữ liệu đơn hàng.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {orderStatusDistribution.map((item) => (
                                <div key={item.status} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-char-700 capitalize">
                                            {item.status}
                                        </span>
                                        <span className="text-char-900 font-medium">
                                            {formatNumber(item.count)} (
                                            {Math.round(
                                                (item.ratio || 0) * 100,
                                            )}
                                            %)
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full"
                                            style={{
                                                width: `${Math.max((item.ratio || 0) * 100, 6)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-base font-semibold text-char-900 mb-4">
                        Phân bổ điểm đánh giá (1-5 sao)
                    </h3>
                    {ratingDistribution.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            Không có dữ liệu review.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {ratingDistribution.map((item) => (
                                <div key={item.rating} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-char-700">
                                            {item.rating} sao
                                        </span>
                                        <span className="text-char-900 font-medium">
                                            {formatNumber(item.count)} (
                                            {Math.round(
                                                (item.ratio || 0) * 100,
                                            )}
                                            %)
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500 rounded-full"
                                            style={{
                                                width: `${Math.max((item.ratio || 0) * 100, 6)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-base font-semibold text-char-900 mb-4">
                    Phân bố Sentiment
                </h3>
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-emerald-700 font-medium">
                                Good
                            </span>
                            <span className="text-char-700">
                                {goodPercent}%
                            </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500"
                                style={{ width: `${goodPercent}%` }}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-rose-700 font-medium">
                                Bad
                            </span>
                            <span className="text-char-700">{badPercent}%</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-rose-500"
                                style={{ width: `${badPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ClusterChart
                    title="KMeans Clusters - Products"
                    stats={productClusterStats}
                />
                <ClusterChart
                    title="KMeans Clusters - Users"
                    stats={userClusterStats}
                />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-base font-semibold text-char-900 mb-4">
                    Top sản phẩm theo sentiment tích cực
                </h3>

                {loading ? (
                    <div className="py-10 text-center text-gray-500">
                        Đang tải dữ liệu ML...
                    </div>
                ) : analytics?.top_products_by_sentiment?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sản phẩm
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tổng review
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Good
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Bad
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tỉ lệ Good
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {analytics.top_products_by_sentiment.map(
                                    (item) => (
                                        <tr
                                            key={item.product_id}
                                            className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-char-900">
                                                {item.name || "Sản phẩm"}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {item.total_reviews}
                                            </td>
                                            <td className="px-4 py-3 text-emerald-600">
                                                {item.good}
                                            </td>
                                            <td className="px-4 py-3 text-rose-600">
                                                {item.bad}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {Math.round(
                                                    (item.good_ratio || 0) *
                                                        100,
                                                )}
                                                %
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-10 text-center text-gray-500">
                        Không có dữ liệu trong khoảng thời gian đã chọn.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMLAnalyticsPage;
