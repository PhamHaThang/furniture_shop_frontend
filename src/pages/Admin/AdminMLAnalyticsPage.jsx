import { useMemo, useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { adminService } from "../../services";
import { getPresetDates, normalizeStatusKey } from "../../utils";
import {
    TIME_RANGE_OPTIONS,
    SENTIMENT_COLOR_MAP,
    RATING_COLOR_MAP,
    ORDER_STATUS_FALLBACK_COLORS,
    ORDER_STATUS_COLOR_MAP,
} from "../../config/constants";
import {
    MLAnalyticsHeader,
    MLAnalyticsFilters,
    MLSentimentSummaryCards,
    MLOrderReviewSummaryCards,
    OrderStatusDistributionCard,
    SentimentDistributionCard,
    RatingDistributionCard,
    TopSentimentProductsTable,
} from "./components";
const AdminMLAnalyticsPage = () => {
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState("30d");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [analytics, setAnalytics] = useState(null);
    const [hoveredOrderStatus, setHoveredOrderStatus] = useState(null);
    const [hoveredRating, setHoveredRating] = useState(null);
    const [hoveredSentiment, setHoveredSentiment] = useState(null);

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
            const params = {};
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
        if (timeRange !== "all" && !endDate) return;
        fetchAnalytics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, timeRange]);
    const sentiment = analytics?.sentiment?.summary || {};
    const totalSentiment = sentiment.total || 0;
    const orderSummary = analytics?.orders?.summary || {};
    const reviewSummary = analytics?.reviews?.summary || {};
    const orderStatusDistribution =
        analytics?.orders?.status_distribution || [];
    const ratingDistribution = analytics?.reviews?.rating_distribution || [];

    const totalOrderStatusCount = orderStatusDistribution.reduce(
        (sum, item) => sum + Number(item.count || 0),
        0,
    );

    const orderStatusPieData = orderStatusDistribution.map((item, index) => {
        const computedRatio =
            item.ratio !== undefined
                ? Number(item.ratio)
                : totalOrderStatusCount > 0
                  ? Number(item.count || 0) / totalOrderStatusCount
                  : 0;

        return {
            ...item,
            ratio: computedRatio,
            percent: Math.round(computedRatio * 100),
            color:
                ORDER_STATUS_COLOR_MAP[normalizeStatusKey(item.status)] ||
                ORDER_STATUS_FALLBACK_COLORS[
                    index % ORDER_STATUS_FALLBACK_COLORS.length
                ],
        };
    });

    const pieChartSegments = useMemo(() => {
        const radius = 76;
        const circumference = 2 * Math.PI * radius;
        let offset = 0;

        return orderStatusPieData.map((item) => {
            const ratio = Math.max(0, Number(item.ratio || 0));
            const segmentLength = ratio * circumference;
            const segment = {
                ...item,
                radius,
                circumference,
                segmentLength,
                dashArray: `${segmentLength} ${circumference - segmentLength}`,
                dashOffset: -offset,
            };
            offset += segmentLength;
            return segment;
        });
    }, [orderStatusPieData]);

    const totalRatingCount = ratingDistribution.reduce(
        (sum, item) => sum + Number(item.count || 0),
        0,
    );

    const ratingPieData = ratingDistribution
        .map((item) => {
            const ratio =
                item.ratio !== undefined
                    ? Number(item.ratio)
                    : totalRatingCount > 0
                      ? Number(item.count || 0) / totalRatingCount
                      : 0;
            const ratingKey = Number(item.rating || 0);

            return {
                ...item,
                ratio,
                percent: Math.round(ratio * 100),
                color: RATING_COLOR_MAP[ratingKey] || "#9CA3AF",
            };
        })
        .sort((a, b) => Number(b.rating) - Number(a.rating));

    const ratingPieSegments = useMemo(() => {
        const radius = 76;
        const circumference = 2 * Math.PI * radius;
        let offset = 0;

        return ratingPieData.map((item) => {
            const ratio = Math.max(0, Number(item.ratio || 0));
            const segmentLength = ratio * circumference;
            const segment = {
                ...item,
                radius,
                circumference,
                segmentLength,
                dashArray: `${segmentLength} ${circumference - segmentLength}`,
                dashOffset: -offset,
            };
            offset += segmentLength;
            return segment;
        });
    }, [ratingPieData]);

    const goodPercent = totalSentiment
        ? Math.round(((sentiment.good || 0) / totalSentiment) * 100)
        : 0;
    const badPercent = totalSentiment
        ? Math.round(((sentiment.bad || 0) / totalSentiment) * 100)
        : 0;

    const sentimentPieData = useMemo(
        () =>
            totalSentiment
                ? [
                      {
                          key: "Good",
                          count: Number(sentiment.good || 0),
                          ratio: Number(sentiment.good || 0) / totalSentiment,
                          percent: goodPercent,
                          color: SENTIMENT_COLOR_MAP.Good,
                      },
                      {
                          key: "Bad",
                          count: Number(sentiment.bad || 0),
                          ratio: Number(sentiment.bad || 0) / totalSentiment,
                          percent: badPercent,
                          color: SENTIMENT_COLOR_MAP.Bad,
                      },
                  ]
                : [],
        [
            totalSentiment,
            sentiment.good,
            sentiment.bad,
            goodPercent,
            badPercent,
        ],
    );

    const sentimentPieSegments = useMemo(() => {
        const radius = 76;
        const circumference = 2 * Math.PI * radius;
        let offset = 0;

        return sentimentPieData.map((item) => {
            const ratio = Math.max(0, Number(item.ratio || 0));
            const segmentLength = ratio * circumference;
            const segment = {
                ...item,
                radius,
                circumference,
                segmentLength,
                dashArray: `${segmentLength} ${circumference - segmentLength}`,
                dashOffset: -offset,
            };
            offset += segmentLength;
            return segment;
        });
    }, [sentimentPieData]);
    return (
        <div className="space-y-6">
            <MLAnalyticsHeader loading={loading} onRefresh={fetchAnalytics} />

            {loading && (
                <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Đang tải và cập nhật dữ liệu ML Analytics...
                </div>
            )}

            <MLAnalyticsFilters
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                timeRangeOptions={TIME_RANGE_OPTIONS}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                showClusterSelect={false}
            />

            <MLSentimentSummaryCards
                sentiment={sentiment}
                totalSentiment={totalSentiment}
                goodPercent={goodPercent}
                badPercent={badPercent}
            />

            <MLOrderReviewSummaryCards
                orderSummary={orderSummary}
                reviewSummary={reviewSummary}
            />

            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                <OrderStatusDistributionCard
                    orderStatusDistribution={orderStatusDistribution}
                    pieChartSegments={pieChartSegments}
                    orderStatusPieData={orderStatusPieData}
                    hoveredOrderStatus={hoveredOrderStatus}
                    onHoverStatus={setHoveredOrderStatus}
                    totalOrderStatusCount={totalOrderStatusCount}
                />

                <SentimentDistributionCard
                    sentimentPieData={sentimentPieData}
                    sentimentPieSegments={sentimentPieSegments}
                    hoveredSentiment={hoveredSentiment}
                    onHoverSentiment={setHoveredSentiment}
                    totalSentiment={totalSentiment}
                />

                <RatingDistributionCard
                    ratingDistribution={ratingDistribution}
                    ratingPieData={ratingPieData}
                    ratingPieSegments={ratingPieSegments}
                    hoveredRating={hoveredRating}
                    onHoverRating={setHoveredRating}
                    totalRatingCount={totalRatingCount}
                />
            </div>

            <TopSentimentProductsTable
                loading={loading}
                products={analytics?.top_products_by_sentiment || []}
            />
        </div>
    );
};

export default AdminMLAnalyticsPage;
