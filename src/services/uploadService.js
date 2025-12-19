import api from "./api";
export const uploadService = {
  // Upload single image
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  // Upload multiple images
  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });
    return api.post("/upload/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Upload 3D model
  upload3DModel: (file) => {
    const formData = new FormData();
    formData.append("model3D", file);
    return api.post("/upload/3d-model", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete file
  deleteFile: (publicId, resourceType = "image") => {
    return api.delete("/upload/delete", {
      data: { publicId, resourceType },
    });
  },

  // Delete multiple files
  deleteMultipleFiles: (publicIds, resourceType = "image") => {
    return api.delete("/upload/delete-multiple", {
      data: { publicIds, resourceType },
    });
  },
};
