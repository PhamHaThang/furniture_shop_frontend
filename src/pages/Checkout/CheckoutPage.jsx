import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "../../components/common";
import { useAuth, useCart } from "../../contexts";
import { orderService, userService } from "../../services";
import { FREE_SHIPPING_THRESHOLD, ROUTES, SHIPPING_FEE } from "../../config";
import { generateBankTransferContent } from "../../utils";
import toast from "react-hot-toast";
import {
  StepIndicator,
  AddressSection,
  PaymentSection,
  OrderSummary,
  OrderConfirmation,
} from "./components";
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { items, totalAmount, discount, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping Info
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    province: "",
    district: "",
    ward: "",
    address: "",
    // Payment
    paymentMethod: "COD",
    // Notes
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [contentBank, setContentBank] = useState(generateBankTransferContent());
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để tiếp tục thanh toán");
      navigate(ROUTES.LOGIN);
      return;
    }
    if (items.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống");
      navigate(ROUTES.CART);
      return;
    }
    // Fetch user's saved addresses
    const fetchAddresses = async () => {
      try {
        const response = await userService.getAddresses();
        setAddresses(response.addresses || []);
        const selected =
          response.addresses?.find((addr) => addr.isDefault) || null;
        setSelectedAddress(selected);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };
    fetchAddresses();
  }, [isAuthenticated, items, navigate, user]);
  const subtotal = totalAmount;
  const shippingFee = totalAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const discountAmount = discount || 0;
  const total = subtotal + shippingFee - discountAmount;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const validateStep1 = () => {
    const newErrors = {};

    if (!selectedAddress && !useNewAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng hoặc nhập địa chỉ mới");
      return false;
    }

    if (useNewAddress) {
      if (!formData.fullName.trim())
        newErrors.fullName = "Vui lòng nhập họ và tên";
      if (!formData.phone.trim())
        newErrors.phone = "Vui lòng nhập số điện thoại";
      if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
      if (!formData.province.trim())
        newErrors.province = "Vui lòng nhập tỉnh/thành phố";
      if (!formData.district.trim())
        newErrors.district = "Vui lòng nhập quận/huyện";
      if (!formData.ward.trim()) newErrors.ward = "Vui lòng nhập phường/xã";
      if (!formData.address.trim())
        newErrors.address = "Vui lòng nhập địa chỉ cụ thể";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const validateStep2 = () => {
    if (!formData.paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return false;
    }
    if (formData.paymentMethod === "BANK" && !paymentVerified) {
      toast.error("Vui lòng xác nhận thanh toán trước khi tiếp tục");
      return false;
    }
    return true;
  };

  const handleNextFromPayment = () => {
    if (validateStep2()) {
      setStep(3);
    }
  };
  const handleCheckPayment = async () => {
    setCheckingPayment(true);
    try {
      const checkPaymentUrl = import.meta.env.VITE_CHECK_PAYMENT_URL_API;
      const response = await fetch(`${checkPaymentUrl}`);
      const data = await response.json();
      if (data && data.data && Array.isArray(data.data)) {
        const matchedTransaction = data.data.find((transaction) => {
          const description = transaction["Mô tả"].toUpperCase() || "";
          const checkContentBank = description.includes(
            contentBank.toUpperCase()
          );
          const checkAmount = Number(transaction["Số tiền"]) === total;
          // Demo thì để là true, về sau đổi lại thành checkAmount && checkContentBank
          return true;
        });
        if (matchedTransaction) {
          setPaymentVerified(true);
          setTransactionId(matchedTransaction["Mã GD"]);
          toast.success("Xác nhận thanh toán thành công!");
        } else {
          toast.error(
            "Chưa tìm thấy giao dịch thanh toán. Vui lòng thử lại sau."
          );
        }
      } else {
        toast.error("Không thể kiểm tra thanh toán. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast.error("Xác nhận thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setCheckingPayment(false);
    }
  };

  const handleAddressSelect = (addr) => {
    setSelectedAddress(addr);
    setUseNewAddress(false);
  };

  const handleNewAddressToggle = () => {
    setUseNewAddress(true);
  };

  const handlePaymentMethodChange = (e) => {
    handleInputChange(e);
    setPaymentVerified(false);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const shippingAddress = useNewAddress
        ? {
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            province: formData.province,
            district: formData.district,
            ward: formData.ward,
            address: formData.address,
          }
        : selectedAddress;
      const orderData = {
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
        paymentMethod: formData.paymentMethod.toUpperCase(),
        notes: formData.notes,
        transactionId: formData.paymentMethod === "BANK" ? transactionId : null,
      };
      const res = await orderService.createOrder(orderData);
      clearCart();
      toast.success("Đặt hàng thành công!");
      navigate(ROUTES.ORDER_DETAIL.replace(":id", res.order?.code));
    } catch (error) {
      console.error("Order submission failed:", error);
      toast.error(error.message || "Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Giỏ hàng", path: ROUTES.CART },
          { label: "Thanh toán" },
        ]}
        className="mb-6"
      />

      <h1 className="text-2xl font-bold text-char-900 mb-8">Thanh toán</h1>

      {/* Steps Indicator */}
      <StepIndicator currentStep={step} onStepClick={setStep} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <AddressSection
              addresses={addresses}
              selectedAddress={selectedAddress}
              useNewAddress={useNewAddress}
              formData={formData}
              errors={errors}
              onAddressSelect={handleAddressSelect}
              onNewAddressToggle={handleNewAddressToggle}
              onInputChange={handleInputChange}
              onNext={handleNextStep}
            />
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <PaymentSection
              paymentMethod={formData.paymentMethod}
              paymentVerified={paymentVerified}
              checkingPayment={checkingPayment}
              notes={formData.notes}
              total={total}
              contentBank={contentBank}
              onPaymentMethodChange={handlePaymentMethodChange}
              onCheckPayment={handleCheckPayment}
              onNotesChange={handleInputChange}
              onBack={() => setStep(1)}
              onNext={handleNextFromPayment}
            />
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <OrderConfirmation
              shippingAddress={
                useNewAddress
                  ? {
                      fullName: formData.fullName,
                      phone: formData.phone,
                      email: formData.email,
                      province: formData.province,
                      district: formData.district,
                      ward: formData.ward,
                      address: formData.address,
                    }
                  : selectedAddress
              }
              paymentMethod={formData.paymentMethod}
              paymentVerified={paymentVerified}
              items={items}
              subtotal={subtotal}
              shippingFee={shippingFee}
              discountAmount={discountAmount}
              total={total}
              loading={loading}
              onBack={() => setStep(2)}
              onConfirm={handleSubmit}
              notes={formData.notes}
            />
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shippingFee={shippingFee}
            discountAmount={discountAmount}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
