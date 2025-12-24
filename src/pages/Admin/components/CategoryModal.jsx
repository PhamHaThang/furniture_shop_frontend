import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { adminService, uploadService } from "../../../services";
import toast from "react-hot-toast";
import { Button, Input, Select, Textarea } from "../../../components";

const CategoryModal = ({ isOpen, onClose, category, onSave, categories }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    parentCategory: "",
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      parentCategory: "",
    });
  };
  useEffect(() => {
    if (isOpen) {
      if (category) {
        setFormData({
          name: category.name || "",
          description: category.description || "",
          image: category.image || "",
          parentCategory:
            category.parentCategory?._id || category.parentCategory || "",
        });
      } else resetForm();
    }
  }, [category, isOpen]);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    // Preview image immediately using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Tên danh mục là bắt buộc");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      let imageUrl = formData.image;

      // If image is base64, upload to Cloudinary first
      if (imageUrl && imageUrl.startsWith("data:image/")) {
        setUploading(true);
        try {
          // Convert base64 to blob
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], "category-image.jpg", {
            type: blob.type,
          });

          // Upload to Cloudinary
          const result = await uploadService.uploadImage(file);
          imageUrl = result.data.url;
        } catch (error) {
          toast.error(error.message || "Không thể tải ảnh lên");
          setLoading(false);
          setUploading(false);
        } finally {
          setUploading(false);
        }
      }

      const data = { ...formData, image: imageUrl };
      if (!data.parentCategory) delete data.parentCategory;

      if (category) {
        await adminService.updateCategory(category._id, data);
        toast.success("Cập nhật danh mục thành công");
      } else {
        await adminService.createCategory(data);
        toast.success("Tạo danh mục thành công");
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  // Filter out current category from parent options
  const parentOptions = categories.filter((c) => c._id !== category?._id);
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-char-900">
            {category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh
            </label>
            <div className="flex items-center gap-4">
              {formData.image ? (
                <div className="flex items-center gap-3">
                  <div className="relative w-24 h-24 group">
                    <img
                      src={formData.image}
                      alt="Category"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <label className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    Thay đổi
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              ) : (
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                  {uploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent"></div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">
                        Tải ảnh
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>
          <Input
            label="Tên danh mục *"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Textarea
            label="Mô tả"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
          />
          <Select
            label="Danh mục cha"
            placeholder=""
            options={[{ value: "", label: "Không có danh mục cha" }].concat(
              parentOptions.map((cat) => ({
                value: cat._id,
                label: cat.name,
              }))
            )}
            value={formData.parentCategory}
            onChange={(value) =>
              setFormData({ ...formData, parentCategory: value })
            }
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                onClose();
              }}>
              Hủy
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
              loading={loading}>
              {loading ? "Đang xử lý..." : category ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CategoryModal;
