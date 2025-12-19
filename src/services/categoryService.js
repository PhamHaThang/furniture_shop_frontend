import api from "./api";
export const categoryService = {
  getAllCategories: (params) => {
    return api.get("/categories", { params });
  },
  getCategoryBySlug: (slug) => {
    return api.get(`/categories/${slug}`);
  },
  getCategoryTree: () => {
    return api.get("/categories/tree");
  },
};
