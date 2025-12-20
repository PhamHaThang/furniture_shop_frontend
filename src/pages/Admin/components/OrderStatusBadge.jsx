import { STATUS_ORDERS_MAP } from "../../../config";

const OrderStatusBadge = ({ status }) => {
  const config = STATUS_ORDERS_MAP[status] || STATUS_ORDERS_MAP.pending;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
