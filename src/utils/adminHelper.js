import { toDateString } from "./format";

export const getPresetDates = (range) => {
    const now = new Date();
    const end = toDateString(now);
    if (range === "all") {
        return { startDate: "", endDate: "" };
    }
    if (range === "custom") {
        return { startDate: "", endDate: end };
    }

    const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
    const start = new Date(now);
    start.setDate(now.getDate() - days + 1);

    return {
        startDate: toDateString(start),
        endDate: end,
    };
};

export const buildClusterStats = (clusterData = []) => {
    if (
        clusterData &&
        typeof clusterData === "object" &&
        !Array.isArray(clusterData)
    ) {
        const summaries = Array.isArray(clusterData.cluster_summaries)
            ? clusterData.cluster_summaries
            : [];

        if (summaries.length > 0) {
            return summaries
                .map((item) => ({
                    cluster: Number(item.cluster),
                    label: item.label || `Cluster ${item.cluster}`,
                    count: Number(item.size) || 0,
                    avgFeatures: item.avg_features || {},
                }))
                .sort((a, b) => a.cluster - b.cluster);
        }
    }

    const clusterRows = Array.isArray(clusterData)
        ? clusterData
        : clusterData?.clusters || [];
    const clusterMap = {};

    clusterRows.forEach((item) => {
        const key = item.cluster;
        if (!clusterMap[key]) {
            clusterMap[key] = {
                count: 0,
                label: item.cluster_label || `Cluster ${key}`,
                avgFeatures: item.features || {},
            };
        }
        clusterMap[key].count += 1;
    });

    return Object.entries(clusterMap)
        .map(([cluster, data]) => ({
            cluster: Number(cluster),
            label: data.label,
            count: data.count,
            avgFeatures: data.avgFeatures || {},
        }))
        .sort((a, b) => a.cluster - b.cluster);
};
export const normalizeStatusKey = (value) =>
    String(value || "")
        .trim()
        .toLowerCase();
