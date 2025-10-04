import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery, useGetCategoriesQuery } from '../store/apis/products';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  // ✅ OPTIMIZED: Make API call with category parameter
  // This will trigger new API call whenever activeCategory changes
  const { data: apiProductsData, isLoading: loadingApiProducts, error: apiProductsError } = useGetProductsQuery({
    page: 1,
    limit: 10,
    category: activeCategory === 'all' ? undefined : activeCategory, // Send category to API
  });

  // API products for listing (already filtered by backend)
  const apiProducts = apiProductsData?.products || [];
  
  // No need for frontend filtering since backend handles it
  const filteredProducts = apiProducts;

  // ✅ OPTIMIZED: Get categories from dedicated endpoint
  const { data: categoriesData } = useGetCategoriesQuery();
  const apiCategories = categoriesData?.categories || [];

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Elegant Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 25% 25%, #ec4899 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 sm:mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Women's Street
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              Discover premium women's fashion accessories, luxury bags, and exquisite jewelry 
              crafted for the modern, sophisticated woman
            </p>
            <div className="flex justify-center space-x-8 text-gray-400">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Premium Bags</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Luxury Jewelry</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Accessories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Our Premium Collection
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Carefully curated selection of luxury women's accessories, designer bags, and exquisite jewelry 
              for the discerning modern woman
            </p>
          </div>

                     {/* Tab Navigation */}
           <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-16 animate-fade-in">
             <button
               onClick={() => setActiveCategory('all')}
               className={`px-4 sm:px-8 py-2 sm:py-4 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-md ${
                 activeCategory === 'all'
                   ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                   : 'bg-white text-gray-700 hover:text-pink-600 border-2 border-gray-200 hover:border-pink-300 hover:shadow-lg'
               }`}
             >
               All Products
             </button>
             {apiCategories.map((category, index) => (
               <button
                 key={category}
                 onClick={() => setActiveCategory(category)}
                 className={`px-4 sm:px-8 py-2 sm:py-4 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-md animate-fade-in ${
                   activeCategory === category
                     ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                     : 'bg-white text-gray-700 hover:text-pink-600 border-2 border-gray-200 hover:border-pink-300 hover:shadow-lg'
                 }`}
                 style={{animationDelay: `${index * 0.1}s`}}
               >
                 {category.charAt(0).toUpperCase() + category.slice(1)}
               </button>
             ))}
           </div>

          {/* Products Grid */}
          {loadingApiProducts ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-pink-500 mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg font-medium">Loading our latest collection...</p>
            </div>
          ) : apiProductsError ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-red-600 mb-2">Unable to Load Products</h3>
              <p className="text-gray-600">Please check back later or contact support</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product._id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-102 animate-fade-in border border-gray-100 hover:border-pink-200 flex flex-col h-full"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="relative">
                    <img
                      src={product.images[0] || ''}
                      alt={product.name}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold shadow-lg">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                          <span className="text-sm sm:text-lg font-bold text-gray-900">
                            PKR {product.price}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-gray-500 line-through">
                              PKR {product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2 sm:mb-3">
                        <span className="capitalize">{product.category}</span>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          {/* Stock Status Badge */}
                          <span className={`px-1 sm:px-2 py-1 rounded-full text-xs font-medium ${
                            product.inStock && product.stockQuantity > 0
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.inStock && product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                      
                      {/* View Details Button */}
                      <Link 
                        to={`/item/${product._id}`}
                        className="w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm bg-gray-900 hover:bg-gray-800 text-white shadow-md text-center block"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                No Products Available
              </h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                {activeCategory === 'all' 
                  ? 'Our collection is being updated. Please check back soon!' 
                  : `No items available in ${activeCategory} category at the moment.`
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why Choose Women's Street
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Experience luxury shopping with our premium services and exceptional quality</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow duration-300">
                <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                Free Delivery
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Complimentary delivery on all orders over PKR 5,000 across Pakistan</p>
            </div>
            
            <div className="text-center group animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow duration-300">
                <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                Quality Guarantee
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">7-day exchange policy with authentic quality assurance on all products</p>
            </div>
            
            <div className="text-center group animate-fade-in" style={{animationDelay: '0.6s'}}>
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-shadow duration-300">
                <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                Customer Support
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Dedicated WhatsApp support team available during business hours</p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home; 