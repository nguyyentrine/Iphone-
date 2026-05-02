import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Truck, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-600/5 blur-[120px] -ml-48 -mt-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] -mr-48 -mb-48" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="max-w-md w-full bg-white rounded-[48px] shadow-vip p-10 sm:p-14 relative z-10 border border-white"
      >
        <div className="text-center mb-12">
          <motion.div 
            whileHover={{ rotate: -10, scale: 1.1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-emerald-500 to-teal-700 rounded-[28px] text-white mb-8 shadow-2xl shadow-emerald-100"
          >
            <Plus size={38} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight uppercase">BẮT ĐẦU NGAY</h1>
          <p className="text-slate-400 mt-4 font-medium leading-relaxed uppercase tracking-tighter text-xs">Tham gia hệ thống vận tải VIP & quản lý doanh số của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Họ và tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-5 rounded-[24px] bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
              placeholder="VD: Lò Văn Thương"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Địa chỉ Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-5 rounded-[24px] bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mật khẩu truy cập</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-5 rounded-[24px] bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
              placeholder="••••••••"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-display font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 mt-4 leading-none"
          >
            Đăng ký tài khoản
          </motion.button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Đã là thành viên?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline ml-1">
              Đăng nhập VIP
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
