import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { adminService } from "../../../services";
import { Button, Input, Select, Textarea } from "../../../components";
const PromotionModal = ({ isOpen, onClose, promotion, onSave }) => {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minSpend: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minSpend: "",
      startDate: "",
      endDate: "",
      isActive: true,
    });
  };
  useEffect(() => {
    if (promotion) {
      setFormData({
        code: promotion.code || "",
        description: promotion.description || "",
        discountType: promotion.discountType || "percentage",
        discountValue: promotion.discountValue || "",
        minSpend: promotion.minSpend || "",
        startDate: promotion.startDate ? promotion.startDate.split("T")[0] : "",
        endDate: promotion.endDate ? promotion.endDate.split("T")[0] : "",
        isActive: promotion.isActive !== false,
      });
    } else resetForm();
  }, [promotion]);

  const validateForm = () => {
    if (!formData.code.trim()) {
      toast.error("Mã khuyến mãi không được để trống");
      return false;
    }
    if (
      !formData.discountValue ||
      isNaN(formData.discountValue) ||
      Number(formData.discountValue) <= 0
    ) {
      toast.error("Giá trị khuyến mãi không hợp lệ");
      return false;
    }
    if (
      formData.minSpend &&
      (isNaN(formData.minSpend) || Number(formData.minSpend) < 0)
    ) {
      toast.error("Số tiền tối thiểu không hợp lệ");
      return false;
    }
    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate > formData.endDate
    ) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const data = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minSpend: formData.minSpend ? Number(formData.minSpend) : 0,
      };

      if (promotion) {
        await adminService.updatePromotion(promotion._id, data);
        toast.success("Cập nhật khuyến mãi thành công");
      } else {
        await adminService.createPromotion(data);
        toast.success("Tạo khuyến mãi thành công");
      }
      onSave();
      onClose();
      resetForm();
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-char-900">
            {promotion ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi mới"}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5 " />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Input
            label="Mã khuyến mãi *"
            value={formData.code}
            onChange={(e) =>
              setFormData({
                ...formData,
                code: e.target.value.toUpperCase(),
              })
            }
            required
            placeholder="VD: SALE50"
            className="uppercase"
          />
          <Textarea
            label="Mô tả"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={2}
          />
          <Select
            placeholder=""
            label="Loại giảm giá *"
            value={formData.discountType}
            onChange={(e) =>
              setFormData({ ...formData, discountType: e.target.value })
            }
            options={[
              { value: "percentage", label: "Phần trăm (%)" },
              { value: "fixed", label: "Số tiền cố định (VND)" },
            ]}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Giá trị tối thiểu *"
              value={formData.discountValue}
              required
              min="0"
              max={formData.discountType === "percentage" ? 100 : undefined}
              type="number"
              onChange={(e) =>
                setFormData({ ...formData, discountValue: e.target.value })
              }
            />
            <Input
              label="Đơn hàng tối thiểu*"
              value={formData.minSpend}
              required
              min="0"
              type="number"
              onChange={(e) =>
                setFormData({ ...formData, minSpend: e.target.value })
              }
              placeholder="VND"
            />
            <Input
              label="Ngày bắt đầu * "
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              required
            />
            <Input
              label="Ngày kết thúc * "
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
            />
            <label
              htmlFor="isActive"
              className="text-sm text-gray-700 cursor-pointer">
              Kích hoạt khuyến mãi
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="flex-1">
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Đang xử lý..." : promotion ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionModal;
