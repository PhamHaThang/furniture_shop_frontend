import { useState } from "react";
import ReviewsList from "./ReviewsList";

const ProductTabs = ({ product, reviews }) => {
  const [activeTab, setActiveTab] = useState("description");
  const reviewCount = product?.reviewCount || reviews.length;

  const tabs = [
    { id: "description", label: "Mô tả" },
    { id: "specifications", label: "Thông số" },
    { id: "reviews", label: `Đánh giá (${reviewCount})` },
  ];

  return (
    <div className="mb-8 sm:mb-16">
      <div className="flex border-b border-beige-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base cursor-pointer ${
              activeTab === tab.id
                ? "text-primary-500 border-b-2 border-primary-500"
                : "text-char-600 hover:text-char-900"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-6">
        {activeTab === "description" && (
          <div
            className="prose max-w-none text-char-700"
            dangerouslySetInnerHTML={{
              __html: product?.description || "Không có mô tả",
            }}
          />
        )}

        {activeTab === "specifications" && (
          <div className="space-y-6">
            {/* Dimensions */}
            {product?.dimensions &&
              (product.dimensions.width ||
                product.dimensions.height ||
                product.dimensions.length) && (
                <div>
                  <h3 className="text-lg font-semibold text-char-900 mb-3">
                    Kích thước
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {product.dimensions.width && (
                      <div className="flex justify-between py-3 px-4 bg-beige-50 rounded-lg">
                        <span className="font-medium text-char-700">Rộng</span>
                        <span className="text-char-600">
                          {product.dimensions.width} cm
                        </span>
                      </div>
                    )}
                    {product.dimensions.height && (
                      <div className="flex justify-between py-3 px-4 bg-beige-50 rounded-lg">
                        <span className="font-medium text-char-700">Cao</span>
                        <span className="text-char-600">
                          {product.dimensions.height} cm
                        </span>
                      </div>
                    )}
                    {product.dimensions.length && (
                      <div className="flex justify-between py-3 px-4 bg-beige-50 rounded-lg">
                        <span className="font-medium text-char-700">Dài</span>
                        <span className="text-char-600">
                          {product.dimensions.length} cm
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Colors */}
            {product?.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-char-900 mb-3">
                  Màu sắc sản phẩm
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Materials */}
            {product?.materials && product.materials.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-char-900 mb-3">
                  Chất liệu
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium">
                      {material}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product?.tags && product.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-char-900 mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!product?.dimensions &&
              !product?.colors?.length &&
              !product?.materials?.length &&
              !product?.tags?.length && (
                <p className="text-char-500 text-center py-8">
                  Không có thông số kỹ thuật
                </p>
              )}
          </div>
        )}

        {activeTab === "reviews" && (
          <ReviewsList reviews={reviews} product={product} />
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
