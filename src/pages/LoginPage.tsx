import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Truck, Package } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 blur-[120px] -ml-48 -mb-48" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="max-w-md w-full bg-white rounded-[48px] shadow-vip p-10 sm:p-14 relative z-10 border border-white"
      >
        <div className="text-center mb-12">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-700 rounded-[28px] text-white mb-8 shadow-2xl shadow-blue-200"
          >
            <Package size={38} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight uppercase">VẬN ĐƠN VIP</h1>
          <p className="text-slate-400 mt-4 font-medium leading-relaxed uppercase tracking-tighter text-xs">Phần mềm quản lý vận tải chuyên sâu cho cá nhân & doanh nghiệp</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50/50 border border-red-100 text-red-600 px-6 py-4 rounded-[22px] mb-8 text-xs font-black uppercase tracking-widest text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Định danh tài khoản</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-5 rounded-[24px] bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
              placeholder="admin@vandon.vn"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mật khẩu bảo mật</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-5 rounded-[24px] bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-900 placeholder:text-slate-300"
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
            Đăng nhập ngay
          </motion.button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline ml-1">
              Khởi tạo miễn phí
            </Link>
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
          <details className="text-[10px] text-slate-300 cursor-pointer group">
            <summary className="font-black uppercase tracking-[0.2em] group-hover:text-slate-400 transition-colors">Thông tin truy cập dùng thử</summary>
            <div className="mt-4 p-4 bg-slate-50 rounded-[20px] font-bold text-slate-500">
               <p>Email: admin@vandon.vn</p>
               <p className="mt-1">Mật khẩu: admin</p>
            </div>
          </details>
        </div>
      </motion.div>
    </div>
  );
}
