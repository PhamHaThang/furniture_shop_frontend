const TopSentimentProductsTable = ({ loading = false, products = [] }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-char-900 mb-4">
                Top sản phẩm theo sentiment tích cực
            </h3>

            {loading ? (
                <div className="py-10 text-center text-gray-500">
                    Đang tải dữ liệu ML...
                </div>
            ) : products.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sản phẩm
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tổng review
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Good
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bad
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tỉ lệ Good
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((item) => (
                                <tr
                                    key={item.product_id}
                                    className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-char-900">
                                        {item.name || "Sản phẩm"}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {item.total_reviews}
                                    </td>
                                    <td className="px-4 py-3 text-emerald-600">
                                        {item.good}
                                    </td>
                                    <td className="px-4 py-3 text-rose-600">
                                        {item.bad}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {Math.round(
                                            (item.good_ratio || 0) * 100,
                                        )}
                                        %
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="py-10 text-center text-gray-500">
                    Không có dữ liệu trong khoảng thời gian đã chọn.
                </div>
            )}
        </div>
    );
};

export default TopSentimentProductsTable;
