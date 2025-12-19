import { Star } from "lucide-react";

const ReviewsList = ({ reviews, product }) => {
  const avgRating = product?.averageRating || 0;
  const reviewCount = product?.reviewCount || reviews.length;

  if (!reviews.length) {
    return (
      <div className="text-center py-12">
        <Star className="w-16 h-16 mx-auto text-char-300 mb-4" />
        <p className="text-char-500 text-lg">
          Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-beige-50 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-char-900 mb-2">
            {avgRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                className={
                  star <= avgRating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-char-300"
                }
              />
            ))}
          </div>
          <p className="text-char-600">{reviewCount} đánh giá</p>
        </div>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const percentage =
              reviewCount > 0 ? (count / reviewCount) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm text-char-600 w-8">
                  {star} <Star size={12} className="inline" />
                </span>
                <div className="flex-1 h-2 bg-beige-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-char-600 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="p-6 bg-white border border-beige-200 rounded-xl">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="shrink-0">
                {review.user?.avatar ? (
                  <img
                    src={review.user.avatar}
                    alt={review.user.fullName || review.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary-500 text-lg">
                      {(review.user?.fullName ||
                        review.user?.name ||
                        "U")[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-char-900">
                      {review.user?.fullName || review.user?.name || "Ẩn danh"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <= review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-char-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm text-char-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-char-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;
