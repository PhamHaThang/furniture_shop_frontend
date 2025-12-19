import { X } from "lucide-react";
import { useEffect, useCallback } from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showClose = true,
  closeOnOverlay = true,
}) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className={`
          relative bg-white rounded-xl shadow-xl w-full ${sizes[size]} 
          max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200
        `}>
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-beige-200">
            {title && (
              <h2 className="text-xl font-semibold text-char-900">{title}</h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="p-1 text-char-400 hover:text-char-600 hover:bg-beige-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-130px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
