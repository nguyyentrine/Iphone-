import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { 
  LogOut, Package, Plus, Search, Settings, 
  X, Truck, CheckCircle2, AlertCircle, Clock, Filter,
  ChevronDown, User as UserIcon, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../types';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { orders, addOrder, updateOrder } = useOrders();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    codAmount: '',
    status: 'pending' as Order['status']
  });
  const [historyFilters, setHistoryFilters] = useState({
    year: 'all',
    status: 'all',
    date: ''
  });
  const [refreshKey, setRefreshKey] = useState(0);

  // History Filter and Generation Logic
  const filteredHistory = React.useMemo(() => {
    const maleFirst = ['Nguyễn','Trần','Lê','Phạm','Hoàng','Vũ','Đặng','Bùi','Phan','Đỗ','Hồ','Ngô','Dương','Lý','Đinh','Lò','Sơn','Thạch','Khâu','Vương'];
    const maleMiddle = ['Văn','Minh','Quốc','Gia','Anh','Đức','Thanh','Công','Hữu','Xuân','Duy','Đình','Trung','Bảo','Khắc','Tiến','Ngọc','Thành','Phúc','Hoài'];
    const maleLast = ['Hùng','Quân','Bảo','Huy','Khôi','Tú','Nam','Long','Tài','Việt','Tùng','Phong','Hiếu','Khang','Sơn','Thắng','Lộc','Vinh','Hải','Phát'];

    const femaleFirst = ['Trương','Lê','Phạm','Nguyễn','Hoàng','Đặng','Võ','Phan','Bùi','Lý','Mai','Đoàn','Dương','Hồ','Ngô','Tạ','Vương','Quách','Hà','Đinh'];
    const femaleMiddle = ['Thị','Ngọc','Thanh','Diễm','Khánh','Thu','Bảo','Mỹ','Hồng','Minh','Lan','Ánh','Quỳnh','Kim','Tú','Trâm','Thảo','Như','Yến','Phương'];
    const femaleLast = ['Lan','Mai','Vy','My','Ánh','Hà','Linh','Ngọc','Hương','Tiên','Trang','Chi','Anh','Dung','Hạnh','Nga','Oanh','Quyên','Thư','Diệp'];

    // Helper to generate unique pool
    const generateShuffledNames = (isMale: boolean, count: number) => {
      const first = isMale ? maleFirst : femaleFirst;
      const middle = isMale ? maleMiddle : femaleMiddle;
      const last = isMale ? maleLast : femaleLast;
      const pool: string[] = [];
      for (let f of first) {
        for (let m of middle) {
          for (let l of last) {
            pool.push(`${f} ${m} ${l}`);
            if (pool.length > count * 2) break;
          }
          if (pool.length > count * 2) break;
        }
        if (pool.length > count * 2) break;
      }
      return pool.sort(() => Math.random() - 0.5);
    };

    const statuses = ['Giao thành công', 'Boom hàng', 'Chờ xử lý'];
    const statusGroups = {
      'Giao thành công': { label: 'Đơn đã giao', color: 'text-green-600 bg-green-50', dot: 'bg-green-500' },
      'Boom hàng': { label: 'Đơn đã boom', color: 'text-red-600 bg-red-50', dot: 'bg-red-500' },
      'Chờ xử lý': { label: 'Đơn chờ xử lý', color: 'text-amber-600 bg-amber-50', dot: 'bg-amber-500' }
    };

    const isSpecificDate = /^\d{2}\/\d{2}\/\d{4}$/.test(historyFilters.date);
    const count = 300;
    const data = [];

    if (isSpecificDate) {
      const yearStr = historyFilters.date.split('/')[2];
      const year = parseInt(yearStr);
      if (year > 2027 || year < 2024) return [];
    }

    const startTime = new Date(2024, 0, 1).getTime();
    const endTime = new Date(2027, 11, 31).getTime();

    const maleNames = generateShuffledNames(true, count);
    const femaleNames = generateShuffledNames(false, count);
    let mIdx = 0;
    let fIdx = 0;

    for (let i = 0; i < count; i++) {
      const isMale = Math.random() > 0.5;
      const fullName = isMale ? maleNames[mIdx++] : femaleNames[fIdx++];
      
      let dateStr = historyFilters.date;
      let yearVal = historyFilters.year;

      if (!isSpecificDate) {
        const randomTime = startTime + Math.random() * (endTime - startTime);
        const d = new Date(randomTime);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const y = String(d.getFullYear());
        dateStr = `${day}/${month}/${y}`;
        yearVal = y;
      } else {
        yearVal = historyFilters.date.split('/')[2];
      }

      const prefixes = ['03', '05', '07', '08', '09'];
      const phone = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${Math.floor(1000 + Math.random() * 9000)}xxxx`;
      const status = historyFilters.status !== 'all' ? historyFilters.status : statuses[Math.floor(Math.random() * statuses.length)];

      data.push({
        id: `${i}-${refreshKey}`,
        name: fullName,
        phone,
        code: `#${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        date: dateStr,
        fullDate: `${dateStr} ${String(8 + Math.floor(Math.random() * 10)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        status,
        info: statusGroups[status as keyof typeof statusGroups],
        isMale,
        year: yearVal
      });
    }

    return data.filter(item => {
      const matchesYear = historyFilters.year === 'all' || item.year === historyFilters.year;
      const matchesStatus = historyFilters.status === 'all' || item.status === historyFilters.status;
      return matchesYear && matchesStatus;
    });
  }, [historyFilters, refreshKey]);



  const filteredOrders = orders.filter(o => 
    o.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.receiverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addOrder({
      trackingCode: `#${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      createdAt: new Date().toISOString(),
      status: newOrder.status,
      estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      senderName: user.name,
      senderPhone: '0901234567',
      senderAddress: 'Địa chỉ người gửi mặc định',
      receiverName: newOrder.receiverName,
      receiverPhone: newOrder.receiverPhone,
      receiverAddress: newOrder.receiverAddress,
      codAmount: parseInt(newOrder.codAmount) || 0,
      shippingFee: 30000,
      userId: user.id
    });

    setIsCreateModalOpen(false);
    setNewOrder({ receiverName: '', receiverPhone: '', receiverAddress: '', codAmount: '', status: 'pending' });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col font-sans">
      {/* Header */}
      <header className="glass sticky top-0 z-30 px-6 py-5 flex items-center justify-between shadow-glass">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200"
          >
            <Package size={26} strokeWidth={2.5} />
          </motion.div>
          <div>
            <h1 className="font-display font-bold text-slate-900 leading-none text-xl tracking-tight">VẬN ĐƠN VIP</h1>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mt-1">Premium Logistics</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-2xl transition-all flex items-center gap-2 group"
            >
              <Settings size={22} className="group-hover:rotate-90 transition-transform duration-500" />
            </Link>
          )}
          <div className="h-8 w-[1px] bg-slate-200 mx-1" />
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Thoát</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-5 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900">Chào buổi sáng, {user?.name.split(' ').pop()}!</h2>
            <p className="text-slate-500 font-medium mt-1">Hôm nay có {orders.length} vận đơn cần theo dõi.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100/50 px-4 py-2 rounded-full w-fit">
            <Clock size={12} />
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}
          </div>
        </motion.div>

        {/* History Card - VIP Style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => {
            setRefreshKey(prev => prev + 1);
            setIsHistoryModalOpen(true);
          }}
          className="relative overflow-hidden bg-slate-900 p-8 rounded-[32px] shadow-2xl hover:shadow-blue-900/20 group cursor-pointer transition-all active:scale-[0.99]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Dữ liệu thời gian thực</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">Tra cứu lịch sử vận đơn</h2>
              <p className="text-slate-400 text-sm font-medium">Truy cập kho dữ liệu vận tải 2024-2027 với hơn 5,000+ hồ sơ.</p>
            </div>
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-12 h-12 rounded-2xl border-4 border-slate-900 bg-slate-800 flex items-center justify-center">
                  <Filter size={20} className="text-slate-500" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-2xl border-4 border-slate-900 bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                +99
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Tổng đơn hàng', value: orders.length, color: 'text-blue-600 bg-blue-50 border-blue-100', icon: <Package size={18} /> },
            { label: 'Đang vận chuyển', value: orders.filter(o => o.status === 'shipping').length, color: 'text-amber-600 bg-amber-50 border-amber-100', icon: <Truck size={18} /> },
            { label: 'Giao thành công', value: orders.filter(o => o.status === 'success').length, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: <CheckCircle2 size={18} /> },
            { label: 'Giao thất bại', value: orders.filter(o => o.status === 'failed').length, color: 'text-red-600 bg-red-50 border-red-100', icon: <AlertCircle size={18} /> },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className={`p-6 rounded-[32px] border flex flex-col gap-4 shadow-sm transition-all hover:scale-105 hover:shadow-md ${stat.color} bg-white border-white`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${stat.color} bg-opacity-20`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.15em] opacity-60 mb-1">{stat.label}</p>
                <p className="text-3xl font-display font-bold leading-none">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search & Action VIP */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tra soát mã vận đơn, tên khách..."
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-[28px] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm font-medium"
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-slate-900 text-white px-8 py-5 rounded-[28px] font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            <Plus size={22} className="text-blue-400" />
            <span className="tracking-tight">Tạo vận đơn mới</span>
          </motion.button>
        </div>

        {/* Orders List VIP */}
        <div className="space-y-6 pb-20">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-display font-bold text-slate-900 text-xl tracking-tight">Theo dõi hành trình</h2>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{filteredOrders.length} Đơn hàng</span>
            </div>
          </div>
          
          <AnimatePresence mode="popLayout">
            {filteredOrders.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-20 text-center"
              >
                <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <Package size={48} strokeWidth={1} />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-2">Chưa tìm thấy dữ liệu</h3>
                <p className="text-slate-400 font-medium">Vui lòng kiểm tra lại mã vận đơn hoặc bộ lọc tra cứu.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => navigate(`/order/${order.id}`)}
                    className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-500/30 hover:shadow-vip cursor-pointer transition-all group relative z-10"
                  >
                    <div className="absolute top-0 left-0 w-1 h-1/2 group-hover:h-full bg-transparent group-hover:bg-blue-500 transition-all duration-300 rounded-l-[32px] pointer-events-none" />
                    <div className="flex items-center gap-5">
                      <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center shrink-0 transition-all group-hover:scale-110 shadow-lg ${
                        order.status === 'shipping' ? 'bg-linear-to-br from-blue-50 to-blue-100/50 text-blue-600' :
                        order.status === 'success' ? 'bg-linear-to-br from-emerald-50 to-emerald-100/50 text-emerald-600' :
                        order.status === 'failed' ? 'bg-linear-to-br from-red-50 to-red-100/50 text-red-600' :
                        'bg-slate-50 text-slate-400'
                      }`}>
                        {order.status === 'success' ? <CheckCircle2 size={30} /> : <Truck size={30} />}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors uppercase tracking-tight">{order.trackingCode}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs font-bold text-slate-900 uppercase tracking-tighter">
                            {order.receiverName}
                          </p>
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          <p className="text-[11px] font-medium text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-3">
                      <p className="font-display font-bold text-slate-900 leading-none text-xl">
                        {order.codAmount.toLocaleString('vi-VN')}đ
                      </p>
                      <div className="relative" onClick={e => e.stopPropagation()}>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === order.id ? null : order.id);
                          }}
                          className={`text-[10px] uppercase font-black px-4 py-1.5 rounded-full transition-all flex items-center gap-2 ring-1 ring-inset shadow-sm relative z-20 ${
                            order.status === 'shipping' ? 'bg-blue-50 text-blue-600 ring-blue-100' :
                            order.status === 'success' ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' :
                            order.status === 'failed' ? 'bg-red-50 text-red-600 ring-red-100' :
                            'bg-slate-50 text-slate-400 ring-slate-100'
                          }`}
                        >
                          {order.status === 'shipping' ? 'Đang giao' :
                           order.status === 'success' ? 'Thành công' : 
                           order.status === 'failed' ? 'Thất bại' : 'Chờ xử lý'}
                          <ChevronDown size={10} strokeWidth={4} className={`transition-transform duration-300 ${activeMenuId === order.id ? 'rotate-180' : ''}`} />
                        </motion.button>

                        {/* Mini Status Menu VIP */}
                        <AnimatePresence>
                          {activeMenuId === order.id && (
                            <>
                              {/* Invisible backdrop to capture clicks - using a large absolute div to handle closures more reliably within the layout context */}
                              <div 
                                className="fixed inset-0 z-40 bg-transparent" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                }} 
                              />
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                className="absolute right-0 top-full mt-2 bg-white border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] rounded-[24px] p-2 z-50 w-52 overflow-hidden"
                                onClick={e => e.stopPropagation()}
                              >
                                {[
                                  { id: 'pending', label: 'Chờ xử lý hệ thống', color: 'text-slate-500 bg-slate-50', icon: <Clock size={14} /> },
                                  { id: 'shipping', label: 'Bắt đầu giao hàng', color: 'text-blue-600 bg-blue-50', icon: <Truck size={14} /> },
                                  { id: 'success', label: 'Giao thành công', color: 'text-emerald-600 bg-emerald-50', icon: <CheckCircle2 size={14} /> },
                                  { id: 'failed', label: 'Giao thất bại', color: 'text-red-600 bg-red-50', icon: <AlertCircle size={14} /> },
                                ].map(st => (
                                  <button
                                    key={st.id}
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      updateOrder(order.id, { status: st.id as Order['status'] });
                                      setActiveMenuId(null);
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-tight mb-1 last:mb-0 transition-all flex items-center justify-between group/item ${st.color} ${order.status === st.id ? 'ring-2 ring-inset ring-current/20' : 'opacity-70 hover:opacity-100 hover:translate-x-1'}`}
                                  >
                                    <div className="flex items-center gap-3">
                                      {st.icon}
                                      {st.label}
                                    </div>
                                    {order.status === st.id && <CheckCircle2 size={12} className="shrink-0" />}
                                  </button>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
        </div>
      </main>

      {/* Create Order Modal VIP */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
            onClick={() => setIsCreateModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-[#FDFDFE] w-full max-w-xl rounded-[48px] overflow-hidden shadow-vip relative border border-white"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] -mr-24 -mt-24" />
              
              <div className="p-10 pb-6 flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Ký gửi vận đơn</h3>
                  <p className="text-sm text-slate-400 font-medium mt-1 uppercase tracking-widest bg-slate-100 w-fit px-3 py-0.5 rounded-full font-black">Shipment Terminal</p>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)} 
                  className="w-12 h-12 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full flex items-center justify-center transition-all active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="p-10 pt-4 space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Danh tính người nhận</label>
                    <div className="relative">
                      <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        required
                        type="text" 
                        value={newOrder.receiverName}
                        onChange={e => setNewOrder({...newOrder, receiverName: e.target.value})}
                        className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900 placeholder:text-slate-200"
                        placeholder="VD: Lò Văn Thương"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Liên hệ di động</label>
                    <input 
                      required
                      type="tel" 
                      value={newOrder.receiverPhone}
                      onChange={e => setNewOrder({...newOrder, receiverPhone: e.target.value})}
                      className="w-full px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900 placeholder:text-slate-200"
                      placeholder="0332xxxxxx"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Địa chỉ phát đơn</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required
                      type="text" 
                      value={newOrder.receiverAddress}
                      onChange={e => setNewOrder({...newOrder, receiverAddress: e.target.value})}
                      className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900 placeholder:text-slate-200"
                      placeholder="Quảng Yên, Quảng Ninh"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Giá trị COD (VNĐ)</label>
                    <div className="relative">
                      <input 
                        required
                        type="number" 
                        value={newOrder.codAmount}
                        onChange={e => setNewOrder({...newOrder, codAmount: Number(e.target.value)})}
                        className="w-full px-6 py-5 bg-blue-50 border border-blue-100 rounded-[24px] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-display font-bold text-xl text-blue-600 placeholder:text-blue-200"
                        placeholder="450000"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-blue-300 uppercase tracking-widest text-[11px]">VND</span>
                    </div>
                  </div>
                   <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Kênh vận hành</label>
                    <select 
                      value={newOrder.status}
                      onChange={e => setNewOrder({...newOrder, status: e.target.value as Order['status']})}
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                    >
                      <option value="pending">Chờ xử lý hệ thống</option>
                      <option value="shipping">Bắt đầu giao hàng</option>
                      <option value="success">Giao thành công</option>
                      <option value="failed">Giao thất bại</option>
                    </select>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-slate-900 text-white py-6 rounded-[28px] font-display font-bold text-xl shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-3 mt-4"
                >
                  <Package size={24} className="text-blue-400" />
                  Xác nhận khởi tạo đơn
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal - VIP Style */}
      <AnimatePresence>
        {isHistoryModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-end justify-center sm:items-center sm:p-4"
            onClick={() => setIsHistoryModalOpen(false)}
          >
            <motion.div 
              initial={{ y: "100%", scale: 1 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: "100%", scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#FDFDFE] w-full max-w-2xl sm:rounded-[48px] rounded-t-[48px] max-h-[92vh] overflow-hidden flex flex-col shadow-vip border border-white"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-8 pt-10 pb-6 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Cửa sổ tra soát</h3>
                  <p className="text-sm text-slate-400 font-medium">Lọc dữ liệu vận chuyển đa tầng 2024-2027</p>
                </div>
                <button 
                  onClick={() => setIsHistoryModalOpen(false)} 
                  className="w-12 h-12 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full flex items-center justify-center transition-all active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Advanced Filters VIP */}
              <div className="px-8 pb-8 space-y-4 shrink-0">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <select 
                      value={historyFilters.year}
                      onChange={(e) => setHistoryFilters({...historyFilters, year: e.target.value})}
                      className="w-full appearance-none pl-5 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-[22px] outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm text-slate-900 transition-all"
                    >
                      <option value="all">Tất cả các năm (2024-2027)</option>
                      <option value="2024">Kỳ vận chuyển 2024</option>
                      <option value="2025">Kỳ vận chuyển 2025</option>
                      <option value="2026">Kỳ vận chuyển 2026</option>
                      <option value="2027">Kỳ vận chuyển 2027</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Filter size={14} />
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    <select 
                      value={historyFilters.status}
                      onChange={(e) => setHistoryFilters({...historyFilters, status: e.target.value})}
                      className="w-full appearance-none pl-5 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-[22px] outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm text-slate-900 transition-all"
                    >
                      <option value="all">Mọi trạng thái đơn hàng</option>
                      <option value="Giao thành công">Đơn đã hoàn tất (Thành công)</option>
                      <option value="Boom hàng">Đơn bị hoàn (Boom hàng)</option>
                      <option value="Chờ xử lý">Đơn đang kiểm soát (Chờ xử lý)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Filter size={14} />
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500">
                    <Search size={18} strokeWidth={3} />
                  </div>
                  <input 
                    type="text"
                    value={historyFilters.date}
                    onChange={(e) => {
                      setHistoryFilters({...historyFilters, date: e.target.value});
                      setRefreshKey(prev => prev + 1);
                    }}
                    placeholder="Lọc theo ngày cụ thể (VD: 02/05/2026)"
                    className="w-full pl-14 pr-6 py-5 bg-blue-50/30 border border-blue-100 rounded-[24px] outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-blue-900 placeholder:text-blue-300 transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-white rounded-full border border-blue-100 shadow-sm text-[9px] font-black text-blue-600 uppercase tracking-widest">
                    Hot Search
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto px-8 pb-10 space-y-4 flex-1 bg-white">
                {filteredHistory.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {filteredHistory.slice(0, 500).map((item, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.01 }}
                        key={item.id} 
                        className="p-5 border border-slate-50 rounded-[28px] overflow-hidden flex items-center justify-between hover:bg-slate-50/80 transition-all group hover:border-slate-200"
                      >
                        <div className="flex items-center gap-5">
                          <div className="relative shrink-0">
                            <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-3 ${
                              item.isMale 
                                ? 'bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-blue-400/20' 
                                : 'bg-linear-to-br from-pink-500 via-rose-500 to-rose-700 shadow-pink-400/20'
                            }`}>
                              <span className="text-white text-xl font-black tracking-tighter drop-shadow-sm">{item.isMale ? '♂' : '♀'}</span>
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-[3px] border-white flex items-center justify-center shadow-lg ${
                              item.isMale ? 'bg-blue-500' : 'bg-pink-500'
                            }`}>
                              <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-75" />
                              <div className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,1)]" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-display font-bold text-slate-900">{item.name}</h4>
                              <span className="text-xs font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded-full">{item.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 capitalize">
                              <span className="font-bold text-slate-500 tracking-tighter">{item.code}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full px-0" />
                              <span>{item.fullDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-right">
                          <span className={`text-[9px] font-black uppercase tracking-[0.1em] px-3 py-1.5 rounded-full ${item.info.color}`}>
                            {item.info.label}
                          </span>
                          <div className="w-8 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              className={`h-full ${item.info.dot}`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Search size={32} className="text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold max-w-xs">Không tìm thấy vận đơn nào khớp với tham số tra cứu của bạn.</p>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between shrink-0 px-10">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Total Records: {filteredHistory.length}</p>
                <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">System Cloud Sync</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
