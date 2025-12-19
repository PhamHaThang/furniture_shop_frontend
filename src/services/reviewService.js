import api from "./api";

export const reviewService = {
  getReviewsByProductId: (productId, params) =>
    api.get(`/reviews/product/${productId}`, { params }),
  getMyReviewedProducts: (productIds) =>
    api.get("/reviews/my-reviews/products", {
      params: productIds ? { productIds: productIds.join(',') } : {}
    }),
  createReview: (reviewData) => api.post("/reviews", reviewData),
  updateReview: (reviewId, reviewData) =>
    api.put(`/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};
