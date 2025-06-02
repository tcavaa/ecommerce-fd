import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import Navigation from './components/layout/Navigation';
import ProductsPage from './pages/ProductsPage';
import ProductInnerPage from './pages/ProductInnerPage';
import { useCart } from './hooks/useCart';
import { useOrder } from './hooks/useOrder';
import './styles/App.css';
import '@fontsource/raleway/400.css';

/**
 * Main application component
 */
function App() {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Cart management
  const { cartItems, subtotal, operations } = useCart();

  // Order management
  const { placeOrder, isPlacingOrder, orderError } = useOrder();

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const handlePlaceOrder = async () => {
    try {
      await placeOrder(cartItems, subtotal, () => {
        operations.clearCart();
        setIsCartOpen(false);
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to place order';
      alert(errorMessage);
    }
  };

  // Show order error if it exists
  if (orderError) {
    console.error('Order error:', orderError);
  }

  return (
    <ErrorBoundary>
      <Router>
        <Navigation
          cartItems={cartItems}
          isOpen={isCartOpen}
          onClose={toggleCart}
          onUpdateQuantity={operations.updateQuantity}
          subtotal={subtotal}
          onPlaceOrder={handlePlaceOrder}
          isPlacingOrder={isPlacingOrder}
        />
        <main>
          <Routes>
            <Route
              path='/'
              element={<ProductsPage onAddToCart={operations.addToCart} />}
            />
            <Route
              path='/:category'
              element={<ProductsPage onAddToCart={operations.addToCart} />}
            />
            <Route
              path='/product/:id'
              element={
                <ProductInnerPage
                  onAddToCart={operations.addToCart}
                  isOpen={isCartOpen}
                  onClose={toggleCart}
                />
              }
            />
          </Routes>
        </main>
      </Router>
    </ErrorBoundary>
  );
}

export default App;