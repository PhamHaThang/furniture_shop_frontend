import { useState, useEffect, use } from "react";
import { Link } from "react-router-dom";
import { Tag, Clock, Percent, Gift, Copy, Check } from "lucide-react";
import { Breadcrumb, EmptyState } from "../../components/common";
import { Button, LoadingScreen } from "../../components/ui";
import { promotionService } from "../../services";
import { ROUTES } from "../../config";
import { formatDate } from "../../utils";
import toast from "react-hot-toast";
const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const res = await promotionService.getAllPromotions();
        setPromotions(res.promotions || []);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);
  if (loading) {
    return <LoadingScreen />;
  }
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Đã sao chép mã giảm giá!");
    setTimeout(() => setCopiedCode(null), 2000);
  };
  const formatDiscount = (promotion) => {
    if (promotion.discountType === "percentage") {
      return `Giảm ${promotion.discountValue}%`;
    }
    return `Giảm ${promotion.discountValue.toLocaleString("vi-VN")}đ`;
  };

  const isExpiringSoon = (endDate) => {
    const daysLeft = Math.ceil(
      (new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return daysLeft <= 3 && daysLeft > 0;
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Khuyến mãi" }]} className="mb-6" />

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-char-900 mb-4">
          Ưu đãi & Khuyến mãi
        </h1>
        <p className="text-char-500 max-w-2xl mx-auto">
          Khám phá các chương trình khuyến mãi hấp dẫn và mã giảm giá độc quyền
          tại HOMI Shop
        </p>
      </div>

      {promotions.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="Chưa có khuyến mãi"
          description="Hiện tại chưa có chương trình khuyến mãi nào. Hãy quay lại sau!"
          action={
            <Link to={ROUTES.PRODUCTS}>
              <Button>Khám phá sản phẩm</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <div
              key={promotion._id}
              className="bg-white rounded-xl border border-beige-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {promotion.discountType === "percentage" ? (
                      <Percent size={24} />
                    ) : (
                      <Gift size={24} />
                    )}
                    <span className="text-2xl font-bold">
                      {formatDiscount(promotion)}
                    </span>
                  </div>
                  {isExpiringSoon(promotion.endDate) && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Sắp hết hạn
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <h3 className="font-semibold text-char-900 mb-2">
                  {promotion.name}
                </h3>
                <p className="text-char-500 text-sm mb-4 line-clamp-2">
                  {promotion.description || "Áp dụng cho tất cả sản phẩm"}
                </p>

                {/* Conditions */}
                <div className="space-y-2 text-sm text-char-600 mb-4">
                  {promotion.minSpend > 0 && (
                    <p>
                      Đơn tối thiểu:{" "}
                      {promotion.minSpend.toLocaleString("vi-VN")}đ
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-char-500 mb-4">
                  <Clock size={16} />
                  <span>HSD: {formatDate(promotion.endDate)}</span>
                </div>

                {/* Code & Copy Button */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-beige-50 border border-dashed border-primary-300 rounded-lg px-4 py-2 text-center">
                    <span className="font-mono font-bold text-primary-600 tracking-wider">
                      {promotion.code}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyCode(promotion.code)}
                    className="flex items-center gap-1">
                    {copiedCode === promotion.code ? (
                      <>
                        <Check size={16} />
                        Đã sao chép
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Sao chép
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Section */}
      <div className="mt-12 bg-beige-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-char-900 mb-4">
          Hướng dẫn sử dụng mã giảm giá
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-char-600">
          <li>Sao chép mã giảm giá bạn muốn sử dụng</li>
          <li>Thêm sản phẩm vào giỏ hàng và tiến hành thanh toán</li>
          <li>Nhập mã giảm giá vào ô "Mã khuyến mãi" tại trang thanh toán</li>
          <li>Nhấn "Áp dụng" để được giảm giá</li>
        </ol>
      </div>
    </div>
  );
};
export default PromotionsPage;
