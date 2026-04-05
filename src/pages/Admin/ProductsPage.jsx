import { ProductModal } from "./components";
import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Edit2, Trash2, RefreshCw } from "lucide-react";
import { brandService, categoryService, adminService } from "../../services";
import { formatPrice } from "../../utils";
import { PLACEHOLDER_IMAGE } from "../../config";
import toast from "react-hot-toast";
import {
    Button,
    ConfirmModal,
    Input,
    Select,
    Pagination,
} from "../../components";
const ProductsPage = () => {
    const CLUSTER_FILTER_FETCH_LIMIT = 5000;
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        category: "",
        brand: "",
        deleted: "all",
        clusterLabel: "",
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [clusterLabelOptions, setClusterLabelOptions] = useState([
        { value: "", label: "Tất cả nhãn cụm" },
        { value: "__unclustered", label: "Chưa phân cụm" },
    ]);

    const attachProductClusterLabels = (productList = [], clusterResponse) => {
        const clusterRows = clusterResponse?.clustering?.clusters || [];
        const clusterMap = new Map(
            clusterRows.map((item) => [String(item.id), item]),
        );

        return productList.map((product) => {
            const clusterInfo = clusterMap.get(String(product._id));
            return {
                ...product,
                cluster: Number.isFinite(Number(clusterInfo?.cluster))
                    ? Number(clusterInfo.cluster)
                    : null,
                clusterLabel: clusterInfo?.cluster_label || null,
            };
        });
    };

    const applyClusterFilter = (productList = [], clusterFilterValue = "") => {
        if (!clusterFilterValue) return productList;
        if (clusterFilterValue === "__unclustered") {
            return productList.filter((item) => !item.clusterLabel);
        }
        if (clusterFilterValue.startsWith("cluster:")) {
            const clusterId = Number(
                clusterFilterValue.replace("cluster:", ""),
            );
            return productList.filter((item) => {
                if (item.cluster === null || item.cluster === undefined) {
                    return false;
                }
                return Number(item.cluster) === clusterId;
            });
        }
        return productList;
    };

    const buildClusterLabelOptions = (clusterResponse) => {
        const summaries = clusterResponse?.clustering?.cluster_summaries || [];
        const clusterOptions = summaries
            .map((item) => ({
                value: `cluster:${Number(item?.cluster)}`,
                label: `C${Number(item?.cluster)}: ${item?.label || `Cluster ${Number(item?.cluster)}`}`,
                sortCluster: Number(item?.cluster),
            }))
            .filter((item) => Number.isFinite(item.sortCluster))
            .sort((a, b) => a.sortCluster - b.sortCluster)
            .map(({ value, label }) => ({ value, label }));

        return [
            { value: "", label: "Tất cả nhãn cụm" },
            ...clusterOptions,
            { value: "__unclustered", label: "Chưa phân cụm" },
        ];
    };

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const shouldFilterByCluster = Boolean(filters.clusterLabel);
            const productParams = {
                page: shouldFilterByCluster ? 1 : pagination.page,
                limit: shouldFilterByCluster
                    ? CLUSTER_FILTER_FETCH_LIMIT
                    : pagination.limit,
                search,
                category: filters.category,
                brand: filters.brand,
                deleted: filters.deleted,
            };

            const [response, clusterResponse] = await Promise.all([
                adminService.getProducts(productParams),
                adminService
                    .getMLClusters({ clusterType: "products", clusters: 4 })
                    .catch(() => null),
            ]);

            const baseList = response.products || [];
            const listWithClusterLabels = attachProductClusterLabels(
                response.products || [],
                clusterResponse,
            );

            if (shouldFilterByCluster) {
                const clusterFiltered = applyClusterFilter(
                    listWithClusterLabels,
                    filters.clusterLabel,
                );
                const total = clusterFiltered.length;
                const totalPages =
                    total > 0 ? Math.ceil(total / pagination.limit) : 0;
                const safePage = totalPages
                    ? Math.min(pagination.page, totalPages)
                    : 1;
                const start = (safePage - 1) * pagination.limit;
                const pagedItems = clusterFiltered.slice(
                    start,
                    start + pagination.limit,
                );

                setProducts(pagedItems);
                setPagination((prev) => ({
                    ...prev,
                    page: safePage,
                    total,
                    totalPages,
                }));
            } else {
                setProducts(listWithClusterLabels);
                setPagination((prev) => ({
                    ...prev,
                    total: response.pagination?.total || baseList.length,
                    totalPages: response.pagination?.totalPages || 0,
                }));
            }

            setClusterLabelOptions(buildClusterLabelOptions(clusterResponse));
        } catch (error) {
            toast.error(error.message || "Không thể tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    }, [
        pagination.page,
        pagination.limit,
        search,
        filters.category,
        filters.brand,
        filters.deleted,
        filters.clusterLabel,
    ]);
    const fetchCategoriesAndBrands = async () => {
        try {
            const [categoriesData, brandsData] = await Promise.all([
                categoryService.getAllCategories(),
                brandService.getAllBrands(),
            ]);
            console.log(categoriesData, brandsData);
            setCategories(categoriesData.categories || []);
            setBrands(brandsData.brands || []);
        } catch (error) {
            toast.error(
                error.message ||
                    "Không thể tải danh sách thể loại và thương hiệu",
            );
        }
    };

    useEffect(() => {
        fetchCategoriesAndBrands();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);
    const handleEdit = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };
    const handleAdd = () => {
        setSelectedProduct(null);
        setModalOpen(true);
    };
    const handleSave = async (data, product) => {
        setLoading(true);
        try {
            if (product) {
                await adminService.updateProduct(product._id, data);
                toast.success("Cập nhật sản phẩm thành công");
            } else {
                await adminService.createProduct(data);
                toast.success("Tạo sản phẩm thành công");
            }
            setModalOpen(false);
            fetchProducts();
        } catch (error) {
            toast.error(error.message || "Không thể lưu sản phẩm");
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (productId) => {
        setLoading(true);
        try {
            await adminService.deleteProduct(productId);
            toast.success("Xóa sản phẩm thành công");
            fetchProducts();
        } catch (error) {
            toast.error(error.message || "Không thể xóa sản phẩm");
        } finally {
            setLoading(false);
            setDeleteConfirm(null);
        }
    };
    const handleRestore = async (id) => {
        try {
            await adminService.updateProduct(id, { isDeleted: false });
            toast.success("Khôi phục sản phẩm thành công");
            fetchProducts();
        } catch (error) {
            toast.error(error.message || "Có lỗi xảy ra");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-char-900">
                        Quản lý sản phẩm
                    </h1>
                    <p className="text-gray-500">
                        Quản lý danh sách sản phẩm trong cửa hàng
                    </p>
                </div>
                <Button
                    onClick={handleAdd}
                    variant="primary"
                    leftIcon={<Plus />}>
                    Thêm sản phẩm
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="lg:col-span-2">
                        <Input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPagination((prev) => ({ ...prev, page: 1 }));
                            }}
                            placeholder="Tìm kiếm sản phẩm..."
                            leftIcon={<Search />}
                        />
                    </div>
                    <Select
                        placeholder=""
                        value={filters.category}
                        onChange={(e) => {
                            setFilters((prev) => ({
                                ...prev,
                                category: e.target.value,
                            }));
                            setPagination((prev) => ({ ...prev, page: 1 }));
                        }}
                        options={[
                            { value: "", label: "Tất cả danh mục" },
                        ].concat(
                            categories.map((cat) => ({
                                value: cat._id,
                                label: cat.name,
                            })),
                        )}
                    />
                    <Select
                        placeholder=""
                        value={filters.brand}
                        onChange={(e) => {
                            setFilters((prev) => ({
                                ...prev,
                                brand: e.target.value,
                            }));
                            setPagination((prev) => ({ ...prev, page: 1 }));
                        }}
                        options={[
                            { value: "", label: "Tất cả thương hiệu" },
                        ].concat(
                            brands.map((brand) => ({
                                value: brand._id,
                                label: brand.name,
                            })),
                        )}
                    />
                    <Select
                        placeholder=""
                        value={filters.deleted}
                        onChange={(e) => {
                            setFilters((prev) => ({
                                ...prev,
                                deleted: e.target.value,
                            }));
                            setPagination((prev) => ({ ...prev, page: 1 }));
                        }}
                        options={[
                            { value: "all", label: "Tất cả" },
                            { value: "active", label: "Đang bán" },
                            { value: "deleted", label: "Đã xóa" },
                        ]}
                    />
                    <Select
                        placeholder=""
                        value={filters.clusterLabel}
                        onChange={(e) => {
                            setFilters((prev) => ({
                                ...prev,
                                clusterLabel: e.target.value,
                            }));
                            setPagination((prev) => ({ ...prev, page: 1 }));
                        }}
                        options={clusterLabelOptions}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sản phẩm
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Danh mục
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nhãn cụm
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giá
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tồn kho
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đã bán
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-6 py-12 text-center text-gray-500">
                                        Không tìm thấy sản phẩm phù hợp bộ lọc
                                        cụm
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr
                                        key={product._id}
                                        className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                    {product.images?.[0] ? (
                                                        <img
                                                            src={
                                                                product
                                                                    .images[0]
                                                            }
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={
                                                                PLACEHOLDER_IMAGE
                                                            }
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-char-900 truncate max-w-xs">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {product.brand?.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.category?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {product.clusterLabel ? (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700">
                                                    C{product.cluster}:{" "}
                                                    {product.clusterLabel}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                                                    Chưa phân cụm
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="font-medium text-char-900">
                                                    {formatPrice(product.price)}
                                                </p>
                                                {product.originalPrice >
                                                    product.price && (
                                                    <p className="text-sm text-gray-400 line-through">
                                                        {formatPrice(
                                                            product.originalPrice,
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    product.stock > 10
                                                        ? "bg-green-100 text-green-700"
                                                        : product.stock > 0
                                                          ? "bg-yellow-100 text-yellow-700"
                                                          : "bg-red-100 text-red-700"
                                                }`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {product.isDeleted ? (
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                                    Đã xóa
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                                    Đang bán
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.soldCount || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {product.isDeleted ? (
                                                    <button
                                                        onClick={() =>
                                                            handleRestore(
                                                                product._id,
                                                            )
                                                        }
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                                        title="Khôi phục">
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    product,
                                                                )
                                                            }
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                            title="Chỉnh sửa">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setDeleteConfirm(
                                                                    product,
                                                                )
                                                            }
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                            title="Xóa">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t">
                    <p className="text-sm text-gray-500">
                        Hiển thị {(pagination.page - 1) * pagination.limit + 1}{" "}
                        -{" "}
                        {Math.min(
                            pagination.page * pagination.limit,
                            pagination.total,
                        )}{" "}
                        trong {pagination.total} kết quả
                    </p>
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={(page) =>
                            setPagination((prev) => ({ ...prev, page }))
                        }
                    />
                </div>
            </div>

            {/* Modal */}
            <ProductModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedProduct(null);
                }}
                product={selectedProduct}
                onSave={handleSave}
                categories={categories}
                brands={brands}
            />
            {/* Delete Confirmation */}
            {deleteConfirm && (
                <ConfirmModal
                    title="Xác nhận xóa"
                    message={`Bạn có chắc chắn muốn xóa sản phẩm ${deleteConfirm.name}?`}
                    isOpen={Boolean(deleteConfirm)}
                    onClose={() => setDeleteConfirm(null)}
                    onConfirm={() => handleDelete(deleteConfirm._id)}
                />
            )}
        </div>
    );
};

export default ProductsPage;
