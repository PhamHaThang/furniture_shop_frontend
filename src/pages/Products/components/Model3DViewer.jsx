import { X, Smartphone } from "lucide-react";

const Model3DViewer = ({ isOpen, onClose, product, onShowAR }) => {
  if (!isOpen || !product?.model3DUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-4xl h-[80vh] mx-4 bg-white rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="text-char-800 ">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm opacity-80">Mô hình 3D</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-black/20 hover:bg-black/30 rounded-full transition-colors cursor-pointer">
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* 3D Viewer */}
        <model-viewer
          src={product.model3DUrl}
          alt={`Mô hình 3D của ${product.name}`}
          auto-rotate
          camera-controls
          shadow-intensity="1"
          exposure="0.8"
          style={{ width: "100%", height: "100%" }}
          poster={product.images?.[0]}
          loading="eager"
          ar
          ar-modes="webxr scene-viewer quick-look">
          <div
            slot="progress-bar"
            className="absolute bottom-0 left-0 right-0 h-1 bg-beige-200">
            <div
              className="h-full bg-primary-500 transition-all"
              style={{ width: "0%" }}></div>
          </div>
        </model-viewer>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-mds text-white bg-black/50 rounded-lg px-4 py-3">
          <span>🖱️ Kéo để xoay</span>
          <span>🔍 Cuộn để zoom</span>
          <button
            onClick={onShowAR}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors">
            <Smartphone size={16} />
            Mở AR trên điện thoại
          </button>
        </div>
      </div>
    </div>
  );
};

export default Model3DViewer;
