import api from "./api";
export const brandService = {
  getAllBrands: (params) => {
    return api.get("/brands", { params });
  },
  getBrandBySlug: (slug) => {
    return api.get(`/brands/${slug}`);
  },
  getPopularBrands: (params) => {
    return api.get("/brands/popular", { params });
  },
};
