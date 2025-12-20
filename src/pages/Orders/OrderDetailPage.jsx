import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Package, ArrowLeft } from "lucide-react";
import {
  Button,
  Badge,
  ConfirmModal,
  LoadingScreen,
  Spinner,
} from "../../components/ui";
import { Breadcrumb, EmptyState } from "../../components/common";
import { orderService, reviewService } from "../../services";
import { ROUTES, STATUS_ORDERS_MAP } from "../../config";
import { formatDateTime } from "../../utils";
import toast from "react-hot-toast";
import {
  OrderTimeline,
  OrderItemsList,
  OrderShippingInfo,
  OrderPaymentSummary,
  ReviewModal,
} from "./components";

const OrderDetailPage = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [reviewingProduct, setReviewingProduct] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState(new Set());

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        console.log("Fetching order detail for id:", id);
        const response = await orderService.getOrderByCode(id);
        setOrder(response.order);

        // Fetch reviewed products for this order
        if (response.order && response.order.items) {
          const productIds = response.order.items
            .map((item) => item.product?._id || item.product)
            .filter(Boolean);

          if (productIds.length > 0) {
            try {
              const reviewResponse = await reviewService.getMyReviewedProducts(
                productIds
              );
              setReviewedProducts(new Set(reviewResponse.productIds));
            } catch (error) {
              console.error("Failed to fetch reviewed products:", error);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch order detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);
  if (loading) {
    return <LoadingScreen />;
  }

  const getStatusConfig = (status) => {
    return (
      STATUS_ORDERS_MAP[status] || {
        label: status,
        variant: "default",
        icon: Package,
      }
    );
  };

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      await orderService.cancelOrder(order._id);
      setOrder({ ...order, status: "cancelled" });
      toast.success("Đơn hàng đã được hủy thành công.");
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast.error("Hủy đơn hàng thất bại. Vui lòng thử lại.");
    } finally {
      setCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  const handleOpenReview = (item) => {
    setReviewingProduct(item);
  };

  const handleCloseReview = () => {
    setReviewingProduct(null);
  };

  const handleSubmitReview = async (reviewData) => {
    if (!reviewData.comment.trim()) {
      toast.error("Vui lòng nhập nhận xét của bạn.");
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewService.createReview({
        productId: reviewingProduct._id || reviewingProduct.product,
        rating: reviewData.rating,
        comment: reviewData.comment,
        orderId: order._id,
      });
      toast.success("Đánh giá sản phẩm thành công!");
      setReviewedProducts((prev) =>
        new Set(prev).add(reviewingProduct._id || reviewingProduct.product)
      );
      handleCloseReview();
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error(error.message || "Không thể gửi đánh giá");
    } finally {
      setSubmittingReview(false);
    }
  };

  const canCancel = order?.status === "pending";
  const canReview = order?.status === "delivered";

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={Package}
          title="Không tìm thấy đơn hàng"
          description="Đơn hàng không tồn tại hoặc bạn không có quyền xem"
          action={
            <Link to={ROUTES.ORDERS}>
              <Button>Xem đơn hàng của tôi</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Đơn hàng", path: ROUTES.ORDERS },
          { label: `#${order.code}` },
        ]}
        className="mb-6"
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-char-900">
            Đơn hàng #{order.code}
          </h1>
          <p className="text-char-500 mt-1">
            Đặt ngày {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={statusConfig.variant} className="text-base px-4 py-2">
            <StatusIcon size={18} className="mr-2" />
            {statusConfig.label}
          </Badge>
          {canCancel && (
            <Button
              variant="outline"
              className="text-red-500 border-red-500 hover:bg-red-50"
              onClick={() => setShowCancelConfirm(true)}
              disabled={cancelling}>
              {cancelling ? <Spinner size="sm" /> : "Hủy đơn hàng"}
            </Button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelOrder}
        title="Hủy đơn hàng"
        message="Bạn có chắc muốn hủy đơn hàng này? Hành động này không thể hoàn tác."
        confirmText="Hủy đơn hàng"
        variant="danger"
        loading={cancelling}
      />

      {/* Timeline */}
      <OrderTimeline status={order.status} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <OrderItemsList
            items={order.items}
            canReview={canReview}
            reviewedProducts={reviewedProducts}
            onReview={handleOpenReview}
          />

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl border border-beige-200 p-6">
              <h2 className="text-lg font-semibold text-char-900 mb-2">
                Ghi chú
              </h2>
              <p className="text-char-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <OrderShippingInfo shippingAddress={order.shippingAddress} />
          <OrderPaymentSummary
            payment={order.payment}
            subTotal={order.subTotal}
            shippingFee={order.shippingFee}
            discount={order.discount}
            totalAmount={order.totalAmount}
          />
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        product={reviewingProduct}
        onClose={handleCloseReview}
        onSubmit={handleSubmitReview}
        isSubmitting={submittingReview}
      />
      {/* Review Modal */}
      <ReviewModal
        product={reviewingProduct}
        onClose={handleCloseReview}
        onSubmit={handleSubmitReview}
        isSubmitting={submittingReview}
      />

      {/* Back Button */}
      <div className="mt-8">
        <Link to={ROUTES.ORDERS}>
          <Button variant="outline">
            <ArrowLeft className="mr-2" size={18} />
            Quay lại danh sách đơn hàng
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailPage;
