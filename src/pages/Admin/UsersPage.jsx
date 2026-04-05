import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Plus, Edit2, Trash2, MapPin, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { adminService } from "../../services";
import { UserModal } from "./components";
import {
    Button,
    ConfirmModal,
    Input,
    Select,
    Pagination,
} from "../../components";
const UsersPage = () => {
    const CLUSTER_FILTER_FETCH_LIMIT = 5000;
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        deleted: "active",
        clusterLabel: "",
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const fetchVersionRef = useRef(0);
    const [clusterLabelOptions, setClusterLabelOptions] = useState([
        { value: "", label: "Tất cả nhãn cụm" },
        { value: "__unclustered", label: "Chưa phân cụm" },
    ]);

    const attachUserClusterLabels = (userList = [], clusterResponse) => {
        const clusterRows = clusterResponse?.clustering?.clusters || [];
        const clusterMap = new Map(
            clusterRows.map((item) => [String(item.id), item]),
        );

        return userList.map((user) => {
            const clusterInfo = clusterMap.get(String(user._id));
            return {
                ...user,
                cluster: Number.isFinite(Number(clusterInfo?.cluster))
                    ? Number(clusterInfo.cluster)
                    : null,
                clusterLabel: clusterInfo?.cluster_label || null,
            };
        });
    };

    const applyClusterFilter = (userList = [], clusterFilterValue = "") => {
        if (!clusterFilterValue) return userList;
        if (clusterFilterValue === "__unclustered") {
            return userList.filter((item) => !item.clusterLabel);
        }
        if (clusterFilterValue.startsWith("cluster:")) {
            const clusterId = Number(
                clusterFilterValue.replace("cluster:", ""),
            );
            return userList.filter((item) => {
                if (item.cluster === null || item.cluster === undefined) {
                    return false;
                }
                return Number(item.cluster) === clusterId;
            });
        }
        return userList;
    };

    const buildClusterLabelOptions = (clusterResponse) => {
        const summaries = clusterResponse?.clustering?.cluster_summaries || [];

        const clusterOptions = summaries
            .map((item) => ({
                value: `cluster:${Number(item?.cluster)}`,
                label: `C${Number(item?.cluster)}: ${item?.label || `Cluster ${Number(item?.cluster)}`} (${Number(item?.size) || 0})`,
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

    const fetchUsers = useCallback(async () => {
        const currentFetchVersion = ++fetchVersionRef.current;
        try {
            setLoading(true);
            const searchKeyword = search.trim();
            const clusterFromSearchMatch = searchKeyword.match(/^c(\d+)$/i);
            const effectiveClusterFilter =
                filters.clusterLabel ||
                (clusterFromSearchMatch
                    ? `cluster:${Number(clusterFromSearchMatch[1])}`
                    : "");
            const shouldFilterByCluster = Boolean(effectiveClusterFilter);
            const userParams = {
                page: shouldFilterByCluster ? 1 : pagination.page,
                limit: shouldFilterByCluster
                    ? CLUSTER_FILTER_FETCH_LIMIT
                    : pagination.limit,
                search: clusterFromSearchMatch ? "" : search,
                deleted: filters.deleted,
            };

            const [response, clusterResponse] = await Promise.all([
                adminService.getUsers(userParams),
                adminService
                    .getMLClusters({ clusterType: "users", clusters: 4 })
                    .catch(() => null),
            ]);

            const baseList = response.users || [];
            const listWithClusterLabels = attachUserClusterLabels(
                response.users || [],
                clusterResponse,
            );

            if (currentFetchVersion !== fetchVersionRef.current) {
                return;
            }

            if (shouldFilterByCluster) {
                const clusterFiltered = applyClusterFilter(
                    listWithClusterLabels,
                    effectiveClusterFilter,
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

                setUsers(pagedItems);
                setPagination((prev) => ({
                    ...prev,
                    page: safePage,
                    total,
                    totalPages,
                }));
            } else {
                setUsers(listWithClusterLabels);
                setPagination((prev) => ({
                    ...prev,
                    total: response.pagination?.total || baseList.length,
                    totalPages: response.pagination?.totalPages || 0,
                }));
            }

            setClusterLabelOptions(buildClusterLabelOptions(clusterResponse));
        } catch {
            if (currentFetchVersion !== fetchVersionRef.current) {
                return;
            }
            toast.error("Lấy danh sách người dùng thất bại.");
        } finally {
            if (currentFetchVersion === fetchVersionRef.current) {
                setLoading(false);
            }
        }
    }, [
        pagination.page,
        pagination.limit,
        search,
        filters.deleted,
        filters.clusterLabel,
    ]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);
    const handleAdd = () => {
        setSelectedUser(null);
        setModalOpen(true);
    };
    const handleEdit = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };
    const handleDelete = async (userId) => {
        try {
            setLoading(true);
            await adminService.deleteUserById(userId);
            toast.success("Xoá người dùng thành công.");
            fetchUsers();
        } catch (error) {
            toast.error(error.message || "Xoá người dùng thất bại.");
        } finally {
            setLoading(false);
            setDeleteConfirm(null);
        }
    };
    const handleRestore = async (id) => {
        try {
            await adminService.updateUserById(id, { isDeleted: false });
            toast.success("Khôi phục người dùng thành công");
            fetchUsers();
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
                        Quản lý người dùng
                    </h1>
                    <p className="text-gray-500">
                        Quản lý tài khoản người dùng trong hệ thống
                    </p>
                </div>
                <Button
                    onClick={handleAdd}
                    variant="primary"
                    leftIcon={<Plus className="w-5 h-5" />}>
                    Thêm người dùng
                </Button>
            </div>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input
                        placeholder="Tìm kiếm người dùng theo tên, email..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPagination((prev) => ({ ...prev, page: 1 }));
                        }}
                        leftIcon={<Search className="w-5 h-5 text-gray-400" />}
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
                            {
                                value: "active",
                                label: "Hoạt động",
                            },
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
                                    Người dùng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vai trò
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nhãn cụm
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số điện thoại
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày tạo
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
                                        colSpan={7}
                                        className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-gray-500">
                                        Không tìm thấy người dùng phù hợp bộ lọc
                                        cụm
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.fullName}
                                                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                                                        {user.fullName
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            "U"}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-char-900">
                                                        {user.fullName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {user.email}
                                                    </p>
                                                    {user.address &&
                                                        user.address.length >
                                                            0 && (
                                                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                                <MapPin className="w-3 h-3" />
                                                                {
                                                                    user.address
                                                                        .length
                                                                }{" "}
                                                                địa chỉ
                                                            </p>
                                                        )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                    user.role === "admin"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}>
                                                {user.role === "admin"
                                                    ? "Quản trị viên"
                                                    : "Người dùng"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.clusterLabel ? (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700">
                                                    C{user.cluster}:{" "}
                                                    {user.clusterLabel}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                                                    Chưa phân cụm
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.phone || "Chưa cập nhật"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.isDeleted ? (
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                                    Đã xóa
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                                    Hoạt động
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(
                                                user.createdAt,
                                            ).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {user.isDeleted ? (
                                                    <button
                                                        onClick={() =>
                                                            handleRestore(
                                                                user._id,
                                                            )
                                                        }
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Khôi phục">
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(user)
                                                            }
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                            title="Chỉnh sửa">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setDeleteConfirm(
                                                                    user,
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
            <UserModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
                onSave={fetchUsers}
            />
            {/* Delete Confirmation */}
            {deleteConfirm && (
                <ConfirmModal
                    title="Xác nhận xóa"
                    message={`Bạn có chắc chắn muốn xóa người dùng ${deleteConfirm.fullName}? Hành động này không thể hoàn tác.`}
                    isOpen={Boolean(deleteConfirm)}
                    onClose={() => setDeleteConfirm(null)}
                    onConfirm={() => handleDelete(deleteConfirm._id)}
                />
            )}
        </div>
    );
};

export default UsersPage;
