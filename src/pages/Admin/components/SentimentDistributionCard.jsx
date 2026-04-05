import { formatNumber } from "../../../utils";

const SentimentDistributionCard = ({
    sentimentPieData = [],
    sentimentPieSegments = [],
    hoveredSentiment,
    onHoverSentiment,
    totalSentiment = 0,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-char-900 mb-4">
                Phân bố Sentiment
            </h3>
            {sentimentPieData.length === 0 ? (
                <p className="text-sm text-gray-500">
                    Không có dữ liệu sentiment.
                </p>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-center">
                    <div className="flex justify-center">
                        <div className="relative w-48 h-48">
                            <svg
                                viewBox="0 0 200 200"
                                className="w-48 h-48"
                                role="img"
                                aria-label="Biểu đồ tròn phân bố sentiment">
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="76"
                                    fill="none"
                                    stroke="#E5E7EB"
                                    strokeWidth="34"
                                />
                                {sentimentPieSegments.map((item) => {
                                    const isHovered =
                                        hoveredSentiment === item.key;
                                    return (
                                        <circle
                                            key={item.key}
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
                                                onHoverSentiment(item.key)
                                            }
                                            onMouseLeave={() =>
                                                onHoverSentiment(null)
                                            }>
                                            <title>
                                                {`${item.key}: ${formatNumber(item.count)} (${item.percent}%)`}
                                            </title>
                                        </circle>
                                    );
                                })}
                            </svg>
                            <div className="absolute inset-7 rounded-full bg-white flex items-center justify-center shadow-inner">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                                        Tổng reviews
                                    </p>
                                    <p className="text-2xl font-bold text-char-900">
                                        {formatNumber(totalSentiment)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {sentimentPieData.map((item) => {
                            const isHovered = hoveredSentiment === item.key;
                            return (
                                <div
                                    key={item.key}
                                    role="button"
                                    tabIndex={0}
                                    onMouseEnter={() =>
                                        onHoverSentiment(item.key)
                                    }
                                    onMouseLeave={() => onHoverSentiment(null)}
                                    onFocus={() => onHoverSentiment(item.key)}
                                    onBlur={() => onHoverSentiment(null)}
                                    className={`flex items-center justify-between text-sm rounded-md px-2 py-1 transition-colors cursor-pointer ${
                                        isHovered
                                            ? item.key === "Good"
                                                ? "bg-emerald-50"
                                                : "bg-rose-50"
                                            : "hover:bg-gray-50"
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="inline-block w-3 h-3 rounded-full"
                                            style={{
                                                backgroundColor: item.color,
                                            }}
                                        />
                                        <span
                                            className={
                                                isHovered
                                                    ? item.key === "Good"
                                                        ? "text-emerald-700 font-medium"
                                                        : "text-rose-700 font-medium"
                                                    : "text-char-700"
                                            }>
                                            {item.key}
                                        </span>
                                    </div>
                                    <span
                                        className={
                                            isHovered
                                                ? item.key === "Good"
                                                    ? "text-emerald-700 font-medium"
                                                    : "text-rose-700 font-medium"
                                                : "text-char-900 font-medium"
                                        }>
                                        {formatNumber(item.count)} (
                                        {item.percent}%)
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SentimentDistributionCard;
