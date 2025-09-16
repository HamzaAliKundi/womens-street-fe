import React, { useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '../store/apis/products';
import { useAddToCartMutation, useRemoveFromCartMutation } from '../store/apis/cart';
import { CartContext } from '../App';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { guestId, cartItems } = useContext(CartContext);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef(null);

  // Get product from API
  const { data: productData, isLoading: loadingProduct, error } = useGetProductByIdQuery(id);
  const item = productData?.product;

  // Cart mutations
  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  // Check if product is in cart
  const isProductInCart = (productId) => {
    return cartItems.some(item => item.productId === productId);
  };

  // Loading state
  if (loadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error or item not found
  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? 'Error loading product' : 'Item Not Found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!guestId) {
      console.error('Guest ID not available');
      return;
    }

    setIsLoading(true);
    try {
      await addToCart({ 
        guestId, 
        productId: item._id, 
        quantity: quantity 
      }).unwrap();
      console.log('✅ Added to cart:', item.name);
    } catch (error) {
      console.error('❌ Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle remove from cart
  const handleRemoveFromCart = async () => {
    if (!guestId) return;
    
    setIsLoading(true);
    try {
      await removeFromCart({ guestId, productId: item._id }).unwrap();
      console.log('✅ Removed from cart:', item.name);
    } catch (error) {
      console.error('❌ Failed to remove from cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update magnifier position to follow mouse
    setMagnifierPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const images = item.detailImages || [item.image];

  // Fixed magnifier style calculation with HD image support
  const getMagnifierStyle = () => {
    const zoomFactor = 2; // Reduced zoom to maintain image quality
    const magnifierSize = 150;
    
    if (!imageRef.current) return {};
    
    const rect = imageRef.current.getBoundingClientRect();
    const imageWidth = rect.width;
    const imageHeight = rect.height;
    
    // Get the high-resolution version of the image if available
    const currentImage = images[selectedImageIndex];
    const hdImage = item.hdImages ? item.hdImages[selectedImageIndex] : currentImage;
    
    // Calculate the background position
    const backgroundX = -(magnifierPosition.x * zoomFactor - magnifierSize / 2);
    const backgroundY = -(magnifierPosition.y * zoomFactor - magnifierSize / 2);
    
    return {
      width: `${magnifierSize}px`,
      height: `${magnifierSize}px`,
      backgroundImage: `url(${hdImage})`,
      backgroundSize: `${imageWidth * zoomFactor}px ${imageHeight * zoomFactor}px`,
      backgroundPosition: `${backgroundX}px ${backgroundY}px`,
      backgroundRepeat: 'no-repeat',
      borderRadius: '50%',
      border: '3px solid white',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      // Add these properties for better image quality
      imageRendering: 'high-quality',
      imageRendering: '-webkit-optimize-contrast',
      imageRendering: 'crisp-edges',
      imageRendering: 'pixelated'
    };
  };

  // Calculate magnifier position to keep it within viewport
  const getMagnifierPosition = () => {
    const magnifierSize = 150;
    const offset = 20; // Offset from cursor
    
    if (!imageRef.current) return { left: 0, top: 0 };
    
    const rect = imageRef.current.getBoundingClientRect();
    let left = magnifierPosition.x - magnifierSize / 2;
    let top = magnifierPosition.y - magnifierSize / 2 - offset;
    
    // Keep magnifier within image bounds
    left = Math.max(0, Math.min(left, rect.width - magnifierSize));
    top = Math.max(0, Math.min(top, rect.height - magnifierSize));
    
    // If magnifier would go above the image, place it below the cursor
    if (magnifierPosition.y - magnifierSize / 2 - offset < 0) {
      top = magnifierPosition.y + offset;
    }
    
    return { left, top };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 animate-slide-in-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-8 transition-colors duration-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Images */}
            <div className="relative">
              <div className="relative overflow-hidden">
                <img
                  ref={imageRef}
                  src={images[selectedImageIndex]}
                  alt={item.name}
                  className="w-full h-96 lg:h-full object-cover cursor-zoom-in"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
                
                {/* Fixed Magnifier */}
                {showMagnifier && (
                  <div
                    className="absolute pointer-events-none z-20"
                    style={{
                      left: getMagnifierPosition().left,
                      top: getMagnifierPosition().top,
                    }}
                  >
                    <div style={getMagnifierStyle()} />
                  </div>
                )}

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {/* Stock Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.inStock && item.stockQuantity > 0
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.inStock && item.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {/* Stock Quantity Badge */}
                  {item.stockQuantity > 0 && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.stockQuantity} Available
                    </span>
                  )}
                </div>
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="flex space-x-3 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          selectedImageIndex === index
                            ? 'border-primary-500 ring-2 ring-primary-200'
                            : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${item.name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-8 lg:p-12">
              <div className="mb-6">
                <span className="text-sm font-medium text-primary-600 uppercase tracking-wide">
                  {item.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                  {item.name}
                </h1>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">{item.rating}</span>
                  <span className="text-gray-400 ml-1">({item.reviews} reviews)</span>
                </div>
                <p className="text-2xl font-bold text-primary-600 mb-6">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Color Selection */}
                {item.colors && item.colors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
                    <div className="flex flex-wrap gap-3">
                      {item.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                            selectedColor === color
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-300 hover:border-primary-300'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Product Specifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Material</h4>
                    <p className="text-gray-600">{item.material}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Dimensions</h4>
                    <p className="text-gray-600">{item.dimensions}</p>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="pt-6">
                  {(() => {
                    const inCart = isProductInCart(item._id);
                    const isOutOfStock = !item.inStock || item.stockQuantity <= 0;
                    
                    return (
                      <button
                        onClick={inCart ? handleRemoveFromCart : handleAddToCart}
                        disabled={isOutOfStock || isLoading}
                        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 ${
                          isOutOfStock
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : inCart
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-primary-500 hover:bg-primary-600 text-white'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {inCart ? 'Removing...' : 'Adding...'}
                          </div>
                        ) : isOutOfStock ? (
                          '🚫 Out of Stock'
                        ) : inCart ? (
                          '❌ Remove from Cart'
                        ) : (
                          '🛒 Add to Cart'
                        )}
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;