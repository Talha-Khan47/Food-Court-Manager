import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FoodCard from '../components/FoodCard';
import { Loader2, Search } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await axios.get('/api/menu');
        setMenuItems(data);
      } catch (error) {
        console.error('Failed to fetch menu', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Menu</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our wide variety of delicious options, from hearty mains to sweet treats.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No items found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map(item => (
            <FoodCard 
              key={item._id} 
              item={item} 
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
