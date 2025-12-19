import { AlertTriangle, Trash2, X } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "danger", // danger, warning, info
  loading = false,
}) => {
  const icons = {
    danger: <Trash2 className="w-12 h-12 text-red-500" />,
    warning: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
    info: <AlertTriangle className="w-12 h-12 text-blue-500" />,
  };

  const confirmVariants = {
    danger: "danger",
    warning: "primary",
    info: "primary",
  };

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
      <div className="text-center py-4">
        {/* Icon */}
        <div className="flex justify-center mb-4">{icons[variant]}</div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-char-900 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-char-600 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={confirmVariants[variant]}
            onClick={handleConfirm}
            loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
