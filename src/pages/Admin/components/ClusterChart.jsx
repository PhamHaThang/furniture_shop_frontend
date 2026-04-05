import { useState } from "react";

const formatCompactNumber = (value) =>
    Number(value || 0).toLocaleString("vi-VN");

const formatCompactPrice = (value) =>
    `${Number(value || 0).toLocaleString("vi-VN")}đ`;

const RADAR_COLORS = [
    "#4F46E5",
    "#0EA5E9",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
];

const CLUSTER_METRICS = {
    products: [
        { key: "price", label: "Giá" },
        { key: "average_rating", label: "Rating" },
        { key: "sold_count", label: "Đã bán" },
        { key: "stock", label: "Tồn kho" },
    ],
    users: [
        { key: "total_spent", label: "Chi tiêu" },
        { key: "total_orders", label: "Số đơn" },
        { key: "avg_order_value", label: "Đơn TB" },
        { key: "total_reviews", label: "Reviews" },
    ],
};

const toRadarPoint = (cx, cy, radius, totalAxes, index, valueRatio) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / totalAxes;
    const pointRadius = radius * valueRatio;
    return {
        x: cx + Math.cos(angle) * pointRadius,
        y: cy + Math.sin(angle) * pointRadius,
    };
};

const getAxisTextAnchor = (x, cx = 110) => {
    if (x > cx + 8) return "start";
    if (x < cx - 8) return "end";
    return "middle";
};

const getAxisBaseline = (y, cy = 110) => {
    if (y > cy + 8) return "hanging";
    if (y < cy - 8) return "baseline";
    return "middle";
};

const toPointString = (points = []) =>
    points.map((point) => `${point.x},${point.y}`).join(" ");

const buildMetricValueText = (metricKey, value) => {
    if (
        metricKey === "price" ||
        metricKey === "total_spent" ||
        metricKey === "avg_order_value"
    ) {
        return formatCompactPrice(value);
    }
    if (metricKey === "average_rating") {
        return Number(value || 0).toFixed(2);
    }
    return formatCompactNumber(value);
};

const getDominantMetricInsight = (
    avgFeatures = {},
    metrics = [],
    maxByMetric = {},
) => {
    if (!metrics.length) return null;

    let best = null;
    metrics.forEach((metric) => {
        const raw = Number(avgFeatures?.[metric.key] || 0);
        const max = Number(maxByMetric?.[metric.key] || 1);
        const ratio = max > 0 ? raw / max : 0;
        if (!best || ratio > best.ratio) {
            best = {
                key: metric.key,
                label: metric.label,
                raw,
                ratio,
            };
        }
    });

    if (!best) return null;

    return {
        label: best.label,
        valueText: buildMetricValueText(best.key, best.raw),
        ratioPercent: Math.round(Math.min(best.ratio, 1) * 100),
    };
};

const buildFeatureInsights = (avgFeatures = {}, type = "products") => {
    if (type === "users") {
        return [
            {
                label: "Chi tiêu TB",
                value: formatCompactPrice(avgFeatures.total_spent),
            },
            {
                label: "Đơn TB",
                value: formatCompactNumber(avgFeatures.total_orders),
            },
            {
                label: "Review TB",
                value: formatCompactNumber(avgFeatures.total_reviews),
            },
        ];
    }

    return [
        {
            label: "Giá TB",
            value: formatCompactPrice(avgFeatures.price),
        },
        {
            label: "Rating TB",
            value: Number(avgFeatures.average_rating || 0).toFixed(2),
        },
        {
            label: "Đã bán TB",
            value: formatCompactNumber(avgFeatures.sold_count),
        },
    ];
};

const toSafeCount = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) return 0;
    return numeric;
};

const ClusterChart = ({ title, stats = [], type = "products" }) => {
    const [selectedClusters, setSelectedClusters] = useState([]);

    const normalizedStats = stats.map((item) => ({
        ...item,
        safeCount: toSafeCount(item.count),
    }));

    const max = Math.max(...normalizedStats.map((s) => s.safeCount), 1);
    const total = normalizedStats.reduce(
        (sum, item) => sum + item.safeCount,
        0,
    );
    const metrics = CLUSTER_METRICS[type] || CLUSTER_METRICS.products;

    const radarMaxByMetric = metrics.reduce((acc, metric) => {
        const maxValue = Math.max(
            ...stats.map((item) =>
                Number(item?.avgFeatures?.[metric.key] || 0),
            ),
            1,
        );
        acc[metric.key] = maxValue;
        return acc;
    }, {});

    const radarSeries = stats.map((item, index) => {
        const color = RADAR_COLORS[index % RADAR_COLORS.length];
        const points = metrics.map((metric, metricIndex) => {
            const rawValue = Number(item?.avgFeatures?.[metric.key] || 0);
            const maxValue = Number(radarMaxByMetric[metric.key] || 1);
            const ratio = maxValue > 0 ? Math.min(rawValue / maxValue, 1) : 0;
            return toRadarPoint(
                110,
                110,
                76,
                metrics.length,
                metricIndex,
                ratio,
            );
        });

        return {
            cluster: item.cluster,
            label: item.label,
            color,
            points,
        };
    });

    const radarAxis = metrics.map((metric, index) => {
        const end = toRadarPoint(110, 110, 82, metrics.length, index, 1);
        const label = toRadarPoint(110, 110, 108, metrics.length, index, 1);
        return {
            ...metric,
            axisX: end.x,
            axisY: end.y,
            labelX: label.x,
            labelY: label.y,
            textAnchor: getAxisTextAnchor(label.x),
            textBaseline: getAxisBaseline(label.y),
        };
    });

    const visibleRadarSeries = !selectedClusters.length
        ? radarSeries
        : radarSeries.filter((series) =>
              selectedClusters.includes(Number(series.cluster)),
          );

    const clusterColorMap = {};
    radarSeries.forEach((series) => {
        clusterColorMap[Number(series.cluster)] = series.color;
    });

    const toggleCluster = (clusterId) => {
        const numericId = Number(clusterId);
        setSelectedClusters((prev) => {
            if (prev.includes(numericId)) {
                return prev.filter((item) => item !== numericId);
            }
            return [...prev, numericId];
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-char-900 mb-4">
                {title}
            </h3>
            {stats.length === 0 ? (
                <p className="text-sm text-gray-500">
                    Không có dữ liệu cụm trong khoảng thời gian đã chọn.
                </p>
            ) : (
                <div className="space-y-4">
                    <div className="rounded-lg border border-beige-200 p-3">
                        <div className="flex items-center justify-between mb-3 gap-2">
                            <p className="text-sm font-medium text-char-800">
                                So sánh cụm (Radar)
                            </p>
                            {selectedClusters.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedClusters([])}
                                    className="text-xs px-2 py-1 rounded-md border border-beige-300 text-char-700 hover:bg-beige-50">
                                    Hiện tất cả
                                </button>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                            Mỗi trục được chuẩn hóa theo mức cao nhất trong kỳ
                            lọc hiện tại (100%). Vùng càng rộng trên một trục
                            nghĩa là cụm đó nổi bật hơn ở chỉ số tương ứng.
                        </p>
                        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-center">
                            <div className="space-y-2 text-xs">
                                {radarSeries.map((series) => (
                                    <button
                                        type="button"
                                        key={`legend-${series.cluster}`}
                                        onClick={() =>
                                            toggleCluster(series.cluster)
                                        }
                                        className={`w-full text-left flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${
                                            !selectedClusters.length ||
                                            selectedClusters.includes(
                                                Number(series.cluster),
                                            )
                                                ? "bg-beige-50"
                                                : "opacity-45 hover:opacity-80"
                                        }`}>
                                        <span
                                            className="inline-block w-2.5 h-2.5 rounded-full"
                                            style={{
                                                backgroundColor: series.color,
                                            }}
                                        />
                                        <span className="text-char-700 truncate flex-1">
                                            C{series.cluster}: {series.label}
                                        </span>
                                        <span className="text-[10px] text-gray-500">
                                            {selectedClusters.includes(
                                                Number(series.cluster),
                                            )
                                                ? "Đang chọn"
                                                : selectedClusters.length
                                                  ? "Ẩn"
                                                  : "Hiện"}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-center">
                                <svg
                                    viewBox="-90 -60 420 370"
                                    className="w-96 h-96 overflow-visible"
                                    role="img"
                                    aria-label="Radar chart so sánh các cụm">
                                    {[0.25, 0.5, 0.75, 1].map((level) => {
                                        const ringPoints = metrics.map(
                                            (_, index) =>
                                                toRadarPoint(
                                                    110,
                                                    110,
                                                    76,
                                                    metrics.length,
                                                    index,
                                                    level,
                                                ),
                                        );
                                        return (
                                            <polygon
                                                key={`ring-${level}`}
                                                points={toPointString(
                                                    ringPoints,
                                                )}
                                                fill="none"
                                                stroke="#E5E7EB"
                                                strokeWidth="1"
                                            />
                                        );
                                    })}

                                    {radarAxis.map((axis) => (
                                        <g key={`axis-${axis.key}`}>
                                            <line
                                                x1="110"
                                                y1="110"
                                                x2={axis.axisX}
                                                y2={axis.axisY}
                                                stroke="#D1D5DB"
                                                strokeWidth="1"
                                            />
                                            <text
                                                x={axis.labelX}
                                                y={axis.labelY}
                                                textAnchor={axis.textAnchor}
                                                dominantBaseline={
                                                    axis.textBaseline
                                                }
                                                fontSize="12"
                                                fontWeight="500"
                                                fill="#6B7280">
                                                {axis.label}
                                            </text>
                                        </g>
                                    ))}

                                    {visibleRadarSeries.map((series) => (
                                        <g key={`series-${series.cluster}`}>
                                            <polygon
                                                points={toPointString(
                                                    series.points,
                                                )}
                                                fill={series.color}
                                                fillOpacity="0.16"
                                                stroke={series.color}
                                                strokeWidth="2"
                                            />
                                            {series.points.map((point, idx) => (
                                                <circle
                                                    key={`point-${series.cluster}-${idx}`}
                                                    cx={point.x}
                                                    cy={point.y}
                                                    r="2.5"
                                                    fill={series.color}
                                                />
                                            ))}
                                        </g>
                                    ))}
                                </svg>
                            </div>
                        </div>
                    </div>

                    {normalizedStats.map((item) => {
                        const insights = buildFeatureInsights(
                            item.avgFeatures,
                            type,
                        );
                        const dominant = getDominantMetricInsight(
                            item.avgFeatures,
                            metrics,
                            radarMaxByMetric,
                        );
                        const percent = total
                            ? Math.round((item.safeCount / total) * 100)
                            : 0;
                        const clusterColor =
                            clusterColorMap[Number(item.cluster)] || "#4F46E5";

                        return (
                            <div
                                key={item.cluster}
                                className="rounded-lg border p-3 space-y-2"
                                style={{ borderColor: `${clusterColor}55` }}>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="text-char-700">
                                        <span className="font-medium">
                                            Cluster {item.cluster}
                                        </span>
                                        <span className="text-gray-500 ml-2">
                                            {item.label || "Chưa có nhãn"}
                                        </span>
                                    </div>
                                    <span className="font-medium text-char-900">
                                        {item.safeCount} ({percent}%)
                                    </span>
                                </div>
                                {dominant && (
                                    <div className="text-xs rounded-md px-2 py-1 bg-slate-50 text-slate-700">
                                        Điểm nổi bật:{" "}
                                        <span className="font-medium">
                                            {dominant.label}
                                        </span>{" "}
                                        ({dominant.valueText}, mức{" "}
                                        {dominant.ratioPercent}% so với cụm mạnh
                                        nhất trục này)
                                    </div>
                                )}
                                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            backgroundColor: clusterColor,
                                            width: `${Math.max((item.safeCount / max) * 100, 6)}%`,
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    {insights.map((insight) => (
                                        <div
                                            key={insight.label}
                                            className="bg-beige-50 rounded-md px-2 py-1">
                                            <p className="text-gray-500">
                                                {insight.label}
                                            </p>
                                            <p className="text-char-800 font-medium truncate">
                                                {insight.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
export default ClusterChart;
