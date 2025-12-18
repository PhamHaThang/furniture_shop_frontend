import api from "./api";
export const productService = {
  getAllProducts: (params) => api.get("/products", { params }),
  getFeaturedProducts: (params) => api.get("/products/featured", { params }),
  getNewArrivals: (params) => api.get("/products/new-arrivals", { params }),
  getBestSellers: (params) => api.get("/products/best-sellers", { params }),
  getRelatedProducts: (productId, params) =>
    api.get(`/products/related/${productId}`, { params }),
  getProductBySlug: (slug) => api.get(`/products/${slug}`),
};
