import { adminService } from "../../services";
import { BrandModal } from "./components";
import { Button, ConfirmModal, Input, Pagination } from "../../components";
import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, Building2 } from "lucide-react";
import toast from "react-hot-toast";

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await adminService.getBrands({
        page: pagination.page,
        limit: pagination.limit,
        search,
      });
      setBrands(response.brands || []);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0,
      }));
    } catch (error) {
      toast.error(error.message || "Không thể tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [pagination.page, search]);

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedBrand(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteBrand(id);
      toast.success("Xóa thương hiệu thành công");
      fetchBrands();
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setDeleteConfirm(null);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-char-900">
            Quản lý thương hiệu
          </h1>
          <p className="text-gray-500">Quản lý các thương hiệu sản phẩm</p>
        </div>
        <Button onClick={handleAdd} variant="primary" leftIcon={<Plus />}>
          Thêm thương hiệu
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <Input
          placeholder="Tìm kiếm thương hiệu..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          leftIcon={<Search className="w-5 h-5 text-gray-400" />}
        />
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thương hiệu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số sản phẩm
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                    </div>
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy thương hiệu nào
                  </td>
                </tr>
              ) : (
                brands.map((brand) => (
                  <tr key={brand._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {brand.image ? (
                          <img
                            src={brand.image}
                            alt={brand.name}
                            className="w-10 h-10 rounded-lg object-contain bg-gray-50 p-1"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-char-900">
                            {brand.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {brand.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {brand.productCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(brand)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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

      {/* Modal */}
      <BrandModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedBrand(null);
        }}
        brand={selectedBrand}
        onSave={fetchBrands}
      />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmModal
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa thương hiệu ${deleteConfirm.name}?`}
          isOpen={Boolean(deleteConfirm)}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm._id)}
        />
      )}
    </div>
  );
};

export default BrandsPage;
