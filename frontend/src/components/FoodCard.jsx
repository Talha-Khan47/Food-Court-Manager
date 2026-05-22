import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const FoodCard = ({ item, onAddToCart }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold px-3 py-1 bg-red-500 rounded-full text-sm">Sold Out</span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">{item.name}</h3>
          <span className="font-bold text-primary-600">${item.price.toFixed(2)}</span>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-2">
          {item.description}
        </p>
        
        <button 
          onClick={() => onAddToCart(item)}
          disabled={!item.isAvailable}
          className={`mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-colors ${
            item.isAvailable 
              ? 'bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Plus className="w-4 h-4" /> Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default FoodCard;
