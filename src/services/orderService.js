import api from "./api";

export const orderService = {
  createOrder: (orderData) => api.post("/orders", orderData),
  getUserOrders: (params) => api.get("/orders", { params }),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
  getOrderByCode: (orderCode) => api.get(`/orders/code/${orderCode}`),
  cancelOrder: (orderId) => api.put(`/orders/${orderId}/cancel`),
};
