import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { 
  Users, Package, TrendingUp, Search, Trash2, 
  ShieldCheck, User as UserIcon, ArrowLeft 
} from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';

export default function AdminPanel() {
  const { user } = useAuth();
  const { orders, deleteOrder } = useOrders();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('vandon_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.codAmount, 0);

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col font-sans">
      <header className="glass sticky top-0 z-30 px-8 py-5 flex items-center justify-between shadow-glass">
        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/dashboard')} 
            className="w-12 h-12 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center transition-all"
          >
            <ArrowLeft size={22} />
          </motion.button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-linear-to-br from-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
              <ShieldCheck size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-display font-bold text-slate-900 text-xl tracking-tight uppercase">Admin Console</h1>
              <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em] mt-1">Management Hub</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-2xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">System Online</span>
        </div>
      </header>

      <main className="flex-1 p-8 sm:p-12 max-w-7xl mx-auto w-full space-y-12">
        {/* Dashboard Stats VIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Người dùng', value: users.length, color: 'text-blue-600 bg-blue-50/50', icon: <Users size={28} /> },
            { label: 'Vận đơn hệ thống', value: orders.length, color: 'text-indigo-600 bg-indigo-50/50', icon: <Package size={28} /> },
            { label: 'Dòng tiền dự kiến', value: `${totalRevenue.toLocaleString('vi-VN')}đ`, color: 'text-emerald-600 bg-emerald-50/50', icon: <TrendingUp size={28} /> },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 flex items-center gap-8 group hover:shadow-vip transition-all"
            >
              <div className={`w-20 h-20 ${stat.color} rounded-[28px] flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.15em] mb-2">{stat.label}</p>
                <p className="text-4xl font-display font-bold text-slate-900 leading-none">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* User Management VIP */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Cơ sở người dùng</h2>
              <div className="px-4 py-1.5 bg-slate-100 rounded-full">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{users.length} Thành viên</span>
              </div>
            </div>
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-50 overflow-hidden">
              <div className="divide-y divide-slate-50/50">
                {users.map((u, i) => (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: i * 0.05 }}
                    key={u.id} 
                    className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-100 rounded-[20px] flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                        <UserIcon size={24} />
                      </div>
                      <div>
                        <p className="font-display font-bold text-slate-900 text-lg">{u.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] uppercase font-black px-4 py-2 rounded-full tracking-widest ring-1 ring-inset ${
                      u.role === 'admin' ? 'bg-indigo-50 text-indigo-700 ring-indigo-100' : 'bg-slate-50 text-slate-600 ring-slate-100'
                    }`}>
                      {u.role}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* All Orders VIP */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Toàn bộ vận đơn</h2>
              <div className="px-4 py-1.5 bg-slate-100 rounded-full">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{orders.length} Hồ sơ</span>
              </div>
            </div>
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-50 overflow-hidden">
              <div className="divide-y divide-slate-50/50">
                {orders.map((o, i) => (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: i * 0.05 }}
                    key={o.id} 
                    className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="font-display font-bold text-slate-900 text-lg uppercase tracking-tight">{o.trackingCode}</p>
                        <p className="text-xs text-slate-400 font-medium">{o.senderName} ⮕ {o.receiverName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-display font-bold text-slate-900 text-base">{o.codAmount.toLocaleString('vi-VN')}đ</p>
                        <div className="flex items-center justify-end gap-1.5 mt-1">
                           <div className={`w-1.5 h-1.5 rounded-full ${o.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                           <p className={`text-[10px] font-black uppercase tracking-widest ${o.status === 'success' ? 'text-emerald-600' : 'text-amber-500'}`}>{o.status}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteOrder(o.id)}
                        className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
