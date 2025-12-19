import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid3X3, Package } from "lucide-react";
import { LoadingScreen } from "../../components/ui";
import { Breadcrumb, EmptyState } from "../../components/common";
import { categoryService } from "../../services";
import { PLACEHOLDER_IMAGE } from "../../config";
const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await categoryService.getAllCategories();
        setCategories(res.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  if (loading) {
    return <LoadingScreen />;
  }
  // Separate root categories and subcategories
  const rootCategories = categories.filter((cat) => !cat.parentCategory);
  const getSubcategories = (parentId) =>
    categories.filter(
      (cat) =>
        cat.parentCategory?._id === parentId || cat.parentCategory === parentId
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Danh mục sản phẩm" }]} className="mb-6" />

      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-char-900 mb-4">
          Danh mục sản phẩm
        </h1>
        <p className="text-char-600 max-w-2xl mx-auto">
          Khám phá các danh mục nội thất đa dạng của chúng tôi, từ phòng khách
          ,phòng ngủ, phong bếp đến văn phòng và ngoài trời. Tìm kiếm những món
          đồ hoàn hảo để biến ngôi nhà của bạn thành không gian mơ ước.
        </p>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          icon={Grid3X3}
          title="Chưa có danh mục nào"
          description="Danh mục sản phẩm sẽ sớm được cập nhật"
        />
      ) : (
        <div className="space-y-12">
          {rootCategories.map((category) => {
            const subcategories = getSubcategories(category._id);

            return (
              <div key={category._id} className="space-y-6">
                {/* Main Category */}
                <Link
                  to={`/categories/${category.slug}`}
                  className="group block relative h-64 rounded-2xl overflow-hidden">
                  <img
                    src={category.image || PLACEHOLDER_IMAGE}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="text-white/80 line-clamp-2 max-w-xl">
                        {category.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 mt-3 text-white font-medium group-hover:text-primary-300 transition-colors">
                      <Package size={18} />
                      Xem sản phẩm
                    </span>
                  </div>
                </Link>

                {/* Subcategories */}
                {subcategories.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {subcategories.map((sub) => (
                      <Link
                        key={sub._id}
                        to={`/categories/${sub.slug}`}
                        className="group block bg-white rounded-xl border border-beige-200 overflow-hidden hover:shadow-lg transition-all">
                        <div className="aspect-square bg-beige-100 relative overflow-hidden">
                          <img
                            src={sub.image || PLACEHOLDER_IMAGE}
                            alt={sub.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3 text-center">
                          <h3 className="font-medium text-char-900 group-hover:text-primary-500 transition-colors line-clamp-1">
                            {sub.name}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default CategoriesPage;
