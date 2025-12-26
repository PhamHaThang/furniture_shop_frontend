import { useState, useEffect } from "react";
import { Search, Trash2, Star, User } from "lucide-react";
import { Input, Button, Pagination, ConfirmModal } from "../../components";
import { PLACEHOLDER_IMAGE } from "../../config";
import toast from "react-hot-toast";
import { adminService } from "../../services";
const renderStars = (rating) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};
const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Fetch reviews from API
      const response = await adminService.getReviews({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
      });
      setReviews(response.reviews || []);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0,
      }));
    } catch {
      toast.error("Không thể tải danh sách đánh giá.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, [pagination.page, searchTerm, pagination.limit]);
  const handleDeleteReview = async (reviewId) => {
    try {
      await adminService.deleteReview(reviewId);
      toast.success("Đánh giá đã được xóa thành công.");
      fetchReviews();
    } catch (error) {
      toast.error(error.message || "Không thể xóa đánh giá.");
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-char-900">Quản lý đánh giá</h1>
        <p className="text-gray-500">Quản lý đánh giá sản phẩm từ khách hàng</p>
      </div>
      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <Input
          type="text"
          placeholder="Tìm kiếm đánh giá theo tên sản phẩm, tên người dùng..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          leftIcon={<Search className="w-5 h-5 text-gray-400" />}
        />
      </div>
      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Không tìm thấy đánh giá nào
          </div>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => (
              <div key={review._id} className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <img
                    src={review.product?.images?.[0] || PLACEHOLDER_IMAGE}
                    alt={review.product?.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-char-900 truncate">
                          {review.product?.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">
                            {review.rating}/5
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setDeleteConfirm(review)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                        title="Xóa đánh giá">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {review.comment && (
                      <p className="text-gray-600 mt-2">{review.comment}</p>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>
                          {review.user?.fullName || review.user?.email}
                        </span>
                      </div>
                      <span>•</span>
                      <span>
                        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmModal
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa đánh giá này?`}
          isOpen={Boolean(deleteConfirm)}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDeleteReview(deleteConfirm._id)}
        />
      )}
    </div>
  );
};

export default ReviewsPage;
