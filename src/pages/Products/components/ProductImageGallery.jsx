import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "../../../components/ui";

const ProductImageGallery = ({ images = [], product }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images.length) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-square bg-beige-100 rounded-xl overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-char-400">
            Không có ảnh
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-beige-100 rounded-xl overflow-hidden">
        <img
          src={images[selectedImage]}
          alt={product?.name || "Product"}
          className="w-full h-full object-cover"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedImage((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
              aria-label="Ảnh trước">
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() =>
                setSelectedImage((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
              aria-label="Ảnh tiếp theo">
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product?.stock < 1 && <Badge variant="danger">Hết hàng</Badge>}
          {product?.stock > 0 && product?.stock < 10 && (
            <Badge variant="warning">Còn {product.stock}</Badge>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                selectedImage === index
                  ? "border-primary-500"
                  : "border-transparent"
              }`}>
              <img
                src={image}
                alt={`${product?.name || "Product"} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
