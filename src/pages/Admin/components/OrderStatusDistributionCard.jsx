import { formatNumber } from "../../../utils";

const OrderStatusDistributionCard = ({
    orderStatusDistribution = [],
    pieChartSegments = [],
    orderStatusPieData = [],
    hoveredOrderStatus,
    onHoverStatus,
    totalOrderStatusCount = 0,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-char-900 mb-4">
                Phân bổ trạng thái đơn hàng
            </h3>
            {orderStatusDistribution.length === 0 ? (
                <p className="text-sm text-gray-500">
                    Không có dữ liệu đơn hàng.
                </p>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr] gap-6 items-center">
                    <div className="flex justify-center">
                        <div className="relative w-48 h-48">
                            <svg
                                viewBox="0 0 200 200"
                                className="w-48 h-48"
                                role="img"
                                aria-label="Biểu đồ tròn phân bổ trạng thái đơn hàng">
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="76"
                                    fill="none"
                                    stroke="#E5E7EB"
                                    strokeWidth="34"
                                />
                                {pieChartSegments.map((item) => {
                                    const isHovered =
                                        hoveredOrderStatus === item.status;
                                    return (
                                        <circle
                                            key={item.status}
                                            cx="100"
                                            cy="100"
                                            r={item.radius}
                                            fill="none"
                                            stroke={item.color}
                                            strokeWidth={
                                                isHovered ? "38" : "34"
                                            }
                                            strokeLinecap="butt"
                                            strokeDasharray={item.dashArray}
                                            strokeDashoffset={item.dashOffset}
                                            transform="rotate(-90 100 100)"
                                            opacity={isHovered ? 1 : 0.9}
                                            className="cursor-pointer transition-all duration-200"
                                            onMouseEnter={() =>
                                                onHoverStatus(item.status)
                                            }
                                            onMouseLeave={() =>
                                                onHoverStatus(null)
                                            }>
                                            <title>
                                                {`${item.status}: ${formatNumber(item.count)} đơn (${item.percent}%)`}
                                            </title>
                                        </circle>
                                    );
                                })}
                            </svg>
                            <div className="absolute inset-7 rounded-full bg-white flex items-center justify-center shadow-inner">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                                        Tổng đơn
                                    </p>
                                    <p className="text-2xl font-bold text-char-900">
                                        {formatNumber(totalOrderStatusCount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {orderStatusPieData.map((item) => (
                            <div
                                key={item.status}
                                role="button"
                                tabIndex={0}
                                onMouseEnter={() => onHoverStatus(item.status)}
                                onMouseLeave={() => onHoverStatus(null)}
                                onFocus={() => onHoverStatus(item.status)}
                                onBlur={() => onHoverStatus(null)}
                                className={`flex items-center justify-between text-sm rounded-md px-2 py-1 transition-colors cursor-pointer ${
                                    {
                                        true: "bg-indigo-50",
                                        false: "hover:bg-gray-50",
                                    }[
                                        String(
                                            hoveredOrderStatus === item.status,
                                        )
                                    ]
                                }`}>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="inline-block w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span
                                        className={`capitalize ${
                                            hoveredOrderStatus === item.status
                                                ? "text-indigo-700 font-medium"
                                                : "text-char-700"
                                        }`}
                                        title={`${item.status}: ${formatNumber(item.count)} đơn (${item.percent}%)`}>
                                        {item.status}
                                    </span>
                                </div>
                                <span
                                    className={`font-medium ${
                                        hoveredOrderStatus === item.status
                                            ? "text-indigo-700"
                                            : "text-char-900"
                                    }`}>
                                    {formatNumber(item.count)} ({item.percent}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderStatusDistributionCard;
