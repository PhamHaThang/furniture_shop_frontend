import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, ProductCard, LoadingScreen } from "../../components/ui";
import { Breadcrumb, EmptyState } from "../../components/common";
import { productService, reviewService } from "../../services";
import { useAuth, useCart, useWishlist } from "../../contexts";
import { ROUTES } from "../../config";
import toast from "react-hot-toast";
import {
  ProductImageGallery,
  ProductInfo,
  ProductTabs,
  Model3DViewer,
  ARViewer,
} from "./components";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { addItem: addToCart } = useCart();
  const {
    items: wishlistItems,
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
  } = useWishlist();

  // State
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showModel3D, setShowModel3D] = useState(false);
  const [showAR, setShowAR] = useState(false);
  const isInWishlist = wishlistItems.some((item) => item._id === product?._id);

  // Fetch Product Details
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const productDetailRes = await productService.getProductBySlug(slug);
        const productData = productDetailRes.product;
        setProduct(productData);

        // Fetch Related Products and Reviews
        if (productData._id) {
          const [relatedRes, reviewsRes] = await Promise.all([
            productService.getRelatedProducts(productData._id),
            reviewService.getReviewsByProductId(productData._id),
          ]);
          setRelatedProducts(relatedRes.products || []);
          setReviews(reviewsRes.reviews || []);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
    setQuantity(1);
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock < 1) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }
    addToCart({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images?.[0],
      quantity,
    });
    toast.success("Đã thêm vào giỏ hàng");
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích");
      return;
    }
    if (!product) return;
    if (isInWishlist) {
      removeFromWishlist(product._id);
      toast.success("Đã xóa khỏi danh sách yêu thích");
    } else {
      addToWishlist(product);
      toast.success("Đã thêm vào danh sách yêu thích");
    }
  };

  const handleARView = () => {
    // Kiểm tra nếu thiết bị hỗ trợ AR
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(
      navigator.userAgent
    );
    if (!isMobile) {
      toast.error("Vui lòng sử dụng thiết bị di động để trải nghiệm AR");
      return;
    }
    setShowAR(true);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Không tìm thấy sản phẩm"
          description="Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa"
          action={
            <Link to={ROUTES.PRODUCTS}>
              <Button>Xem sản phẩm khác</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const images = product.images || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Sản phẩm", path: ROUTES.PRODUCTS },
          {
            label: product.category?.name,
            path: `${ROUTES.CATEGORIES}/${product.category?.slug}`,
          },
          { label: product.name },
        ]}
        className="mb-6"
      />

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Images */}
        <ProductImageGallery images={images} product={product} />

        {/* Product Info */}
        <ProductInfo
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          isInWishlist={isInWishlist}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onShow3D={() => setShowModel3D(true)}
          onShowAR={handleARView}
          reviewCount={reviews.length}
        />
      </div>

      {/* Tabs */}
      <ProductTabs product={product} reviews={reviews} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-char-900 mb-6">
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* 3D Model Modal */}
      <Model3DViewer
        isOpen={showModel3D}
        onClose={() => setShowModel3D(false)}
        product={product}
        onShowAR={handleARView}
      />

      {/* AR Modal */}
      <ARViewer
        isOpen={showAR}
        onClose={() => setShowAR(false)}
        product={product}
      />
    </div>
  );
};

export default ProductDetailPage;
