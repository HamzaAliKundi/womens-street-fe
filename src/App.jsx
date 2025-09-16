import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from './store/Provider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ItemDetail from './pages/ItemDetail';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { getGuestId } from './utils/guestId';
import { useGetCartQuery } from './store/apis/cart';

export const CartContext = createContext();

// Inner App component that uses Redux hooks
function AppContent() {
  const [guestId, setGuestId] = useState(null);

  // Initialize guest ID when app loads
  useEffect(() => {
    const id = getGuestId();
    setGuestId(id);
    console.log('🚀 App initialized with guest ID:', id);
  }, []);

  // Get cart data from API
  const { data: cartData, isLoading: cartLoading } = useGetCartQuery(guestId, {
    skip: !guestId, // Don't fetch until we have guestId
  });

  const cart = cartData?.cart || { items: [], totalAmount: 0, totalItems: 0 };
  const cartItems = cart.items || [];
  const cartTotal = cart.totalAmount || 0;
  const cartCount = cartItems.length; // Count of unique items, not total quantity
  const cartQuantity = cart.totalItems || 0; // Total quantity (sum of all quantities)

  return (
    <CartContext.Provider value={{
      guestId,
      cart,
      cartItems,
      cartTotal,
      cartCount,        // Number of unique items (2 items)
      cartQuantity,     // Total quantity sum (6 total quantity)
      cartLoading
    }}>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="pt-16 flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartContext.Provider>
  );
}

// Main App component with Redux Provider
function App() {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
}

export default App;
