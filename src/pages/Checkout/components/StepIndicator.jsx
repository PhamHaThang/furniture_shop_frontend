import { Check, MapPin, CreditCard, CheckCircle } from "lucide-react";

const steps = [
  { num: 1, label: "Địa chỉ", icon: MapPin },
  { num: 2, label: "Thanh toán", icon: CreditCard },
  { num: 3, label: "Xác nhận", icon: CheckCircle },
];

const StepIndicator = ({ currentStep, onStepClick }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((s, index) => (
        <div key={s.num} className="flex items-center">
          <button
            onClick={() => s.num < currentStep && onStepClick(s.num)}
            disabled={s.num > currentStep}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentStep === s.num
                ? "bg-primary-500 text-white"
                : currentStep > s.num
                ? "bg-green-500 text-white"
                : "bg-beige-200 text-char-500"
            }`}>
            {currentStep > s.num ? <Check size={18} /> : <s.icon size={18} />}
            <span className="hidden sm:inline">{s.label}</span>
          </button>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-1 mx-2 ${
                currentStep > s.num ? "bg-green-500" : "bg-beige-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
