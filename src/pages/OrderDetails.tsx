import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { 
  ArrowLeft, Copy, Barcode, Truck, Clock, CheckCircle2, 
  Hourglass, Camera, ChevronDown, MessageSquare, AlertCircle, MapPin 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../types';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrder, updateOrder } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const data = getOrder(id);
      if (data) setOrder(data);
    }
  }, [id, getOrder]);

  if (!order) return <div className="p-8 text-center bg-slate-50 min-h-screen">Không tìm thấy đơn hàng</div>;

  const handleStatusChange = (status: Order['status']) => {
    if (id) {
      updateOrder(id, { status });
      setOrder(prev => prev ? { ...prev, status } : null);
      setIsStatusModalOpen(false);
    }
  };

  const statusConfig = {
    pending: { label: 'Chờ lấy hàng', color: 'bg-gray-500', icon: <Hourglass size={18} /> },
    shipping: { label: 'Đang giao hàng', color: 'bg-blue-500', icon: <Truck size={18} /> },
    success: { label: 'Giao thành công', color: 'bg-green-500', icon: <CheckCircle2 size={18} /> },
    failed: { label: 'Giao thất bại', color: 'bg-red-500', icon: <AlertCircle size={18} /> },
  };

  const currentStatus = statusConfig[order.status];

  const renderTimeline = () => {
    const steps = ['Tạo đơn', 'Lấy hàng', 'Vận chuyển', 'Giao hàng'];
    const getStepStatus = (idx: number) => {
      if (order.status === 'success') return 'completed';
      if (order.status === 'failed') {
        if (idx < 3) return 'completed';
        return 'failed';
      }
      if (order.status === 'shipping') {
        if (idx < 3) return 'completed';
        return 'active';
      }
      if (order.status === 'pending') {
        if (idx < 1) return 'completed';
        if (idx === 1) return 'active';
        return 'upcoming';
      }
      return 'upcoming';
    };

    return (
      <div className="flex justify-between relative mt-6 mb-8 px-2">
        <div className="absolute top-4 left-4 right-4 h-1 bg-gray-100 rounded-full z-0">
          <div 
            className="bg-green-500 h-full rounded-full transition-all duration-700" 
            style={{ 
              width: order.status === 'success' ? '100%' : 
                     order.status === 'shipping' ? '66%' : 
                     order.status === 'pending' ? '33%' : '33%' 
            }}
          />
        </div>
        {steps.map((step, idx) => {
          const s = getStepStatus(idx);
          return (
            <div key={idx} className="flex flex-col items-center gap-2 relative z-10 w-16">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[3px] border-white shadow-md transition-all duration-300 ${
                s === 'completed' ? 'bg-green-500 text-white scale-110' : 
                s === 'failed' ? 'bg-red-500 text-white' :
                s === 'active' ? 'bg-blue-500 text-white ring-2 ring-blue-100' :
                'bg-gray-100 text-gray-300'
              }`}>
                {s === 'completed' ? <CheckCircle2 size={14} /> : 
                 s === 'failed' ? <AlertCircle size={14} /> :
                 s === 'active' ? <Clock size={14} /> : 
                 <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tighter ${
                s === 'completed' ? 'text-green-600' : 
                s === 'failed' ? 'text-red-600' :
                s === 'active' ? 'text-blue-600' : 
                'text-gray-400'
              }`}>{step}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-0 sm:py-12">
      <div className="max-w-[440px] w-full bg-white sm:rounded-[56px] shadow-vip relative overflow-hidden flex flex-col border border-white">
        {/* Header VIP */}
        <div className="px-8 pt-10 pb-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-30">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)} 
            className="w-12 h-12 bg-slate-100/50 text-slate-900 rounded-2xl flex items-center justify-center transition-all"
          >
            <ArrowLeft size={22} />
          </motion.button>
          <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">Chi tiết vận đơn</h2>
          <div className="flex gap-2">
            <button className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
              <Copy size={18} />
            </button>
            <button className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
              <Barcode size={18} />
            </button>
          </div>
        </div>

        <div className="px-8 pb-32 overflow-y-auto flex-1 space-y-6">
          {/* Tracking Summary VIP */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] -mr-16 -mt-16" />
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-1">Mã vận đơn</p>
                  <p className="text-2xl font-display font-bold text-white tracking-widest">{order.trackingCode}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                   order.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                   order.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                   'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  {currentStatus.label}
                </div>
              </div>

              {renderTimeline()}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Ngày tạo</p>
                  <p className="text-sm font-bold text-white">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Dự kiến giao</p>
                  <p className="text-sm font-bold text-white">{new Date(order.estimatedDelivery).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Row */}
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsStatusModalOpen(true)}
                className="flex-1 bg-white border border-slate-200 p-5 rounded-[28px] flex items-center justify-between hover:bg-slate-50 transition-all font-bold text-slate-900 group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${currentStatus.color}`} />
                  <span className="group-hover:text-blue-600 transition-colors uppercase tracking-tight text-sm">Cập nhật hành trình</span>
                </div>
                <ChevronDown size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
              </button>
              <button className="w-[68px] h-[68px] bg-blue-600 text-white rounded-[28px] flex items-center justify-center shadow-lg shadow-blue-200">
                <MessageSquare size={24} />
              </button>
          </div>

          {/* Delivery Process Card VIP */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[40px] p-6 shadow-sm border border-slate-100 flex gap-6"
          >
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-display font-bold text-slate-900 leading-tight">Minh chứng giao nhận</h3>
                <p className="text-xs text-slate-400 font-medium">Bưu tá: Lò Văn Thương • 0961xxxx</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest">Đã xác minh</div>
                <span className="text-[11px] text-slate-300 font-bold">{new Date().toLocaleTimeString('vi-VN')}</span>
              </div>
            </div>
            <label className="w-32 h-32 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 cursor-pointer overflow-hidden group hover:border-blue-300 transition-all">
              {previewImg ? (
                <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={previewImg} alt="Proof" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera size={28} strokeWidth={1.5} className="mb-2 group-hover:scale-110 transition-transform text-slate-300" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tải ảnh lên</span>
                </>
              )}
              <input type="file" className="hidden" onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPreviewImg(URL.createObjectURL(e.target.files[0]));
                }
              }} />
            </label>
          </motion.div>

          {/* Address Info Cards */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 relative group">
              <div className="absolute top-6 right-6 w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <MapPin size={16} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                 <h3 className="font-display font-bold text-slate-400 text-xs uppercase tracking-widest">Phát đi từ</h3>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-lg mb-1">{order.senderName}</p>
                <div className="flex items-start gap-2">
                   <p className="text-sm text-slate-500 font-medium leading-relaxed">{order.senderAddress}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 relative group">
              <div className="absolute top-6 right-6 w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <MapPin size={16} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                 <h3 className="font-display font-bold text-slate-400 text-xs uppercase tracking-widest">Giao đến</h3>
              </div>
              <div>
                <p className="font-bold text-slate-900 text-lg mb-1">{order.receiverName}</p>
                <div className="flex items-start gap-2">
                   <p className="text-sm text-slate-500 font-medium leading-relaxed">{order.receiverAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Card VIP */}
          <div className="bg-slate-50 rounded-[40px] p-8 space-y-6">
            <h3 className="font-display font-bold text-slate-900 text-lg tracking-tight">Thanh toán & Thu hộ</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Tiền thu hộ (COD)</span>
                <span className="font-bold text-slate-900 text-base">{order.codAmount.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Phí vận chuyển VIP</span>
                <span className="font-bold text-slate-900 text-base">{order.shippingFee.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="pt-5 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-900">Thực nhận sau phí</span>
                <span className="text-2xl font-display font-bold text-blue-600">{(order.codAmount - order.shippingFee).toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Actions VIP */}
        <div className="absolute bottom-10 left-8 right-8 flex gap-3 p-2 glass rounded-[32px] shadow-lg">
          <button className="flex-1 py-4 rounded-3xl font-bold text-slate-600 text-xs uppercase tracking-widest hover:bg-white/50 transition-all">Khiếu nại</button>
          <button className="flex-1 py-4 bg-slate-900 text-white rounded-3xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200">Tra hành trình</button>
        </div>

        {/* Status Selection Modal */}
        <AnimatePresence>
          {isStatusModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStatusModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end"
            >
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-white rounded-t-[40px] px-8 pt-10 pb-12 shadow-2xl"
              >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
                <h3 className="text-2xl font-extrabold text-center mb-8">Chọn trạng thái</h3>
                <div className="space-y-3">
                  {(Object.keys(statusConfig) as Array<Order['status']>).map((status) => (
                    <button 
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`w-full p-5 rounded-[28px] flex items-center justify-between transition-all active:scale-[0.97] border-2 ${
                        order.status === status 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                          : 'bg-white text-gray-700 border-gray-100 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                          order.status === status ? 'bg-white/20' : statusConfig[status].color + ' bg-opacity-10 text-' + statusConfig[status].color.split('-')[1] + '-600'
                        }`}>
                          {statusConfig[status].icon}
                        </div>
                        <div className="text-left">
                          <span className="text-base font-black block">{statusConfig[status].label}</span>
                          <span className={`text-[10px] font-medium opacity-70 ${order.status === status ? 'text-white' : 'text-gray-400'}`}>
                            {status === 'pending' ? 'Chờ bưu phẩm được lấy' : 
                             status === 'shipping' ? 'Đang trong quá trình vận chuyển' :
                             status === 'success' ? 'Đã giao đến người nhận' : 'Giao hàng không thành công'}
                          </span>
                        </div>
                      </div>
                      {order.status === status && <CheckCircle2 size={24} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
