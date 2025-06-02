import { useState, useEffect, useCallback } from 'react';
import type {
  CartItem,
  Product,
  SelectedAttribute,
  CartOperations,
} from '../types/interfaces';
import { STORAGE_KEYS } from '../constants';
import {
  areSelectedAttributesEqual,
  getDefaultAttributes,
  calculateCartSubtotal,
  calculateTotalCartQuantity,
  findCartItem,
} from '../utils/cart';

/**
 * Custom hook for managing cart state and operations
 * @returns Cart state and operations
 */
export const useCart = (): {
  cartItems: CartItem[];
  totalQuantity: number;
  subtotal: number;
  operations: CartOperations;
} => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const storedCartItems = localStorage.getItem(STORAGE_KEYS.CART_ITEMS);
      if (storedCartItems) {
        return JSON.parse(storedCartItems) as CartItem[];
      }
    } catch (error) {
      console.error('Error loading cart items from localStorage:', error);
    }
    return [];
  });

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart items to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = useCallback(
    (productToAdd: Product, chosenAttributes?: SelectedAttribute[]) => {
      let attributesForCartItem: SelectedAttribute[] = [];

      if (chosenAttributes && chosenAttributes.length > 0) {
        attributesForCartItem = chosenAttributes;
      } else {
        attributesForCartItem = getDefaultAttributes(productToAdd);
      }

      setCartItems((prevItems) => {
        const existingItem = findCartItem(
          prevItems,
          productToAdd.id,
          attributesForCartItem
        );

        if (existingItem) {
          return prevItems.map((item) =>
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
    },
    []
  );

  const removeFromCart = useCallback(
    (productId: string, attributesToRemove: SelectedAttribute[]) => {
      setCartItems((prevItems) =>
        prevItems.filter(
          (item) =>
            !(
              item.id === productId &&
              areSelectedAttributesEqual(
                item.selectedAttributes,
                attributesToRemove
              )
            )
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (
      productId: string,
      attributesToUpdate: SelectedAttribute[],
      newQuantity: number
    ) => {
      if (newQuantity <= 0) {
        removeFromCart(productId, attributesToUpdate);
      } else {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
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
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const calculateSubtotal = useCallback(() => {
    return calculateCartSubtotal(cartItems);
  }, [cartItems]);

  const totalQuantity = calculateTotalCartQuantity(cartItems);
  const subtotal = calculateSubtotal();

  const operations: CartOperations = {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateSubtotal,
  };

  return {
    cartItems,
    totalQuantity,
    subtotal,
    operations,
  };
};