import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import { LoadingScreen } from "../../components/ui";
import { Breadcrumb, EmptyState } from "../../components/common";
import { brandService } from "../../services";
import { PLACEHOLDER_BRAND, ROUTES } from "../../config";
const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const res = await brandService.getAllBrands();
        setBrands(res.brands || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
      setLoading(false);
    };
    fetchBrands();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Thương hiệu" }]} className="mb-6" />

      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-char-900 mb-4">
          Thương hiệu nội thất
        </h1>
        <p className="text-char-600 max-w-2xl mx-auto">
          Khám phá các thương hiệu nội thất hàng đầu với chất lượng đảm bảo
        </p>
      </div>

      {brands.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Chưa có thương hiệu nào"
          description="Danh sách thương hiệu sẽ sớm được cập nhật"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              to={`${ROUTES.BRAND_DETAIL.replace(":slug", brand.slug)}`}
              className="group block bg-white rounded-xl border border-beige-200 p-6 hover:shadow-lg hover:border-primary-300 transition-all text-center">
              {/* Logo */}
              <div className="w-24 h-24 mx-auto mb-4 overflow-hidden flex items-center justify-center object-cover">
                {brand.image ? (
                  <img
                    src={brand.image || PLACEHOLDER_BRAND}
                    alt={brand.name || "Brand Logo"}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <Building2
                    size={40}
                    className="text-char-400 group-hover:text-primary-500 transition-colors"
                  />
                )}
              </div>

              {/* Name */}
              <h3 className="font-semibold text-char-900 group-hover:text-primary-500 transition-colors mb-1">
                {brand.name || "Unnamed Brand"}
              </h3>
              {/* Product count */}
              {brand.productCount && (
                <p className="text-sm text-char-500">
                  {brand.productCount || 0} sản phẩm
                </p>
              )}

              {/* Description */}
              {brand.description && (
                <p className="text-sm text-char-500 mt-2 line-clamp-2">
                  {brand.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Brand Info Section */}
      <div className="mt-16 bg-beige-50 rounded-2xl p-8 lg:p-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-char-900 mb-4">
            Cam kết chất lượng
          </h2>
          <p className="text-char-600 leading-relaxed">
            Tất cả các thương hiệu trên HOMI Shop đều được chọn lọc kỹ càng, đảm
            bảo chất lượng sản phẩm và dịch vụ hậu mãi tốt nhất. Chúng tôi hợp
            tác với các nhà sản xuất uy tín trong và ngoài nước để mang đến cho
            bạn những sản phẩm nội thất đẹp, bền và an toàn.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;
