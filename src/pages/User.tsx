import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit, Trash2, Plus, X, Search, Loader2 } from 'lucide-react';
import api from '../services/api';

interface UserType {
    _id?: string; // MongoDB thường dùng _id
    id?: string | number;
    name: string;
    email: string;
    is_active: number | string; // 1 hoặc 0 (True/False)
}

export const User: React.FC = () => {
    // State lưu trữ danh sách người dùng
    const [users, setUsers] = useState<UserType[]>([]);
    // State quản lý việc loading dữ liệu
    const [loading, setLoading] = useState<boolean>(true);
    // State quản lý việc hiển thị Modal (Popup form thêm/sửa)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    // State lưu trữ người dùng đang được chọn để chỉnh sửa (null nếu là chế độ thêm mới)
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [formData, setFormData] = useState<UserType>({
        name: '',
        email: '',
        is_active: 1
    });
    // State để xử lý đang Submit Form
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Dùng useEffect để gọi API lấy danh sách user ngay khi component được render lần đầu
    useEffect(() => {
        fetchUsers();
    }, []);

    // Hàm gọi API [LẤY DANH SÁCH - READ]
    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Giả định backend có API GET /users
            const response = await api.get('/users');
            console.log("Dữ liệu trả về từ /users API:", response.data);

            // Xử lý an toàn: lấy mảng từ cấu trúc trả về hoặc mặc định là mảng rỗng []
            let userData = [];

            // Backend trả về: response.data.data.data (Laravel Pagination Format)
            if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                userData = response.data.data.data;
            }
            // Fallback 1: response.data.data (API chuẩn thường thấy)
            else if (response.data?.data && Array.isArray(response.data.data)) {
                userData = response.data.data;
            }
            // Fallback 2: Trả về thẳng mảng
            else if (Array.isArray(response.data)) {
                userData = response.data;
            }
            // Fallback 3: response.data.users
            else if (response.data?.users && Array.isArray(response.data.users)) {
                userData = response.data.users;
            }

            setUsers(userData);
        } catch (error) {
            console.error("Lỗi khi tải danh sách người dùng:", error);
            alert("Không thể tải danh sách người dùng. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm Mở Modal để [THÊM MỚI]
    const handleOpenAddModal = () => {
        setCurrentUser(null);
        setFormData({ name: '', email: '', is_active: 1 });
        setIsModalOpen(true);
    };

    // Hàm Mở Modal để [CHỈNH SỬA]
    const handleOpenEditModal = (user: UserType) => {
        setCurrentUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            is_active: user.is_active !== undefined ? user.is_active : 1
        });
        setIsModalOpen(true);
    };

    // Hàm Đóng Modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
    };

    // Xử lý khi Form thay đổi dữ liệu
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Hàm Xử lý LƯU: [THÊM MỚI hoặc SỬA]
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (currentUser) {
                // Nếu có currentUser -> Là chế độ SỬA (UPDATE)
                const userId = currentUser._id || currentUser.id;
                await api.put(`/users/${userId}`, formData);
                alert("Cập nhật người dùng thành công");
            } else {
                // Nếu không có -> Là chế độ THÊM MỚI (CREATE)
                await api.post('/users', formData);
                alert("Thêm người dùng thành công");
            }

            // Tải lại danh sách sau khi Lưu
            fetchUsers();
            // Đóng Modal
            handleCloseModal();
        } catch (error: any) {
            console.error("Lỗi khi lưu người dùng:", error);
            alert(error.response?.data?.message || "Đã có lỗi xảy ra khi lưu dữ liệu");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hàm Xử lý XÓA [DELETE]
    const handleDelete = async (id?: string | number) => {
        if (!id) return;

        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/users/${id}`);
            alert("Đã xóa người dùng thành công!");
            // Gọi hàm tải lại danh sách
            fetchUsers();
        } catch (error: any) {
            console.error("Lỗi khi xóa người dùng:", error);
            alert(error.response?.data?.message || "Không thể xóa người dùng này");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý Người dùng</h1>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-opacity-90 transition-all font-sans"
                >
                    <Plus size={18} />
                    <span>Thêm Người dùng</span>
                </button>
            </div>

            {/* Bảng Danh sách */}
            <div className="bg-surface-dark rounded-2xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-bold border-b border-slate-800">Tên</th>
                                <th className="px-6 py-4 font-bold border-b border-slate-800">Email</th>
                                <th className="px-6 py-4 font-bold border-b border-slate-800">Trạng thái</th>
                                <th className="px-6 py-4 font-bold border-b border-slate-800 text-right">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center text-slate-400">
                                        <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center text-slate-400">
                                        Không có dữ liệu người dùng.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => {
                                    const userId = user._id || user.id;
                                    return (
                                        <tr key={userId} className="border-b border-slate-800 hover:bg-slate-800/20 transition-colors">
                                            <td className="px-6 py-4 font-medium">{user.name}</td>
                                            <td className="px-6 py-4 text-slate-300">{user.email}</td>
                                            <td className="px-6 py-4 capitalize">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${Number(user.is_active) === 1 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                                                    {Number(user.is_active) === 1 ? 'Hoạt động' : 'Khóa'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button onClick={() => handleOpenEditModal(user)} className="text-slate-400 hover:text-white transition-colors">
                                                        <Edit size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(userId)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form Thêm / Sửa */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-surface-dark border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-slate-800">
                                <h3 className="text-xl font-bold">
                                    {currentUser ? 'Chỉnh sửa Người dùng' : 'Thêm Người dùng mới'}
                                </h3>
                                <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Họ Tên</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-background-dark border border-slate-800 rounded-xl py-3 px-4 outline-none focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="Nhập họ và tên..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-background-dark border border-slate-800 rounded-xl py-3 px-4 outline-none focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="user@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Trạng thái</label>
                                    <select
                                        name="is_active"
                                        value={formData.is_active}
                                        onChange={handleInputChange}
                                        className="w-full bg-background-dark border border-slate-800 rounded-xl py-3 px-4 outline-none focus:ring-1 focus:ring-primary transition-all appearance-none"
                                    >
                                        <option value={1}>Hoạt động</option>
                                        <option value={0}>Khóa</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-6 py-3 rounded-xl font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-3 rounded-xl font-bold bg-primary text-white hover:bg-opacity-90 transition-colors flex items-center justify-center min-w-[120px]"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Lưu'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
