import { TrendingUp, TrendingDown } from "lucide-react";
const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-char-900">{value}</p>
          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 text-sm ${
                trend === "up" ? "text-green-500" : "text-red-500"
              }`}>
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
