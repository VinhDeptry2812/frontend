import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Activity, 
  Calendar,
  ChevronRight,
  ShieldAlert,
  Camera,
  MapPin,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const AdminProfile: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  const infoItems = [
    { label: t('full_name'), value: user.name, icon: <User size={18} className="text-blue-500" /> },
    { label: 'Email', value: user.email, icon: <Mail size={18} className="text-rose-500" /> },
    { label: t('role_col'), value: t(`${user.role || 'staff'}_role`), icon: <ShieldCheck size={18} className="text-violet-500" />, badge: true },
    { label: t('status_col'), value: user.is_active ? t('active') : t('locked'), icon: <Activity size={18} className="text-emerald-500" />, status: true },
    { label: t('account_id'), value: `#${user.id}`, icon: <Calendar size={18} className="text-amber-500" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-primary/20 ring-4 ring-white">
              {user.name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 shadow-lg hover:text-primary transition-colors">
              <Camera size={18} />
            </button>
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{user.name}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm ${
                user.role === 'superadmin' 
                  ? 'bg-amber-50 text-amber-600 border-amber-200' 
                  : 'bg-violet-50 text-violet-600 border-violet-200'
              }`}>
                {t(`${user.role || 'staff'}_role`)}
              </span>
            </div>
            <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2 mb-6">
              <Mail size={14} /> {user.email}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Account Details */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-slate-900">{t('admin_profile_title')}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {infoItems.map((item, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    {item.icon} {item.label}
                  </span>
                  {item.badge || item.status ? (
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                        item.status 
                          ? (user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.value}
                      </span>
                    </div>
                  ) : (
                    <span className="text-base font-semibold text-slate-700">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
