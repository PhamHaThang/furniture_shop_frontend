import { useState, useEffect } from "react";
import { MapPin, Plus, Edit2, Trash2 } from "lucide-react";
import {
  Button,
  Input,
  Spinner,
  Modal,
  ConfirmModal,
} from "../../../components/ui";
import { userService } from "../../../services";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts";
const AddressTab = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState(null);
  const [errors, setErrors] = useState({});

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await userService.getAddresses();
      setAddresses(response.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Không thể tải địa chỉ");
    } finally {
      setLoadingAddresses(false);
    }
  };
  const resetAddressForm = () => {
    setAddressForm({
      fullName: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      address: "",
      isDefault: false,
    });
    setEditingAddress(null);
    setErrors({});
  };
  const openAddAddressModal = () => {
    resetAddressForm();
    setAddressForm((prev) => ({
      ...prev,
      fullName: user?.fullName || "",
      phone: user?.phone || "",
    }));
    setShowAddressModal(true);
  };
  const openEditAddressModal = (addr) => {
    setEditingAddress(addr);
    setAddressForm({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      province: addr.province || "",
      district: addr.district || "",
      ward: addr.ward || "",
      address: addr.address || "",
      isDefault: addr.isDefault || false,
    });
    setShowAddressModal(true);
  };
  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const validateAddressForm = () => {
    const newErrors = {};
    if (!addressForm.fullName.trim())
      newErrors.fullName = "Vui lòng nhập họ tên";
    if (!addressForm.phone.trim())
      newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!addressForm.province.trim())
      newErrors.province = "Vui lòng nhập tỉnh/thành phố";
    if (!addressForm.district.trim())
      newErrors.district = "Vui lòng nhập quận/huyện";
    if (!addressForm.ward.trim()) newErrors.ward = "Vui lòng nhập phường/xã";
    if (!addressForm.address.trim())
      newErrors.address = "Vui lòng nhập địa chỉ chi tiết";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddressForm()) return;
    setLoading(true);
    try {
      if (editingAddress) {
        await userService.updateAddress(editingAddress._id, addressForm);
        toast.success("Cập nhật địa chỉ thành công");
      } else {
        await userService.addAddress(addressForm);
        toast.success("Thêm địa chỉ thành công");
      }
      setShowAddressModal(false);
      fetchAddresses();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Lưu địa chỉ thất bại");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteAddress = async () => {
    if (!deletingAddressId) return;
    setLoading(true);
    try {
      await userService.deleteAddress(deletingAddressId);
      toast.success("Xóa địa chỉ thành công");
      setShowDeleteConfirm(false);
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error(error.message || "Xóa địa chỉ thất bại");
    } finally {
      setLoading(false);
    }
  };
  const confirmDeleteAddress = (addressId) => {
    setDeletingAddressId(addressId);
    setShowDeleteConfirm(true);
  };
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-char-900">Sổ địa chỉ</h2>
        <Button onClick={openAddAddressModal}>
          <Plus size={18} className="mr-2" />
          Thêm địa chỉ
        </Button>
      </div>

      {loadingAddresses ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin size={48} className="mx-auto text-char-300 mb-4" />
          <p className="text-char-500 mb-4">Bạn chưa có địa chỉ nào</p>
          <Button onClick={openAddAddressModal}>
            <Plus size={18} className="mr-2" />
            Thêm địa chỉ mới
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`p-4 border rounded-lg ${
                addr.isDefault
                  ? "border-primary-500 bg-primary-50"
                  : "border-beige-200"
              }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-char-900">
                      {addr.fullName}
                    </span>
                    <span className="text-char-400">|</span>
                    <span className="text-char-600">{addr.phone}</span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="text-char-600">
                    {addr.address}, {addr.ward}, {addr.district},{" "}
                    {addr.province}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => openEditAddressModal(addr)}
                    className="p-2 text-char-500 hover:text-primary-500 hover:bg-beige-100 rounded-lg transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => confirmDeleteAddress(addr._id)}
                    className="p-2 text-char-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          resetAddressForm();
        }}
        title={editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        size="md">
        <form onSubmit={handleAddressFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Họ và tên"
              name="fullName"
              value={addressForm.fullName}
              onChange={handleAddressFormChange}
              error={errors.fullName}
              required
            />
            <Input
              label="Số điện thoại"
              name="phone"
              value={addressForm.phone}
              onChange={handleAddressFormChange}
              error={errors.phone}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Tỉnh/Thành phố"
              name="province"
              value={addressForm.province}
              onChange={handleAddressFormChange}
              error={errors.province}
              required
            />
            <Input
              label="Quận/Huyện"
              name="district"
              value={addressForm.district}
              onChange={handleAddressFormChange}
              error={errors.district}
              required
            />
            <Input
              label="Phường/Xã"
              name="ward"
              value={addressForm.ward}
              onChange={handleAddressFormChange}
              error={errors.ward}
              required
            />
          </div>
          <Input
            label="Địa chỉ chi tiết"
            name="address"
            value={addressForm.address}
            onChange={handleAddressFormChange}
            error={errors.address}
            placeholder="Số nhà, tên đường..."
            required
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isDefault"
              checked={addressForm.isDefault}
              onChange={handleAddressFormChange}
              className="w-4 h-4 text-primary-500 border-beige-300 rounded focus:ring-primary-500"
            />
            <span className="text-char-700">Đặt làm địa chỉ mặc định</span>
          </label>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddressModal(false);
                resetAddressForm();
              }}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Đang lưu...
                </>
              ) : editingAddress ? (
                "Cập nhật"
              ) : (
                "Thêm địa chỉ"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingAddressId(null);
        }}
        onConfirm={handleDeleteAddress}
        title="Xóa địa chỉ"
        message="Bạn có chắc muốn xóa địa chỉ này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
        loading={loading}
      />
    </>
  );
};

export default AddressTab;
