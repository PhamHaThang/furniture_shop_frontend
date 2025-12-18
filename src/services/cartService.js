import api from "./api";
export const cartService = {
  getCart: () => api.get("/cart"),
  addToCart: (productId, quantity) =>
    api.post("/cart", { productId, quantity }),
  updateCartItem: (productId, quantity) =>
    api.put(`/cart/${productId}`, { quantity }),
  removeFromCart: (productId) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete("/cart"),
  applyDiscount: (code) => api.post("/cart/discount", { code }),
  removeDiscount: () => api.delete("/cart/discount"),
};
