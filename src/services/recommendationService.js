import api from "./api";

export const recommendationService = {
    getMLHealth: () => api.get("/recommendations/health"),

    getSimilarProducts: (productId, limit = 8) =>
        api.get(`/recommendations/product/${productId}/similar`, {
            params: { limit },
        }),

    getContentBasedForMe: (limit = 8) =>
        api.get("/recommendations/me/content-based", {
            params: { limit },
        }),

    getCollaborativeForMe: (limit = 8) =>
        api.get("/recommendations/me/collaborative", {
            params: { limit },
        }),

    getHybridForMe: (limit = 8) =>
        api.get("/recommendations/me/hybrid", {
            params: { limit },
        }),
};
