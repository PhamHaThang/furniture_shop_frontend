const ClusterChart = ({ title, stats = [] }) => {
    const max = Math.max(...stats.map((s) => s.count), 1);

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
                <div className="space-y-3">
                    {stats.map((item) => (
                        <div key={item.cluster} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-char-700">
                                    Cluster {item.cluster}
                                </span>
                                <span className="font-medium text-char-900">
                                    {item.count}
                                </span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                <div
                                    className="h-full bg-primary-500 rounded-full"
                                    style={{
                                        width: `${Math.max((item.count / max) * 100, 6)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default ClusterChart;
