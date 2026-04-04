import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
    message: string;
    type: NotificationType;
    onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    const icons = {
        success: <CheckCircle2 className="text-emerald-500" size={20} />,
        error: <AlertCircle className="text-rose-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
    };

    const bgColors = {
        success: 'bg-emerald-500/10 border-emerald-500/20',
        error: 'bg-rose-500/10 border-rose-500/20',
        info: 'bg-blue-500/10 border-blue-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-[100] flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-md shadow-2xl max-w-md ${bgColors[type]}`}
        >
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <p className="text-sm font-bold text-slate-900 leading-tight">
                {message}
            </p>
            <button
                onClick={onClose}
                className="ml-2 p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-900"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};
