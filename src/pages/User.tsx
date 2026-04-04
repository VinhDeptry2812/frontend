import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit, Trash2, Plus, X, Loader2 } from 'lucide-react';
import api from '../services/api';

interface UserType {
    _id?: string;
    id?: string | number;
    name: string;
    email: string;
    is_active: number | string;
}

const UserPage: React.FC = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);
    const [formData, setFormData] = useState<UserType>({ name: '', email: '', is_active: 1 });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users');
            setUsers(Array.isArray(response.data) ? response.data : (response.data?.data || []));
        } catch (error) {
            console.error("Lỗi khi tải danh sách người dùng:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (currentUser) {
                await api.put(`/users/${currentUser._id || currentUser.id}`, formData);
            } else {
                await api.post('/users', formData);
            }
            fetchUsers();
            setIsModalOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-32 bg-background-dark text-white min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold">Quản lý Người dùng</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary px-6 py-2 rounded-xl font-bold flex items-center gap-2">
                    <Plus size={18} /> Thêm mới
                </button>
            </div>
            {/* Simple Table for brevity in this fix */}
            <div className="bg-surface-dark rounded-2xl border border-slate-800 p-6">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400 uppercase text-xs tracking-widest">
                                <th className="pb-4">Họ Tên</th>
                                <th className="pb-4">Email</th>
                                <th className="pb-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={String(user.id || user._id)} className="border-b border-slate-800/50">
                                    <td className="py-4 font-medium">{user.name}</td>
                                    <td className="py-4 text-slate-400">{user.email}</td>
                                    <td className="py-4 text-right">
                                        <div className="flex justify-end gap-4">
                                            <button className="text-slate-500 hover:text-white"><Edit size={16} /></button>
                                            <button className="text-slate-500 hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UserPage;
