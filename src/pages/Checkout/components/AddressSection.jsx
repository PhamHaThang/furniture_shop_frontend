import { Link } from "react-router-dom";
import { MapPin, ArrowLeft } from "lucide-react";
import { Button, Input } from "../../../components/ui";
import { ROUTES } from "../../../config";

const AddressSection = ({
  addresses,
  selectedAddress,
  useNewAddress,
  formData,
  errors,
  onAddressSelect,
  onNewAddressToggle,
  onInputChange,
  onNext,
}) => {
  return (
    <div className="bg-white rounded-xl border border-beige-200 p-6">
      <h2 className="text-lg font-semibold text-char-900 mb-6 flex items-center">
        <MapPin className="mr-2 text-primary-500" size={20} />
        Địa chỉ giao hàng
      </h2>

      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div className="space-y-4 mb-6">
          <p className="font-medium text-char-700">Địa chỉ đã lưu:</p>
          {addresses.map((addr) => (
            <label
              key={addr._id}
              className={`flex items-start p-4 border rounded-lg cursor-pointer ${
                selectedAddress?._id === addr._id && !useNewAddress
                  ? "border-primary-500 bg-primary-50"
                  : "border-beige-200"
              }`}>
              <input
                type="radio"
                name="address"
                checked={selectedAddress?._id === addr._id && !useNewAddress}
                onChange={() => onAddressSelect(addr)}
                className="mt-1 mr-3"
              />
              <div>
                <p className="font-medium text-char-900">
                  {addr.fullName} - {addr.phone}
                </p>
                <p className="text-char-600">
                  {addr.address}, {addr.ward}, {addr.district}, {addr.province}
                </p>
                {addr.isDefault && (
                  <span className="text-xs text-primary-500 mt-1 inline-block">
                    Mặc định
                  </span>
                )}
              </div>
            </label>
          ))}
        </div>
      )}

      {/* New Address Toggle */}
      <label
        className={`flex items-center p-4 border rounded-lg cursor-pointer mb-4 ${
          useNewAddress
            ? "border-primary-500 bg-primary-50"
            : "border-beige-200"
        }`}>
        <input
          type="radio"
          name="address"
          checked={useNewAddress}
          onChange={onNewAddressToggle}
          className="mr-3"
        />
        <span className="font-medium">Sử dụng địa chỉ mới</span>
      </label>

      {/* New Address Form */}
      {useNewAddress && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Input
            label="Họ và tên"
            name="fullName"
            value={formData.fullName}
            onChange={onInputChange}
            error={errors.fullName}
            required
          />
          <Input
            label="Số điện thoại"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            error={errors.phone}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onInputChange}
            error={errors.email}
            required
            className="md:col-span-2"
          />
          <Input
            label="Tỉnh/Thành phố"
            name="province"
            value={formData.province}
            onChange={onInputChange}
            error={errors.province}
            required
          />
          <Input
            label="Quận/Huyện"
            name="district"
            value={formData.district}
            onChange={onInputChange}
            error={errors.district}
            required
          />
          <Input
            label="Phường/Xã"
            name="ward"
            value={formData.ward}
            onChange={onInputChange}
            error={errors.ward}
            required
          />
          <Input
            label="Địa chỉ chi tiết"
            name="address"
            value={formData.address}
            onChange={onInputChange}
            error={errors.address}
            required
          />
        </div>
      )}

      <div className="flex justify-between mt-6">
        <Link to={ROUTES.CART}>
          <Button variant="outline">
            <ArrowLeft className="mr-2" size={18} />
            Quay lại
          </Button>
        </Link>
        <Button onClick={onNext}>Tiếp tục</Button>
      </div>
    </div>
  );
};

export default AddressSection;
