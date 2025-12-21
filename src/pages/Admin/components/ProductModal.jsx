import { useState, useEffect } from "react";
import { X, Upload, ImageIcon } from "lucide-react";
import { uploadService } from "../../../services";
import toast from "react-hot-toast";
import { Button, Input, Select, Textarea } from "../../../components";

const ProductModal = ({
  isOpen,
  onClose,
  product,
  onSave,
  categories,
  brands,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    brand: "",
    stock: "",
    images: [],
    model3DUrl: "",
    dimensions: { width: "", height: "", length: "" },
    colors: [],
    materials: [],
    tags: [],
    isFeatured: false,
  });
  // Lưu file objects mới để upload sau
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newModel3DFile, setNewModel3DFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValues, setInputValues] = useState({
    color: "",
    material: "",
    tag: "",
  });
  const resetForm = () => {
    // Cleanup preview URLs
    newImageFiles.forEach((item) => {
      if (item.preview) URL.revokeObjectURL(item.preview);
    });
    if (newModel3DFile?.preview) URL.revokeObjectURL(newModel3DFile.preview);

    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "",
      sku: "",
      brand: "",
      stock: "",
      images: [],
      model3DUrl: "",
      dimensions: { width: "", height: "", length: "" },
      colors: [],
      materials: [],
      tags: [],
      isFeatured: false,
    });
    setNewImageFiles([]);
    setNewModel3DFile(null);
    setInputValues({ color: "", material: "", tag: "" });
  };
  useEffect(() => {
    if (product) {
      // Cleanup old previews
      newImageFiles.forEach((item) => {
        if (item.preview) URL.revokeObjectURL(item.preview);
      });
      if (newModel3DFile?.preview) URL.revokeObjectURL(newModel3DFile.preview);

      setFormData({
        name: product.name || "",
        description: product.description || "",
        sku: product.sku || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        category: product.category?._id || "",
        brand: product.brand?._id || "",
        stock: product.stock || "",
        images: product.images || [],
        model3DUrl: product.model3DUrl || "",
        dimensions: product.dimensions || { width: "", height: "", length: "" },
        colors: product.colors || [],
        materials: product.materials || [],
        tags: product.tags || [],
        isFeatured: product.isFeatured || false,
      });
      setNewImageFiles([]);
      setNewModel3DFile(null);
    } else {
      resetForm();
    }
  }, [product]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      newImageFiles.forEach((item) => {
        if (item.preview) URL.revokeObjectURL(item.preview);
      });
      if (newModel3DFile?.preview) URL.revokeObjectURL(newModel3DFile.preview);
    };
  }, [newImageFiles, newModel3DFile]);
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Kiểm tra số lượng ảnh tối đa (6 ảnh)
    const currentImageCount = formData.images.length;
    const maxImages = 6;

    if (currentImageCount >= maxImages) {
      toast.error(`Chỉ được tải lên tối đa ${maxImages} ảnh`);
      return;
    }

    const remainingSlots = maxImages - currentImageCount;
    const filesToUpload = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.warning(
        `Chỉ thêm được ${remainingSlots} ảnh nữa (tối đa ${maxImages} ảnh)`
      );
    }

    // Tạo preview cho các file mới
    const newFiles = filesToUpload.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));

    setNewImageFiles((prev) => [...prev, ...newFiles]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles.map((f) => f.preview)],
    }));

    toast.success(
      `Đã thêm ${filesToUpload.length} ảnh. Ảnh sẽ được tải lên khi bạn lưu sản phẩm.`
    );
  };
  const removeImage = (index) => {
    const imageUrl = formData.images[index];

    // Tìm và xóa file preview nếu là ảnh mới
    const fileIndex = newImageFiles.findIndex((f) => f.preview === imageUrl);
    if (fileIndex !== -1) {
      URL.revokeObjectURL(newImageFiles[fileIndex].preview);
      setNewImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleModel3DUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type (GLB, GLTF)
    const validTypes = [".glb", ".gltf"];
    const fileExtension = file.name
      .toLowerCase()
      .slice(file.name.lastIndexOf("."));
    if (!validTypes.includes(fileExtension)) {
      toast.error("Chỉ hỗ trợ file .glb hoặc .gltf");
      return;
    }
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File model 3D không được vượt quá 10MB");
      return;
    }

    // Cleanup old preview if exists
    if (newModel3DFile?.preview) {
      URL.revokeObjectURL(newModel3DFile.preview);
    }

    const preview = URL.createObjectURL(file);
    setNewModel3DFile({ file, preview, isNew: true });
    setFormData((prev) => ({
      ...prev,
      model3DUrl: preview,
    }));
    toast.success(
      "Đã thêm model 3D. File sẽ được tải lên khi bạn lưu sản phẩm."
    );
  };

  const removeModel3D = () => {
    // Cleanup preview if exists
    if (newModel3DFile?.preview) {
      URL.revokeObjectURL(newModel3DFile.preview);
    }
    setNewModel3DFile(null);
    setFormData((prev) => ({
      ...prev,
      model3DUrl: "",
    }));
  };
  const handleDimensionsChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [field]: value,
      },
    }));
  };

  const addArrayItem = (field, inputKey) => {
    const value = inputValues[inputKey];
    if (value && value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      setInputValues((prev) => ({ ...prev, [inputKey]: "" }));
    }
  };
  const handleInputChange = (key, value) => {
    setInputValues((prev) => ({ ...prev, [key]: value }));
  };
  const handleInputKeyPress = (e, field, inputKey) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addArrayItem(field, inputKey);
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Tên sản phẩm là bắt buộc");
      return false;
    }
    if (!formData.sku.trim()) {
      toast.error("Mã SKU là bắt buộc");
      return false;
    }
    if (
      !formData.price ||
      isNaN(formData.price) ||
      Number(formData.price) < 0
    ) {
      toast.error("Giá bán không hợp lệ");
      return false;
    }
    if (
      formData.originalPrice &&
      (isNaN(formData.originalPrice) || Number(formData.originalPrice) < 0)
    ) {
      toast.error("Giá gốc không hợp lệ");
      return false;
    }
    if (!formData.category) {
      toast.error("Danh mục là bắt buộc");
      return false;
    }
    if (!formData.brand) {
      toast.error("Thương hiệu là bắt buộc");
      return false;
    }
    if (
      !formData.stock ||
      isNaN(formData.stock) ||
      Number(formData.stock) < 0
    ) {
      toast.error("Số lượng tồn kho không hợp lệ");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      // Upload ảnh mới nếu có
      let uploadedImageUrls = [];
      if (newImageFiles.length > 0) {
        setUploading(true);
        toast.loading("Đang tải ảnh lên...", { id: "upload-images" });
        try {
          const uploadPromises = newImageFiles.map((item) =>
            uploadService.uploadImage(item.file)
          );
          const results = await Promise.all(uploadPromises);
          uploadedImageUrls = results.map((r) => r.data.url);
          toast.success("Tải ảnh lên thành công", { id: "upload-images" });
        } catch (error) {
          toast.error(error?.message || "Không thể tải ảnh lên", {
            id: "upload-images",
          });
          throw error;
        } finally {
          setUploading(false);
        }
      }

      // Upload model 3D mới nếu có
      let uploadedModel3DUrl = formData.model3DUrl;
      if (newModel3DFile?.file) {
        setUploading(true);
        toast.loading("Đang tải model 3D lên...", { id: "upload-model" });
        try {
          const result = await uploadService.uploadModel3D(newModel3DFile.file);
          uploadedModel3DUrl = result.data.url;
          toast.success("Tải model 3D lên thành công", { id: "upload-model" });
        } catch (error) {
          toast.error(error?.message || "Không thể tải model 3D lên", {
            id: "upload-model",
          });
          throw error;
        } finally {
          setUploading(false);
        }
      }

      // Lọc ra các URL ảnh cũ (không phải preview) và thêm URL mới
      const oldImageUrls = formData.images.filter(
        (url) => !newImageFiles.some((f) => f.preview === url)
      );
      const finalImageUrls = [...oldImageUrls, ...uploadedImageUrls];

      const dimensions = {
        width: formData.dimensions.width
          ? Number(formData.dimensions.width)
          : undefined,
        height: formData.dimensions.height
          ? Number(formData.dimensions.height)
          : undefined,
        length: formData.dimensions.length
          ? Number(formData.dimensions.length)
          : undefined,
      };
      const data = {
        ...formData,
        images: finalImageUrls,
        model3DUrl: uploadedModel3DUrl,
        price: Number(formData.price),
        originalPrice: formData.originalPrice
          ? Number(formData.originalPrice)
          : undefined,
        stock: Number(formData.stock),
        dimensions:
          dimensions.width || dimensions.height || dimensions.length
            ? dimensions
            : undefined,
      };

      await onSave(data, product);
      onClose();
    } catch (error) {
      toast.error(error?.message || "Không thể lưu sản phẩm");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b z-10">
          <h2 className="text-lg font-semibold text-char-900">
            {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <button
            onClick={() => {
              onClose();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tên sản phẩm *"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full"
              required
            />
            <Input
              label="Mã SKU *"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              className="w-full"
              required
            />
            <Input
              label="Giá bán *"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full"
              required
              min="0"
            />
            <Input
              label="Giá gốc"
              type="number"
              value={formData.originalPrice}
              onChange={(e) =>
                setFormData({ ...formData, originalPrice: e.target.value })
              }
              className="w-full"
              min="0"
            />
            <Select
              label="Danh mục *"
              placeholder="Chọn danh mục"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              options={categories.map((cat) => ({
                value: cat._id,
                label: cat.name,
              }))}
              required
            />
            <Select
              label="Thương hiệu *"
              placeholder="Chọn thương hiệu"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              options={brands.map((brand) => ({
                value: brand._id,
                label: brand.name,
              }))}
              required
            />
            <Input
              label="Số lượng tồn kho *"
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              className="w-full"
              required
              min="0"
            />
          </div>

          {/* Description */}
          <Textarea
            label="Mô tả"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full "
          />

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh
            </label>
            <div className="flex flex-wrap gap-3">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 group">
                  <img
                    src={img}
                    alt={`Product ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                {uploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent"></div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Tải ảnh</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* Model 3D */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model 3D (GLB/GLTF)
            </label>
            {formData.model3DUrl ? (
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700 font-medium">
                      Model 3D đã tải lên
                    </span>
                  </div>
                  <a
                    href={formData.model3DUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-500 hover:underline break-all">
                    {formData.model3DUrl}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={removeModel3D}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-500 border-t-transparent"></div>
                    <span className="text-sm text-gray-600">
                      Đang tải lên...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Nhấp để tải lên model 3D
                    </span>
                    <span className="text-xs text-gray-500">
                      Hỗ trợ .glb, .gltf (tối đa 50MB)
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept=".glb,.gltf"
                  onChange={handleModel3DUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kích thước (cm)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <Input
                type="number"
                placeholder="Rộng"
                value={formData.dimensions.width}
                onChange={(e) =>
                  handleDimensionsChange("width", e.target.value)
                }
                min="0"
                required
              />
              <Input
                type="number"
                placeholder="Cao"
                value={formData.dimensions.height}
                onChange={(e) =>
                  handleDimensionsChange("height", e.target.value)
                }
                min="0"
                required
              />
              <Input
                type="number"
                placeholder="Dài"
                value={formData.dimensions.length}
                onChange={(e) =>
                  handleDimensionsChange("length", e.target.value)
                }
                min="0"
                required
              />
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-char-700 mb-1">
              Màu sắc
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                value={inputValues.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                onKeyPress={(e) => handleInputKeyPress(e, "colors", "color")}
                placeholder="Nhập màu sắc (Enter để thêm)"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => addArrayItem("colors", "color")}>
                Thêm
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.colors.map((color, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                  {color}
                  <button
                    type="button"
                    onClick={() => removeArrayItem("colors", idx)}
                    className="hover:text-red-500 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chất liệu
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                value={inputValues.material}
                onChange={(e) => handleInputChange("material", e.target.value)}
                onKeyPress={(e) =>
                  handleInputKeyPress(e, "materials", "material")
                }
                placeholder="Nhập chất liệu (Enter để thêm)"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => addArrayItem("materials", "material")}>
                Thêm
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.materials.map((material, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                  {material}
                  <button
                    type="button"
                    onClick={() => removeArrayItem("materials", idx)}
                    className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                type="text"
                value={inputValues.tag}
                onChange={(e) => handleInputChange("tag", e.target.value)}
                onKeyPress={(e) => handleInputKeyPress(e, "tags", "tag")}
                placeholder="Nhập tag (Enter để thêm)"
                className="flex-1"
              />
              <Button type="button" onClick={() => addArrayItem("tags", "tag")}>
                Thêm
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeArrayItem("tags", idx)}
                    className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Sản phẩm nổi bật</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                onClose();
              }}
              className="flex-1 ">
              Hủy
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading || uploading}
              className="flex-1 ">
              {loading || uploading
                ? "Đang xử lý..."
                : product
                ? "Cập nhật"
                : "Tạo mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
