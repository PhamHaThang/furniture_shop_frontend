import api from "./api";
export const cartService = {
  getCart: () => api.get("/cart"),
  addToCart: (productId, quantity) =>
    api.post("/cart/items", { productId, quantity }),
  updateCartItem: (productId, quantity) =>
    api.put(`/cart/items/${productId}`, { quantity }),
  removeFromCart: (productId) => api.delete(`/cart/items/${productId}`),
  clearCart: () => api.delete("/cart"),
  applyDiscount: (code) => api.post("/cart/discount", { code }),
  removeDiscount: () => api.delete("/cart/discount"),
};
