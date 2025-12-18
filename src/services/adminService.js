import api from "./api";

export const adminService = {
  // ========== DASHBOARD STATS ==========
  getDashboardStats: async () => {
    const [usersRes, productsRes, ordersRes, orderStatsRes] = await Promise.all(
      [
        api.get("/admin/users?limit=1"),
        api.get("/admin/products?limit=1"),
        api.get("/admin/orders?limit=1"),
        api.get("/admin/orders/stats"),
      ]
    );
    return {
      totalUsers: usersRes.pagination?.total || 0,
      totalProducts: productsRes.pagination?.total || 0,
      totalOrders: ordersRes.pagination?.total || 0,
      orderStats: orderStatsRes.stats,
    };
  },

  // ========== USERS MANAGEMENT ==========
  getUsers: (params) => api.get("/admin/users", { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  createUser: (userData) => api.post("/admin/users", userData),
  updateUserById: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUserById: (id) => api.delete(`/admin/users/${id}`),

  // ========== PRODUCTS MANAGEMENT ==========
  getProducts: (params) => api.get("/admin/products", { params }),
  getProductById: (id) => api.get(`/admin/products/${id}`),
  createProduct: (productData) => api.post("/admin/products", productData),
  updateProduct: (id, productData) =>
    api.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),

  // ========== CATEGORIES MANAGEMENT ==========
  getCategories: (params) => api.get("/admin/categories", { params }),
  createCategory: (categoryData) => api.post("/admin/categories", categoryData),
  getCategoryById: (id) => api.get(`/admin/categories/${id}`),
  updateCategory: (id, categoryData) =>
    api.put(`/admin/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  // ========== BRANDS MANAGEMENT ==========
  getBrands: (params) => api.get("/admin/brands", { params }),
  createBrand: (brandData) => api.post("/admin/brands", brandData),
  getBrandById: (id) => api.get(`/admin/brands/${id}`),
  updateBrand: (id, brandData) => api.put(`/admin/brands/${id}`, brandData),
  deleteBrand: (id) => api.delete(`/admin/brands/${id}`),

  // ========== ORDERS MANAGEMENT ==========
  getOrders: (params) => api.get("/admin/orders", { params }),
  getOrderById: (id) => api.get(`/admin/orders/${id}`),
  getOrderStats: () => api.get("/admin/orders/stats"),
  updateOrderStatus: (id, status) =>
    api.put(`/admin/orders/${id}/status`, { status }),
  updatePaymentStatus: (id, paymentStatus) =>
    api.put(`/admin/orders/${id}/payment-status`, { paymentStatus }),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`),

  // ========== PROMOTIONS MANAGEMENT ==========
  getPromotions: (params) => api.get("/admin/promotions", { params }),
  getPromotionById: (id) => api.get(`/admin/promotions/${id}`),
  createPromotion: (promotionData) =>
    api.post("/admin/promotions", promotionData),
  updatePromotion: (id, promotionData) =>
    api.put(`/admin/promotions/${id}`, promotionData),
  deletePromotion: (id) => api.delete(`/admin/promotions/${id}`),

  // ========== REVIEW MANAGEMENT ==========
  getReviews: (params) => api.get("/admin/reviews", { params }),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
};
