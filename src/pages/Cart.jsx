import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../App';
import { useRemoveFromCartMutation, useUpdateCartItemMutation, useClearCartMutation } from '../store/apis/cart';

const Cart = () => {
  const { guestId, cart, cartItems, cartTotal, cartCount, cartQuantity, cartLoading } = useContext(CartContext);
  const navigate = useNavigate();

  // Cart mutations
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

  // Track loading states for individual items and specific actions
  const [loadingItems, setLoadingItems] = useState({});
  const [updatingItems, setUpdatingItems] = useState({}); // Format: { productId: 'increment' | 'decrement' | false }

  // Handle remove item
  const handleRemoveItem = async (productId) => {
    if (!guestId) return;
    
    // Set loading for this specific item
    setLoadingItems(prev => ({ ...prev, [productId]: true }));
    
    try {
      await removeFromCart({ guestId, productId }).unwrap();
      console.log('✅ Item removed from cart');
    } catch (error) {
      console.error('❌ Failed to remove item:', error);
    } finally {
      // Remove loading for this item
      setLoadingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Handle update quantity with specific action tracking
  const handleUpdateQuantity = async (productId, newQuantity, action) => {
    if (!guestId || newQuantity < 1) return;
    
    // Set updating for this specific item and action (increment/decrement)
    setUpdatingItems(prev => ({ ...prev, [productId]: action }));
    
    try {
      await updateCartItem({ guestId, productId, quantity: newQuantity }).unwrap();
      console.log('✅ Cart updated');
    } catch (error) {
      console.error('❌ Failed to update cart:', error);
    } finally {
      // Remove updating for this item
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    if (!guestId) return;
    try {
      await clearCart(guestId).unwrap();
      console.log('✅ Cart cleared');
    } catch (error) {
      console.error('❌ Failed to clear cart:', error);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/" className="btn-primary text-lg px-8 py-3">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            You have {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart
            {cartQuantity !== cartCount && (
              <span className="text-xs sm:text-sm text-gray-500 ml-1">
                ({cartQuantity} total quantity)
              </span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Cart Items</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.productId} className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                          {item.name}
                        </h3>
                        {/* Selected Options */}
                        {(item.selectedColor || item.selectedSize || item.selectedMaterial) && (
                          <div className="mt-2 space-y-1">
                            {item.selectedColor && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Color:</span> {item.selectedColor}
                              </p>
                            )}
                            {item.selectedSize && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Size:</span> {item.selectedSize}
                              </p>
                            )}
                            {item.selectedMaterial && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Material:</span> {item.selectedMaterial}
                              </p>
                            )}
                          </div>
                        )}
                        <p className="text-sm sm:text-lg font-bold text-primary-600 mt-2">
                          PKR {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          {/* Decrement Button */}
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1, 'decrement')}
                            disabled={updatingItems[item.productId] === 'decrement'}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50"
                          >
                            {updatingItems[item.productId] === 'decrement' ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            )}
                          </button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          {/* Increment Button */}
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1, 'increment')}
                            disabled={updatingItems[item.productId] === 'increment'}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50"
                          >
                            {updatingItems[item.productId] === 'increment' ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            )}
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          disabled={loadingItems[item.productId]}
                          className="text-red-500 hover:text-red-700 transition-colors duration-300 disabled:opacity-50"
                          title="Remove item"
                        >
                          {loadingItems[item.productId] ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                          ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className="text-red-600 hover:text-red-800 font-medium transition-colors duration-300 disabled:opacity-50"
                >
                  {isClearing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                      Clearing Cart...
                    </div>
                  ) : (
                    'Clear Cart'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">PKR {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">
                    {cartTotal >= 1000 ? 'Free' : 'PKR 150'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">PKR {(cartTotal * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-primary-600">
                      PKR {(cartTotal + (cartTotal >= 1000 ? 0 : 150) + (cartTotal * 0.08)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  navigate('/checkout');
                  window.scrollTo(0, 0);
                }}
                className="w-full btn-primary py-4 text-lg font-semibold"
              >
                Proceed to Checkout
              </button>

              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 