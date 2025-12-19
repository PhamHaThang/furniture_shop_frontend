import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard, Button, Spinner } from "../../components/ui";
import { productService, categoryService, brandService } from "../../services";
import { FEATURE_HIGHLIGHTS, ROUTES } from "../../config";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, newRes, bestSellersRes, categoriesRes, brandRes] =
          await Promise.all([
            productService.getFeaturedProducts({
              limit: 8,
            }),
            productService.getNewArrivals({
              limit: 8,
            }),
            productService.getBestSellers({
              limit: 8,
            }),
            categoryService.getAllCategories({
              limit: 8,
            }),
            brandService.getPopularBrands({
              limit: 6,
            }),
          ]);
        console.log(featuredRes);
        setFeaturedProducts(featuredRes.products || []);
        setNewProducts(newRes.products || []);
        setBestSellers(bestSellersRes.products || []);
        setCategories(categoriesRes.categories || []);
        setBrands(brandRes.brands || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-beige-100 to-beige-200 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-char-900 mb-6">
              Nội thất hiện đại cho
              <span className="text-primary-500"> ngôi nhà của bạn</span>
            </h1>
            <p className="text-lg text-char-600 mb-8">
              Khám phá bộ sưu tập nội thất cao cấp với thiết kế tinh tế, chất
              lượng vượt trội và giá cả hợp lý.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg">
                  Khám phá ngay
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link to={ROUTES.CATEGORIES}>
                <Button variant="outline" size="lg">
                  Xem danh mục
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURE_HIGHLIGHTS.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="text-primary-500" size={28} />
              </div>
              <h3 className="font-semibold text-char-900 mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-char-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-char-900">
              Danh mục sản phẩm
            </h2>
            <Link
              to={ROUTES.CATEGORIES}
              className="text-primary-500 hover:text-primary-600 font-medium flex items-center">
              Xem tất cả
              <ArrowRight className="ml-1" size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`${ROUTES.CATEGORIES}/${category.slug}`}
                className="group relative aspect-square rounded-xl overflow-hidden bg-beige-100">
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg">
                    {category.name}
                  </h3>
                  {category.productCount > 0 && (
                    <p className="text-white/80 text-sm">
                      {category.productCount} sản phẩm
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-char-900">
              Sản phẩm nổi bật
            </h2>
            <Link
              to={ROUTES.PRODUCTS}
              className="text-primary-500 hover:text-primary-600 font-medium flex items-center">
              Xem tất cả
              <ArrowRight className="ml-1" size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}
      {/* Banner */}
      <section className="container mx-auto px-4">
        <div className="bg-primary-500 rounded-2xl p-8 lg:p-16 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Giảm giá đến 50%
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Ưu đãi đặc biệt cho bộ sưu tập nội thất phòng khách. Số lượng có
            hạn, đặt hàng ngay!
          </p>
          <Link to={ROUTES.PRODUCTS}>
            <Button variant="secondary" size="lg">
              Mua ngay
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-char-900">
              Sản phẩm mới
            </h2>
            <Link
              to={`${ROUTES.PRODUCTS}?sort=newest`}
              className="text-primary-500 hover:text-primary-600 font-medium flex items-center">
              Xem tất cả
              <ArrowRight className="ml-1" size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-char-900">
              Bán chạy nhất
            </h2>
            <Link
              to={`${ROUTES.PRODUCTS}?sort=best-seller`}
              className="text-primary-500 hover:text-primary-600 font-medium flex items-center">
              Xem tất cả
              <ArrowRight className="ml-1" size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-char-900 text-center mb-8">
            Thương hiệu đối tác
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                to={`${ROUTES.BRANDS}/${brand.slug}`}
                className="grayscale hover:grayscale-0 transition-all">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-12 w-auto object-contain"
                  />
                ) : (
                  <span className="text-xl font-semibold text-char-400 hover:text-primary-500">
                    {brand.name}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
