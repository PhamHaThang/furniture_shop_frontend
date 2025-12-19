import { useState } from "react";
import { XCircle, Star } from "lucide-react";
import { Button, Spinner } from "../../../components/ui";
import { formatPrice } from "../../../utils";

const ReviewModal = ({ product, onClose, onSubmit, isSubmitting }) => {
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  const handleSubmit = () => {
    if (!reviewData.comment.trim()) {
      return;
    }
    onSubmit(reviewData);
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-char-900">
            Đánh giá sản phẩm
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Product Info */}
          <div className="flex gap-3">
            <img
              src={
                product.image ||
                product.product?.images?.[0] ||
                "/placeholder.jpg"
              }
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <p className="font-medium text-char-900">
                {product.name || product.product?.name}
              </p>
              <p className="text-sm text-char-500">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đánh giá của bạn
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setReviewData((prev) => ({ ...prev, rating: star }))
                  }
                  className="transition-colors">
                  <Star
                    size={32}
                    className={
                      star <= reviewData.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhận xét của bạn *
            </label>
            <textarea
              value={reviewData.comment}
              onChange={(e) =>
                setReviewData((prev) => ({
                  ...prev,
                  comment: e.target.value,
                }))
              }
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={isSubmitting || !reviewData.comment.trim()}>
            {isSubmitting ? <Spinner size="sm" /> : "Gửi đánh giá"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
