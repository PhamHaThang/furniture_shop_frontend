import api from "./api";
export const promotionService = {
  getAllPromotions: (params) => api.get("/promotions", { params }),
  validatePromotionCode: (code, orderAmount) =>
    api.post("/promotions/validate", { code, orderAmount }),
};
