import { PAYMENT_STATUS_CONFIG } from "../../../config";

const PaymentStatusBadge = ({ status }) => {
  const config = PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.pending;

  return (
    <span
      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};
export default PaymentStatusBadge;
