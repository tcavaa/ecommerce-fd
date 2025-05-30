import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import type { 
  Product, 
  CartItem, 
  SelectedAttribute, 
  PlaceOrderMutationData, 
  PlaceOrderMutationVars, 
  OrderInput, 
  OrderItemInput 
} from './types/interfaces';
import { useMutation } from '@apollo/client';
import { PLACE_ORDER_MUTATION} from './graphql/mutations';
import ProductsPage from './pages/ProductsPage';
import ProductInnerPage from './pages/ProductInnerPage';
import './styles/App.css'
import "@fontsource/raleway/400.css";

const CART_STORAGE_KEY = 'shoppingCartItems';

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const storedCartItems = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCartItems) {
        return JSON.parse(storedCartItems);
      }
    } catch (error) {
    }
    return [];
  });
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart items to localStorage:", error);
    }
  }, [cartItems])

  const toggleCart = () => {
    setOpen(prevOpen => !prevOpen);
  };
  
  function areSelectedAttributesEqual(
    attrs1: SelectedAttribute[] | undefined,
    attrs2: SelectedAttribute[] | undefined
  ): boolean {
    
    if (attrs1 === attrs2) {
      return true;
    }
    if (!attrs1 || !attrs2) {
      return false;
    }
    if (attrs1.length !== attrs2.length) {
      return false;
    }
    if (attrs1.length === 0) {
      return true;
    }

    const sortedAttrs1 = [...attrs1].sort((a, b) =>
      a.attributeId.localeCompare(b.attributeId)
    );
    const sortedAttrs2 = [...attrs2].sort((a, b) =>
      a.attributeId.localeCompare(b.attributeId)
    );

    const result = sortedAttrs1.every((attr1Item, index) => {
      const attr2Item = sortedAttrs2[index];
      const match =
        attr1Item.attributeId === attr2Item.attributeId &&
        attr1Item.itemId === attr2Item.itemId;
      return match;
    });

    return result;
  }

  const handleAddToCart = (
    productToAdd: Product,
    chosenAttributes?: SelectedAttribute[]
  ) => {
    let attributesForCartItem: SelectedAttribute[] = [];

    if (chosenAttributes && chosenAttributes.length > 0) {
      attributesForCartItem = chosenAttributes;
    } else if (productToAdd.attributes && productToAdd.attributes.length > 0) {
      attributesForCartItem = productToAdd.attributes
        .map(attr => {
          const defaultItem =
            attr.items && attr.items.length > 0 ? attr.items[0] : null;
          if (defaultItem) {
            return {
              attributeId: attr.id,
              itemId: defaultItem.id,
              itemValue: defaultItem.value,
              itemDisplayValue: defaultItem.displayValue,
            };
          }
          return null;
        })
        .filter(Boolean) as SelectedAttribute[];
    }
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item =>
          item.id === productToAdd.id &&
          areSelectedAttributesEqual(
            item.selectedAttributes,
            attributesForCartItem
          )
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.id === productToAdd.id &&
          areSelectedAttributesEqual(
            item.selectedAttributes,
            attributesForCartItem
          )
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newCartItem: CartItem = {
          ...productToAdd,
          quantity: 1,
          selectedAttributes: attributesForCartItem,
        };
        return [...prevItems, newCartItem];
      }
    });
  };

  const handleRemoveFromCart = (
    productId: string,
    attributesToRemove: SelectedAttribute[]
  ) => {
    setCartItems(prevItems =>
      prevItems.filter(
        item =>
          !(
            item.id === productId &&
            areSelectedAttributesEqual(item.selectedAttributes, attributesToRemove)
          )
      )
    );
  };

  const handleUpdateQuantity = (
    productId: string,
    attributesToUpdate: SelectedAttribute[],
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId, attributesToUpdate);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId &&
          areSelectedAttributesEqual(
            item.selectedAttributes,
            attributesToUpdate
          )
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
        const price = item.prices && item.prices.length > 0 ? item.prices[0].amount : 0;
        return total + price * item.quantity;
    }, 0);
  };

  const [
    placeOrderMutation,
    { loading: orderLoading },
  ] = useMutation<PlaceOrderMutationData, PlaceOrderMutationVars>(PLACE_ORDER_MUTATION);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      return;
    }

    const totalAmount = calculateSubtotal();
    const orderCurrency = cartItems[0]?.prices[0]?.currency.label || "USD";

    const orderItems: OrderItemInput[] = cartItems.map(item => {
      const attributesObject: Record<string, string> = {};
      item.selectedAttributes.forEach(sa => {
        attributesObject[sa.attributeId.toLowerCase()] = sa.itemDisplayValue;
      });

      return {
        product_id: item.id,
        product_name: item.name,
        attributes: JSON.stringify(attributesObject),
        quantity: item.quantity,
        amount: item.prices[0]?.amount || 0,
        selected_currency: item.prices[0]?.currency.label || "USD",
      };
    });

    const orderInput: OrderInput = {
      currency: orderCurrency,
      status: "pending",
      total_amount: parseFloat(totalAmount.toFixed(2)),
      items: orderItems,
    };

    try {
      await placeOrderMutation({ variables: { orderInput } });
      setCartItems([]);
    } catch (e) {
      alert(`Error placing order: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  return (
    <Router>
      <Nav
        cartItems={cartItems}
        isOpen={open}
        onClose={toggleCart}
        onUpdateQuantity={handleUpdateQuantity}
        subtotal={calculateSubtotal()}
        onPlaceOrder={handlePlaceOrder}
        isPlacingOrder={orderLoading}
      />
      <main>
        <Routes>
          <Route
            path="/"
            element={<ProductsPage onAddToCart={handleAddToCart} />}
          />
          <Route
            path="/:category"
            element={<ProductsPage onAddToCart={handleAddToCart} />}
          />
          <Route
            path="/product/:id"
            element={<ProductInnerPage onAddToCart={handleAddToCart} isOpen={open} onClose={toggleCart} />}
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;