import { Sparkles } from "lucide-react";

const MLSentimentSummaryCards = ({
    sentiment = {},
    totalSentiment = 0,
    goodPercent = 0,
    badPercent = 0,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-gray-500">Good Reviews</p>
                </div>
                <p className="text-3xl font-bold text-char-900">
                    {sentiment.good || 0}
                </p>
                <p className="text-sm text-emerald-600 mt-1">{goodPercent}%</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-gray-500">Bad Reviews</p>
                </div>
                <p className="text-3xl font-bold text-char-900">
                    {sentiment.bad || 0}
                </p>
                <p className="text-sm text-rose-600 mt-1">{badPercent}%</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-gray-500">
                        Tổng Reviews ML xử lý
                    </p>
                </div>
                <p className="text-3xl font-bold text-char-900">
                    {totalSentiment}
                </p>
            </div>
        </div>
    );
};

export default MLSentimentSummaryCards;
