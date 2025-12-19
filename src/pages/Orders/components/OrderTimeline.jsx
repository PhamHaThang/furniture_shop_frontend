import { CheckCircle } from "lucide-react";

const OrderTimeline = ({ status }) => {
  const steps = [
    { key: "pending", label: "Đặt hàng", completed: true },
    {
      key: "processing",
      label: "Xử lý",
      completed: ["processing", "shipped", "delivered"].includes(status),
    },
    {
      key: "shipped",
      label: "Đang giao",
      completed: ["shipped", "delivered"].includes(status),
    },
    {
      key: "delivered",
      label: "Đã giao",
      completed: status === "delivered",
    },
  ];

  if (status === "cancelled") {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-beige-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex-1 relative">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                  step.completed
                    ? "bg-green-500 text-white"
                    : "bg-beige-200 text-char-400"
                }`}>
                {step.completed ? <CheckCircle size={20} /> : index + 1}
              </div>
              <span
                className={`text-sm mt-2 text-center ${
                  step.completed
                    ? "text-green-600 font-medium"
                    : "text-char-400"
                }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-1 ${
                  steps[index + 1].completed ? "bg-green-500" : "bg-beige-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTimeline;
