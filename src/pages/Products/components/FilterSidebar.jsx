import { X } from "lucide-react";
import { Button, Input, Select } from "../../../components/ui";
/**
 * FilterSidebar component - Bộ lọc sản phẩm
 * @param {object} filters - Object chứa các giá trị filter hiện tại
 * @param {function} onFilterChange - Callback khi filter thay đổi
 * @param {array} categories - Danh sách danh mục
 * @param {array} brands - Danh sách thương hiệu
 * @param {boolean} isMobile - Có phải mobile không
 * @param {boolean} showFilters - Hiển thị filters (mobile)
 * @param {function} onClose - Đóng filters (mobile)
 * @param {boolean} hasActiveFilters - Có filter đang active không
 * @param {function} onClearFilters - Xóa tất cả filters
 * @param {boolean} isCategoryRoute - Có phải route category không
 * @param {boolean} isBrandRoute - Có phải route brand không
 */
const FilterSidebar = ({
  filters,
  onFilterChange,
  categories = [],
  brands = [],
  isMobile = false,
  showFilters = false,
  onClose = () => {},
  hasActiveFilters = false,
  onClearFilters = () => {},
  isCategoryRoute = false,
  isBrandRoute = false,
}) => {
  return (
    <aside
      className={`${
        isMobile
          ? `fixed inset-0 z-50 bg-white transform transition-transform ${
              showFilters ? "translate-x-0" : "-translate-x-full"
            }`
          : "w-64 flex-shrink-0"
      }`}>
      <div className={`${isMobile ? "p-4 h-full overflow-y-auto" : ""}`}>
        {/* Mobile Header */}
        {isMobile && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Bộ lọc</h2>
            <button onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        )}

        <div className="space-y-6">
          {/* Search */}
          <Input
            label="Tìm kiếm"
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Tên sản phẩm..."
            className="w-full"
          />

          {/* Category - hide if on category route */}
          {!isCategoryRoute && (
            <Select
              label="Danh mục"
              value={filters.category}
              onChange={(e) => onFilterChange("category", e.target.value)}
              placeholder=""
              options={[{ value: "", label: "Tất cả danh mục" }].concat(
                categories.map((cat) => ({
                  value: cat._id,
                  label: cat.name,
                }))
              )}
              className="w-full"
            />
          )}

          {/* Brand - hide if on brand route */}
          {!isBrandRoute && (
            <Select
              label="Thương hiệu"
              value={filters.brand}
              onChange={(e) => onFilterChange("brand", e.target.value)}
              placeholder=""
              options={[{ value: "", label: "Tất cả thương hiệu" }].concat(
                brands.map((brand) => ({
                  value: brand._id,
                  label: brand.name,
                }))
              )}
              className="w-full"
            />
          )}

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-char-700 mb-2">
              Khoảng giá
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={filters.minPrice}
                onChange={(e) => onFilterChange("minPrice", e.target.value)}
                placeholder="Từ"
                className="w-full"
              />
              <Input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                placeholder="Đến"
                className="w-full px-3 py-2 border border-beige-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              className="w-full"
              onClick={onClearFilters}>
              Xóa bộ lọc
            </Button>
          )}

          {/* Apply button for mobile */}
          {isMobile && (
            <Button className="w-full" onClick={onClose}>
              Áp dụng
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
