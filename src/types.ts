export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  password?: string;
}

export interface Order {
  id: string;
  trackingCode: string;
  createdAt: string;
  status: 'pending' | 'shipping' | 'success' | 'failed';
  estimatedDelivery: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  codAmount: number;
  shippingFee: number;
  userId: string;
  notes?: string;
}
