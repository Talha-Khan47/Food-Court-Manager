import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, CreditCard, Wallet } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('Card'); // 'Card' or 'Pay at Counter'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = getCartTotal();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cartItems.map(item => ({
          menuItem: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        paymentMethod
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/orders', orderData, config);
      
      clearCart();
      navigate(`/track?orderId=${data._id}`); // Navigate to tracking page
    } catch (err) {
      console.error(err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/menu" className="btn-primary flex items-center gap-2">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Cart</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <li key={item._id} className="p-6 flex py-6 sm:py-8">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                  </div>

                  <div className="ml-6 flex flex-1 flex-col justify-between">
                    <div className="flex justify-between w-full">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                      </div>
                      <p className="text-lg font-medium text-primary-600">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    
                    <div className="flex flex-1 items-end justify-between text-sm mt-4">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors text-gray-600"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-medium text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors text-gray-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item._id)}
                        className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors bg-red-50 px-3 py-2 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes (5%)</span>
                <span>${(total * 0.05).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>${(total * 1.05).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'Card' ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="Card" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-600" />
                  <CreditCard className={`ml-3 w-5 h-5 ${paymentMethod === 'Card' ? 'text-primary-600' : 'text-gray-400'}`} />
                  <span className={`ml-3 font-medium ${paymentMethod === 'Card' ? 'text-primary-900' : 'text-gray-700'}`}>Credit/Debit Card (Dummy)</span>
                </label>
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'Pay at Counter' ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-600' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="Pay at Counter" checked={paymentMethod === 'Pay at Counter'} onChange={() => setPaymentMethod('Pay at Counter')} className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-600" />
                  <Wallet className={`ml-3 w-5 h-5 ${paymentMethod === 'Pay at Counter' ? 'text-primary-600' : 'text-gray-400'}`} />
                  <span className={`ml-3 font-medium ${paymentMethod === 'Pay at Counter' ? 'text-primary-900' : 'text-gray-700'}`}>Pay at Counter</span>
                </label>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-8 w-full btn-primary py-4 text-lg flex justify-center items-center gap-2"
            >
              {loading ? 'Processing...' : (
                <>
                  {user ? 'Checkout' : 'Login to Checkout'} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Mock ShoppingCart icon for empty state
function ShoppingCart({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

export default Cart;
