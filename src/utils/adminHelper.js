import { toDateString } from "./format";

export const getPresetDates = (range) => {
    const now = new Date();
    const end = toDateString(now);

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

export const buildClusterStats = (clusterRows = []) => {
    const clusterMap = {};

    clusterRows.forEach((item) => {
        const key = item.cluster;
        if (!clusterMap[key]) {
            clusterMap[key] = 0;
        }
        clusterMap[key] += 1;
    });

    return Object.entries(clusterMap)
        .map(([cluster, count]) => ({ cluster: Number(cluster), count }))
        .sort((a, b) => a.cluster - b.cluster);
};
