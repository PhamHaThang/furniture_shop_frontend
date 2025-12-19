import { X, Scan, Smartphone } from "lucide-react";
import toast from "react-hot-toast";

const ARViewer = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product?.model3DUrl) return null;

  const handleActivateAR = () => {
    const modelViewer = document.getElementById("ar-model-viewer");
    console.log("Searching for AR model viewer...");
    console.log("Model viewer element:", modelViewer);

    if (modelViewer) {
      console.log("Model viewer found!");
      console.log("Has activateAR method:", typeof modelViewer.activateAR);

      // Đợi model-viewer load xong
      if (modelViewer.loaded) {
        console.log("Model is loaded, activating AR...");
        try {
          modelViewer.activateAR();
        } catch (error) {
          console.error("AR activation error:", error);
          toast.error("Không thể kích hoạt AR. Vui lòng thử lại.");
        }
      } else {
        console.log("Model not loaded yet, waiting...");
        toast.error("Đang tải mô hình 3D. Vui lòng đợi một chút.");
        modelViewer.addEventListener(
          "load",
          () => {
            console.log("Model loaded, trying AR again...");
            modelViewer.activateAR();
          },
          { once: true }
        );
      }
    } else {
      console.error("Model viewer not found!");
      console.log(
        "All model viewers:",
        document.querySelectorAll("model-viewer")
      );
      toast.error("Không tìm thấy mô hình 3D");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      id="ar-modal-container">
      <div className="relative w-full h-full">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
          <div className="text-white">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Scan size={20} />
              Trải nghiệm AR
            </h3>
            <p className="text-sm opacity-80">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* AR Viewer */}
        <model-viewer
          id="ar-model-viewer"
          src={product.model3DUrl}
          alt={`AR ${product.name}`}
          camera-controls
          shadow-intensity="1"
          exposure="1"
          style={{ width: "100%", height: "100%" }}
          poster={product.images?.[0]}
          loading="eager"
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          camera-orbit="0deg 75deg 105%"
          min-camera-orbit="auto auto 5%"
          max-camera-orbit="auto auto 500%"
          interaction-prompt="auto"
          interaction-prompt-threshold="0">
          {/* Loading */}
          <div
            slot="progress-bar"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "#eed7cc",
            }}>
            <div
              style={{
                height: "100%",
                background: "linear-gradient(to right, #c2846a, #eed7cc)",
                width: "0%",
                transition: "width 0.3s",
              }}></div>
          </div>
        </model-viewer>

        {/* AR Button  */}
        <button
          onClick={handleActivateAR}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-600 to-beige-600 text-white rounded-full font-semibold text-base sm:text-lg shadow-2xl flex items-center gap-2 sm:gap-3 hover:from-primary-700 hover:to-beige-700 transition-all transform hover:scale-105 z-20 cursor-pointer">
          <Smartphone size={20} className="sm:w-6 sm:h-6" />
          <span>Trải nghiệm AR</span>
        </button>

        {/* AR Instructions */}
        <div
          className="absolute left-4 right-4 bg-black/70 rounded-xl p-3 sm:p-4 text-white mx-auto max-w-md z-10"
          style={{ bottom: "110px" }}>
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Scan size={18} />
            Hướng dẫn sử dụng AR
          </h4>
          <ol className="space-y-2 text-xs sm:text-sm">
            <li className="flex gap-2">
              <span className="font-semibold text-primary-400">1.</span>
              <span>Nhấn nút "Trải nghiệm AR" phía dưới</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary-400">2.</span>
              <span>Di chuyển điện thoại để quét bề mặt xung quanh</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary-400">3.</span>
              <span>
                Chạm vào màn hình để đặt sản phẩm vào vị trí mong muốn
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary-400">4.</span>
              <span>Sử dụng 2 ngón tay để xoay, phóng to/thu nhỏ sản phẩm</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ARViewer;
