import api from "./api";

export const reviewService = {
  getReviewsByProductId: (productId, params) =>
    api.get(`/reviews/product/${productId}`, { params }),
  createReview: (reviewData) => api.post("/reviews", reviewData),
  updateReview: (reviewId, reviewData) =>
    api.put(`/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};
