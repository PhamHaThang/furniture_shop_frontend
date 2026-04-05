import { formatNumber, formatPrice } from "../../../utils";

const MLOrderReviewSummaryCards = ({
    orderSummary = {},
    reviewSummary = {},
}) => {
    return (
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
    );
};

export default MLOrderReviewSummaryCards;
