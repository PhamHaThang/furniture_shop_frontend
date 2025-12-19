import { MapPin } from "lucide-react";

const OrderShippingInfo = ({ shippingAddress }) => {
  if (!shippingAddress) return null;

  return (
    <div className="bg-white rounded-xl border border-beige-200 p-6">
      <h2 className="text-lg font-semibold text-char-900 mb-4 flex items-center">
        <MapPin className="mr-2 text-primary-500" size={20} />
        Địa chỉ giao hàng
      </h2>
      <div className="text-char-600">
        <p className="font-medium text-char-900">{shippingAddress.fullName}</p>
        <p>{shippingAddress.phone}</p>
        <p className="mt-2">
          {shippingAddress.address}, {shippingAddress.ward},{" "}
          {shippingAddress.district}, {shippingAddress.province}
        </p>
      </div>
    </div>
  );
};

export default OrderShippingInfo;
