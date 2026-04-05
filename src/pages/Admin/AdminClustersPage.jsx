import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { adminService } from "../../services";
import { Button } from "../../components";
import { ClusterChart, MLAnalyticsFilters } from "./components";
import { getPresetDates, buildClusterStats } from "../../utils";
import { TIME_RANGE_OPTIONS } from "../../config/constants";

const AdminClustersPage = () => {
    const [loading, setLoading] = useState(false);
    const [clusters, setClusters] = useState(4);
    const [timeRange, setTimeRange] = useState("30d");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [productClustersRaw, setProductClustersRaw] = useState(null);
    const [userClustersRaw, setUserClustersRaw] = useState(null);

    useEffect(() => {
        const preset = getPresetDates(timeRange);
        setStartDate(preset.startDate);
        setEndDate(preset.endDate);
    }, [timeRange]);

    const fetchClusters = async () => {
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
            const params = { clusters };
            if (startDate) {
                params.startDate = `${startDate}T00:00:00.000Z`;
            }
            if (endDate) {
                params.endDate = `${endDate}T23:59:59.999Z`;
            }

            const [productsResponse, usersResponse] = await Promise.all([
                adminService.getMLClusters({
                    ...params,
                    clusterType: "products",
                }),
                adminService.getMLClusters({ ...params, clusterType: "users" }),
            ]);

            setProductClustersRaw(productsResponse?.clustering || null);
            setUserClustersRaw(usersResponse?.clustering || null);
        } catch (error) {
            toast.error(error.message || "Không thể tải dữ liệu cluster");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (timeRange !== "all" && !endDate) return;
        fetchClusters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clusters, startDate, endDate, timeRange]);

    const productClusterStats = useMemo(
        () => buildClusterStats(productClustersRaw || []),
        [productClustersRaw],
    );

    const userClusterStats = useMemo(
        () => buildClusterStats(userClustersRaw || []),
        [userClustersRaw],
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-char-900">
                        Admin Clusters
                    </h1>
                    <p className="text-gray-500">
                        Theo dõi phân cụm KMeans cho sản phẩm và người dùng theo
                        thời gian.
                    </p>
                </div>
                <Button
                    onClick={fetchClusters}
                    variant="outline"
                    leftIcon={
                        <RefreshCw
                            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                        />
                    }>
                    Làm mới dữ liệu
                </Button>
            </div>

            {loading && (
                <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Đang tải và cập nhật dữ liệu cụm...
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
                clusters={clusters}
                onClusterChange={setClusters}
            />

            {loading &&
            !productClusterStats.length &&
            !userClusterStats.length ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
                    Đang tải dữ liệu cluster...
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <ClusterChart
                        title="KMeans Clusters - Products"
                        stats={productClusterStats}
                        type="products"
                    />
                    <ClusterChart
                        title="KMeans Clusters - Users"
                        stats={userClusterStats}
                        type="users"
                    />
                </div>
            )}
        </div>
    );
};

export default AdminClustersPage;
