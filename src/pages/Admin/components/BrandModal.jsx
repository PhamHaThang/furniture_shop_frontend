import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminService, uploadService } from "../../../services";
import { Button, Input, Textarea } from "../../../components";
import { Upload, X } from "lucide-react";

const BrandModal = ({ isOpen, onClose, brand, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
    });
  };
  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || "",
        description: brand.description || "",
        image: brand.image || "",
      });
    } else {
      resetForm();
    }
  }, [brand, isOpen]);
  const handleImageUpload = async (e) => {
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
      toast.error("Tên thương hiệu là bắt buộc");
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
      // If image is a base64 string, upload it
      // If image is base64, upload to Cloudinary first
      if (imageUrl && imageUrl.startsWith("data:image/")) {
        setUploading(true);
        try {
          // Convert base64 to blob
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], "brand-logo.jpg", { type: blob.type });

          // Upload to Cloudinary
          const result = await uploadService.uploadImage(file);
          imageUrl = result.data?.url;
        } catch {
          toast.error("Không thể tải ảnh lên");
          setLoading(false);
          setUploading(false);
          return;
        } finally {
          setUploading(false);
        }
      }
      const data = {
        ...formData,
        image: imageUrl,
      };
      if (brand) {
        await adminService.updateBrand(brand._id, data);
        toast.success("Thương hiệu đã được cập nhật thành công.");
      } else {
        await adminService.createBrand(data);
        toast.success("Thương hiệu đã được tạo thành công.");
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-char-900">
            {brand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
          </h2>
          <button
            onClick={() => {
              onClose();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo
            </label>
            <div className="flex items-center gap-4">
              {formData.image ? (
                <div className="flex items-center gap-3">
                  <div className="relative w-24 h-24 group">
                    <img
                      src={formData.image}
                      alt="Brand logo"
                      className="w-full h-full object-contain rounded-lg bg-gray-50 p-2"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <label className="px-3 py-2 text-sm border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 focus:ring-primary-300 focus:outline-none cursor-pointer transition-colors ">
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
            label="Tên thương hiệu"
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

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                onClose();
              }}
              className="flex-1">
              Hủy
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="flex-1 "
              loading={loading}>
              {loading ? "Đang xử lý..." : brand ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrandModal;
