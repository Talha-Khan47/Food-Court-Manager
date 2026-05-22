import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, ChefHat, Clock, Package, MapPin } from 'lucide-react';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId || !user) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrder(data);
      } catch (err) {
        setError('Could not fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Socket.io setup for real-time updates
    const socket = io();
    
    socket.emit('join_order_room', orderId);

    socket.on('order_status_update', (updatedOrder) => {
      setOrder((prevOrder) => ({
        ...prevOrder,
        status: updatedOrder.status,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId, user]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading order...</div>;
  if (error || !order) return <div className="text-center py-20 text-red-500">{error || "No order found."}</div>;

  const statuses = ['Pending', 'Preparing', 'Ready', 'Completed'];
  const currentStatusIndex = statuses.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-primary-600 p-8 text-white text-center relative overflow-hidden">
          <h1 className="text-3xl font-bold mb-2 relative z-10">Track Your Order</h1>
          <p className="text-primary-100 relative z-10">Order ID: #{order._id.substring(0, 8).toUpperCase()}</p>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white opacity-10"></div>
        </div>

        <div className="p-8">
          <div className="relative pt-10 pb-12">
            <div className="absolute left-0 top-1/2 -mt-1 w-full h-2 bg-gray-100 rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 -mt-1 h-2 bg-primary-500 rounded-full transition-all duration-1000 ease-in-out" 
              style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
            ></div>
            
            <div className="relative flex justify-between">
              {statuses.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isActive = index === currentStatusIndex;
                
                return (
                  <div key={status} className="flex flex-col items-center">
                    <motion.div 
                      initial={false}
                      animate={{ 
                        scale: isActive ? 1.2 : 1,
                        backgroundColor: isCompleted ? '#8b5cf6' : '#f3f4f6',
                        color: isCompleted ? '#ffffff' : '#9ca3af',
                      }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 transition-colors duration-500`}
                    >
                      {index === 0 && <Clock className="w-5 h-5" />}
                      {index === 1 && <ChefHat className="w-5 h-5" />}
                      {index === 2 && <Package className="w-5 h-5" />}
                      {index === 3 && <CheckCircle2 className="w-5 h-5" />}
                    </motion.div>
                    <span className={`mt-3 font-medium text-sm ${isActive ? 'text-primary-600 font-bold' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <ul className="divide-y divide-gray-100 mb-6">
              {order.items.map((item, idx) => (
                <li key={idx} className="py-3 flex justify-between">
                  <div>
                    <span className="font-medium text-gray-900">{item.quantity}x</span>{' '}
                    <span className="text-gray-600">{item.menuItem?.name || 'Unknown Item'}</span>
                  </div>
                  <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex justify-between items-center text-lg font-bold text-gray-900 bg-gray-50 p-4 rounded-xl">
              <span>Total Paid ({order.paymentMethod})</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
