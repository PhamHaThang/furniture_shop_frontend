import { useState, useEffect } from "react";
import {
  useSearchParams,
  useParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { SlidersHorizontal, Grid3X3, LayoutList } from "lucide-react";
import {
  ProductCard,
  Button,
  Select,
  Spinner,
  LoadingScreen,
} from "../../components/ui";
import { Pagination, Breadcrumb, EmptyState } from "../../components/common";
import { FilterSidebar } from "./components";
import { productService, categoryService, brandService } from "../../services";
import { usePagination, useDebounce, useIsMobile } from "../../hooks";
import { Package } from "lucide-react";
import { SORT_OPTIONS } from "../../config";
const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Determine if current route is category or brand
  const isCategoryRoute = location.pathname.startsWith("/categories/");
  const isBrandRoute = location.pathname.startsWith("/brands/");

  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentBrand, setCurrentBrand] = useState(null);

  // Filters from URL
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest",
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  // Pagination
  const { page, limit, totalPages, setPage, setTotalItems, paginationParams } =
    usePagination({
      initialPage: parseInt(searchParams.get("page")) || 1,
      initialLimit: 12,
    });

  // Sync only non-slug filters from URL
  useEffect(() => {
    const searchParam = searchParams.get("search") || "";
    const minPriceParam = searchParams.get("minPrice") || "";
    const maxPriceParam = searchParams.get("maxPrice") || "";
    const sortParam = searchParams.get("sort") || "newest";

    setFilters((prev) => ({
      ...prev,
      search: searchParam,
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      sort: sortParam,
    }));
  }, [searchParams]);

  // Fetch categories and brands
  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          categoryService.getAllCategories(),
          brandService.getAllBrands(),
        ]);
        const categoriesList = categoriesRes.categories || [];
        const brandsList = brandsRes.brands || [];
        setCategories(categoriesList);
        setBrands(brandsList);

        // Set current category/brand based on URL slug
        if (slug && isCategoryRoute) {
          const cat = categoriesList.find((c) => c.slug === slug);
          if (cat) {
            setCurrentCategory(cat);
            setFilters((prev) => ({ ...prev, category: cat._id, brand: "" }));
          } else {
            // Redirect if category slug invalid
            navigate("/not-found");
            return;
          }
        } else if (slug && isBrandRoute) {
          const brand = brandsList.find((b) => b.slug === slug);
          if (brand) {
            setCurrentBrand(brand);
            setFilters((prev) => ({ ...prev, brand: brand._id, category: "" }));
          } else {
            navigate("/not-found");
            return;
          }
        } else {
          // Reset category/brand if no slug (on /products page)
          setCurrentCategory(null);
          setCurrentBrand(null);
          const categoryParam = searchParams.get("category") || "";
          const brandParam = searchParams.get("brand") || "";
          if (categoryParam || brandParam) {
            setFilters((prev) => ({
              ...prev,
              category: categoryParam,
              brand: brandParam,
            }));
          } else {
            setFilters((prev) => ({ ...prev, category: "", brand: "" }));
          }
        }
      } catch (error) {
        console.error("Error fetching categories or brands:", error);
      }
    };
    fetchCategoriesAndBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, isCategoryRoute, isBrandRoute, navigate]);
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          ...paginationParams,
          search: debouncedSearch,
          category: filters.category,
          brand: filters.brand,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sort: filters.sort,
        };
        // Clean empty params
        Object.keys(params).forEach((key) => {
          if (!params[key]) delete params[key];
        });
        const res = await productService.getAllProducts(params);
        setProducts(res.products || []);
        setTotalItems(res.pagination?.total || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have the necessary filter data
    // For category route, wait until we have the category ID
    // For brand route, wait until we have the brand ID
    if (isCategoryRoute && !filters.category) return;
    if (isBrandRoute && !filters.brand) return;

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSearch,
    filters.category,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    page,
    limit,
    slug,
    isCategoryRoute,
    isBrandRoute,
  ]);

  // Update URL when filters change (only on /products page, not on category/brand pages)
  useEffect(() => {
    // Don't update URL params when on category/brand route
    if (isCategoryRoute || isBrandRoute) return;

    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sort !== "newest") params.set("sort", filters.sort);
    if (page > 1) params.set("page", page.toString());

    setSearchParams(params, { replace: true });
  }, [filters, page, setSearchParams, isCategoryRoute, isBrandRoute]);
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };
  const clearFilters = () => {
    // If on category/brand route, navigate to products page
    if (isCategoryRoute || isBrandRoute) {
      navigate("/products");
      return;
    }
    setFilters({
      search: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    });
    setPage(1);
  };
  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.brand ||
    filters.minPrice ||
    filters.maxPrice;

  // Build breadcrumb items
  const breadcrumbItems = [];
  if (currentCategory) {
    breadcrumbItems.push({ label: "Danh mục", href: "/products" });
    breadcrumbItems.push({ label: currentCategory.name });
  } else if (currentBrand) {
    breadcrumbItems.push({ label: "Thương hiệu", href: "/products" });
    breadcrumbItems.push({ label: currentBrand.name });
  } else {
    breadcrumbItems.push({ label: "Sản phẩm" });
  }
  // Page title
  const pageTitle = currentCategory
    ? currentCategory.name
    : currentBrand
    ? currentBrand.name
    : "Tất cả sản phẩm";
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categories}
          brands={brands}
          isMobile={isMobile}
          showFilters={showFilters}
          onClose={() => setShowFilters(false)}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          isCategoryRoute={isCategoryRoute}
          isBrandRoute={isBrandRoute}
        />

        {/* Mobile filter overlay */}
        {isMobile && showFilters && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Products Section */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-char-900">{pageTitle}</h1>

            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              {isMobile && (
                <button
                  className="border-2 border-primary-500 text-primary-500 hover:bg-primary-100 focus:ring-primary-300 rounded-lg p-2.5"
                  onClick={() => setShowFilters(true)}>
                  <SlidersHorizontal size={18} />
                </button>
              )}

              {/* View Mode */}
              {isMobile ? null : (
                <div className="flex items-center border border-beige-300 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-primary-500 text-white"
                        : "text-char-600"
                    } rounded-l-lg`}>
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 cursor-pointer ${
                      viewMode === "list"
                        ? "bg-primary-500 text-white "
                        : "text-char-600"
                    } rounded-r-lg`}>
                    <LayoutList size={18} />
                  </button>
                </div>
              )}

              {/* Sort */}
              <Select
                value={filters.sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                placeholder=""
                options={SORT_OPTIONS}
                className="w-full sm:w-auto"
              />
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <LoadingScreen message="Đang tải sản phẩm..." />
          ) : products.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Không tìm thấy sản phẩm"
              description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
              action={
                hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Xóa bộ lọc
                  </Button>
                )
              }
            />
          ) : (
            <>
              {/* Products Grid */}
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
                    : "space-y-4"
                }`}>
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    horizontal={viewMode === "list"}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductsPage;
