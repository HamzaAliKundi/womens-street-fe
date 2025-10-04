import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../App';

const ItemCard = ({ item, index }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(item);
  };

  return (
    <div
      className="card overflow-hidden group animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Link to={`/item/${item._id}`} className="block">
        <div className="relative overflow-hidden">
          {/* Main Image */}
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-0"
          />
          {/* Hover Image */}
          <img
            src={item.hoverImage}
            alt={`${item.name} - Hover view`}
            className="absolute inset-0 w-full h-64 object-cover transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
          
          {/* Quick Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="absolute top-4 right-4 bg-primary-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-primary-600"
            title="Add to Cart"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
              {item.category}
            </span>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
              <span className="text-xs text-gray-400 ml-1">({item.reviews})</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
            {item.name}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-600">
              PKR {item.price.toFixed(2)}
            </span>
            <span className={`text-sm px-2 py-1 rounded-full ${
              item.inStock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {item.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ItemCard; 