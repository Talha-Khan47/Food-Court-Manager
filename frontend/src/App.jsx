import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, ShoppingCart, User, CalendarDays, Utensils, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from './context/AuthContext';
import { CartContext } from './context/CartContext';
import LoginPage from './pages/Login';
import MenuPage from './pages/Menu';
import CartPage from './pages/Cart';
import OrderTrackingPage from './pages/OrderTracking';
import BookTablePage from './pages/BookTable';
import AdminDashboardPage from './pages/AdminDashboard';

// Mock components for routing
const Home = () => (
  <div className="min-h-[80vh] flex items-center justify-center bg-primary-50">
    <div className="text-center animate-fade-in p-8">
      <Utensils className="mx-auto h-16 w-16 text-primary-600 mb-6 animate-bounce" />
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Food Court</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Skip the line. Order your favorite meals, track them in real-time, and reserve your table in advance.
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/menu" className="btn-primary flex items-center gap-2">
          <Menu className="w-5 h-5" /> Browse Menu
        </Link>
        <Link to="/book" className="btn-secondary flex items-center gap-2">
          <CalendarDays className="w-5 h-5" /> Book Table
        </Link>
      </div>
    </div>
  </div>
);

const App = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {/* Navbar */}
        <nav className="bg-white shadow-sm border-b border-primary-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <Utensils className="h-8 w-8 text-primary-600" />
                <span className="font-bold text-xl text-gray-900">FoodCourt</span>
              </Link>
              
              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-8">
                <Link to="/menu" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Menu</Link>
                <Link to="/book" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Book a Table</Link>
                <Link to="/track" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Track Order</Link>
              </div>

              {/* Actions */}
              <div className="hidden md:flex items-center gap-4">
                <Link to="/cart" className="text-gray-500 hover:text-primary-600 relative transition-colors p-2">
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold transform translate-x-1 -translate-y-1">
                      {cartCount}
                    </span>
                  )}
                </Link>
                
                {user ? (
                  <div className="flex items-center gap-3 ml-4 border-l border-gray-200 pl-4">
                    <div className="flex items-center gap-2">
                      <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-primary-200" referrerPolicy="no-referrer" />
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    </div>
                    {user.role === 'Admin' && (
                      <Link to="/admin" className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded">ADMIN</Link>
                    )}
                    <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-colors p-1" title="Logout">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="btn-primary flex items-center gap-2">
                    <User className="w-4 h-4" /> Sign In
                  </Link>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-500 p-2">
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-primary-100 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-4 space-y-2">
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/menu" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50">Menu</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50">Cart</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/book" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50">Book a Table</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/track" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50">Track Order</Link>
                
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 mt-4 border-t border-gray-100 pt-4">
                      <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Sign Out</button>
                  </>
                ) : (
                  <Link onClick={() => setIsMobileMenuOpen(false)} to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 bg-primary-50">Sign In</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/track" element={<OrderTrackingPage />} />
            <Route path="/book" element={<BookTablePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-primary-100 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Food Court Management. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
