import { useEffect, useState } from "react";
import { PromotionModal } from "./components";
import { adminService } from "../../services";
import toast from "react-hot-toast";
import { Button, ConfirmModal, Input, Pagination } from "../../components";
import {
  Calendar,
  Edit2,
  Percent,
  Plus,
  Search,
  Ticket,
  Trash2,
} from "lucide-react";
import { formatPrice } from "../../utils";
const getPromotionStatus = (promotion) => {
  const now = new Date();
  const startDate = new Date(promotion.startDate);
  const endDate = new Date(promotion.endDate);
  if (!promotion.isActive)
    return { color: "bg-gray-100 text-gray-700", label: "Vô hiệu" };
  if (now < startDate)
    return { color: "bg-blue-100 text-blue-700", label: "Sắp diễn ra" };
  if (now > endDate)
    return { color: "bg-red-100 text-red-700", label: "Đã hết hạn" };
  return { color: "bg-green-100 text-green-700", label: "Đang hoạt động" };
};
const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPromotions({
        page: pagination.page,
        limit: pagination.limit,
        search,
      });
      setPromotions(response.promotions || []);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0,
      }));
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPromotions();
  }, [pagination.page, pagination.limit, search]);
  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setModalOpen(true);
  };
  const handleAdd = () => {
    setSelectedPromotion(null);
    setModalOpen(true);
  };
  const handleDelete = async (promotionId) => {
    try {
      setLoading(true);
      await adminService.deletePromotion(promotionId);
      toast.success("Xóa khuyến mãi thành công");
      fetchPromotions();
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast.error("Xóa khuyến mãi thất bại");
    } finally {
      setLoading(false);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-char-900">
            Quản lý khuyến mãi
          </h1>
          <p className="text-gray-500">
            Quản lý mã giảm giá và chương trình khuyến mãi
          </p>
        </div>
        <Button onClick={handleAdd} leftIcon={<Plus className="w-5 h-5" />}>
          Thêm khuyến mãi
        </Button>
      </div>
      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <Input
          placeholder="Tìm kiếm mã khuyến mãi..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        />
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khuyến mãi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giảm giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                    </div>
                  </td>
                </tr>
              ) : promotions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy khuyến mãi nào
                  </td>
                </tr>
              ) : (
                promotions.map((promotion) => {
                  const status = getPromotionStatus(promotion);
                  return (
                    <tr key={promotion._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                            <Ticket className="w-5 h-5 text-primary-500" />
                          </div>
                          <div>
                            <p className="font-medium text-char-900">
                              {promotion.code}
                            </p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {promotion.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">
                            {promotion.discountType === "percentage"
                              ? promotion.discountValue + "%"
                              : formatPrice(promotion.discountValue)}
                          </span>
                        </div>
                        {promotion.minSpend > 0 && (
                          <p className="text-xs text-gray-500">
                            Tối thiểu: {formatPrice(promotion.minSpend)}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            {new Date(promotion.startDate).toLocaleDateString(
                              "vi-VN"
                            )}{" "}
                            -{" "}
                            {new Date(promotion.endDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(promotion)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Chỉnh sửa">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(promotion)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <p className="text-sm text-gray-500">
            Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
            trong {pagination.total} kết quả
          </p>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
          />
        </div>
      </div>
      {/* Promotion Modal */}
      <PromotionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        promotion={selectedPromotion}
        onSave={fetchPromotions}
      />
      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmModal
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa khuyến mãi ${deleteConfirm.code}?`}
          isOpen={Boolean(deleteConfirm)}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm._id)}
        />
      )}
    </div>
  );
};

export default PromotionsPage;
