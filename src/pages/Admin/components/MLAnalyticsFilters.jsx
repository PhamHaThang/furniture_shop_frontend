import { Select } from "../../../components";

import { CLUSTER_OPTIONS } from "../../../config/constants";
const MLAnalyticsFilters = ({
    timeRange,
    onTimeRangeChange,
    timeRangeOptions = [],
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    clusters,
    onClusterChange,
    showClusterSelect = true,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select
                    label="Khoảng thời gian"
                    value={timeRange}
                    onChange={(e) => onTimeRangeChange(e.target.value)}
                    options={timeRangeOptions}
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
                                    onStartDateChange(e.target.value)
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
                                onChange={(e) =>
                                    onEndDateChange(e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                        </div>
                    </>
                )}

                {showClusterSelect && (
                    <Select
                        label="Số cụm KMeans"
                        value={String(clusters)}
                        onChange={(e) =>
                            onClusterChange(Number(e.target.value))
                        }
                        options={CLUSTER_OPTIONS}
                    />
                )}
            </div>
        </div>
    );
};

export default MLAnalyticsFilters;
