import api from "./api";

export const userService = {
  getProfile: () => api.get("/users/me"),
  updateProfile: (data) => api.put("/users/me", data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  changePassword: (data) => api.put("/users/me/password", data),
  getAddresses: () => api.get("/users/me/address"),
  addAddress: (data) => api.post("/users/me/address", data),
  updateAddress: (id, data) => api.put(`/users/me/address/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/me/address/${id}`),
};
