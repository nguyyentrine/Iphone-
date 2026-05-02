import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '../types';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrder: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_KEY = 'vandon_orders';

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem(ORDERS_KEY);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        // Generate a good amount of mock data
        const mockOrders: Order[] = [];
        const statuses: Order['status'][] = ['pending', 'shipping', 'success', 'failed'];
        const maleLastNames = ['Nguyễn Văn Hùng', 'Trần Minh Quân', 'Lê Quốc Bảo', 'Phạm Anh Huy', 'Hoàng Gia Khôi'];
        const femaleLastNames = ['Trương Thị Lan', 'Nguyễn Ngọc Vy', 'Trần Thanh My', 'Lê Diễm Vy', 'Phạm Khánh Vy'];
        
        for (let i = 0; i < 20; i++) {
          const isMale = i % 2 === 0;
          const namePool = isMale ? maleLastNames : femaleLastNames;
          mockOrders.push({
            id: `mock_${i}`,
            trackingCode: `#${137789556180 + i}`,
            createdAt: new Date(Date.now() - i * 86400000).toISOString(),
            status: statuses[i % 4],
            estimatedDelivery: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
            senderName: i % 2 === 0 ? 'Trương Thị Trinh' : 'Ngân Kim',
            senderPhone: '034679xxxx',
            senderAddress: '16 Hùng Vương, Huế',
            receiverName: namePool[i % namePool.length],
            receiverPhone: '033272xxxx',
            receiverAddress: 'Quảng Ninh',
            codAmount: 450000 + i * 10000,
            shippingFee: 30000,
            userId: 'admin_id'
          });
        }
        setOrders(mockOrders);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(mockOrders));
      }
    } catch (e) {
      console.error("Failed to parse orders", e);
      localStorage.removeItem(ORDERS_KEY);
    }
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  }, [orders]);

  const addOrder = (order: Omit<Order, 'id'>) => {
    const newOrder = {
      ...order,
      id: Math.random().toString(36).substring(2, 9)
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const getOrder = (id: string) => {
    return orders.find(o => o.id === id);
  };

  // Filter orders based on user role
  const visibleOrders = user?.role === 'admin' 
    ? orders 
    : orders.filter(o => o.userId === user?.id);

  return (
    <OrderContext.Provider value={{ orders: visibleOrders, addOrder, updateOrder, deleteOrder, getOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
