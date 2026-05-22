import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, CalendarCheck, UtensilsCrossed, CheckCircle2, ChefHat, Package, Clock, LogOut } from 'lucide-react';
import { io } from 'socket.io-client';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'bookings', 'menu'
  
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [ordersRes, bookingsRes] = await Promise.all([
          axios.get('/api/orders', config),
          axios.get('/api/bookings', config)
        ]);
        setOrders(ordersRes.data);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error('Error fetching admin data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Socket.io for real-time admin updates
    const socket = io();
    
    socket.on('new_order', (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
    });

    socket.on('admin_order_update', (updatedOrder) => {
      setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
    });

    socket.on('new_booking', (newBooking) => {
      setBookings(prev => [newBooking, ...prev]);
    });

    return () => socket.disconnect();
  }, [user, navigate]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus }, config);
      // Local state is updated via socket event 'admin_order_update'
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Preparing': return 'bg-orange-100 text-orange-800';
      case 'Ready': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center py-20">Loading Admin Dashboard...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">Dashboard</h2>
        <nav className="space-y-1">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${activeTab === 'orders' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ClipboardList className="w-5 h-5" /> Orders
            {orders.filter(o => o.status === 'Pending').length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs py-0.5 px-2 rounded-full">
                {orders.filter(o => o.status === 'Pending').length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${activeTab === 'bookings' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <CalendarCheck className="w-5 h-5" /> Bookings
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${activeTab === 'menu' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <UtensilsCrossed className="w-5 h-5" /> Menu Management
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'orders' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Live Orders</h1>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {orders.map(order => (
                <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Order #{order._id.substring(0, 6)}</h3>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex-grow mb-4">
                    <ul className="text-sm text-gray-700 space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          <span className="font-semibold">{item.quantity}x</span> {item.menuItem?.name || 'Unknown'}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="font-bold text-gray-900">${order.totalAmount.toFixed(2)}</span>
                    <div className="flex gap-2">
                      {order.status === 'Pending' && (
                        <button onClick={() => updateOrderStatus(order._id, 'Preparing')} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
                          <ChefHat className="w-4 h-4" /> Start Prep
                        </button>
                      )}
                      {order.status === 'Preparing' && (
                        <button onClick={() => updateOrderStatus(order._id, 'Ready')} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
                          <Package className="w-4 h-4" /> Mark Ready
                        </button>
                      )}
                      {order.status === 'Ready' && (
                        <button onClick={() => updateOrderStatus(order._id, 'Completed')} className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Table Bookings</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table/Guests</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{new Date(booking.date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">{booking.timeSlot}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.user?.name}</div>
                        <div className="text-sm text-gray-500">{booking.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Table {booking.table?.tableNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="text-center py-20">
            <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-500">Menu Management</h2>
            <p className="text-gray-400">Editing menu items will be available in the next update.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
