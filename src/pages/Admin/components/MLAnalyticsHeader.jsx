import { RefreshCw } from "lucide-react";
import { Button } from "../../../components";

const MLAnalyticsHeader = ({ loading = false, onRefresh, secondaryAction = null }) => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-char-900">
                    Admin ML Analytics
                </h1>
                <p className="text-gray-500">
                    Phân tích Recommendation, Clustering và Sentiment trong hệ thống theo thời gian.
                </p>
            </div>
            <div className="flex items-center gap-2">
                {secondaryAction}
                <Button
                    onClick={onRefresh}
                    variant="outline"
                    leftIcon={
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    }>
                    Làm mới dữ liệu
                </Button>
            </div>
        </div>
    );
};

export default MLAnalyticsHeader;
