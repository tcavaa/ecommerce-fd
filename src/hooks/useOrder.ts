import { useMutation } from '@apollo/client';
import { useCallback } from 'react';
import type {
  CartItem,
  PlaceOrderMutationData,
  PlaceOrderMutationVars,
  OrderInput,
  OrderItemInput,
} from '../types/interfaces';
import { PLACE_ORDER_MUTATION } from '../graphql/mutations';
import { ORDER_STATUS, DEFAULTS } from '../constants';
import { createOrderAttributes } from '../utils/cart';

/**
 * Custom hook for managing order operations
 * @returns Order state and operations
 */
export const useOrder = () => {
  const [placeOrderMutation, { loading: isPlacingOrder, error: orderError }] =
    useMutation<PlaceOrderMutationData, PlaceOrderMutationVars>(
      PLACE_ORDER_MUTATION
    );

  const placeOrder = useCallback(
    async (
      cartItems: CartItem[],
      subtotal: number,
      onSuccess?: () => void
    ): Promise<void> => {
      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      const orderCurrency =
        cartItems[0]?.prices[0]?.currency.label || DEFAULTS.CURRENCY;

      const orderItems: OrderItemInput[] = cartItems.map((item) => {
        const attributesObject = createOrderAttributes(item.selectedAttributes);

        return {
          product_id: item.id,
          product_name: item.name,
          attributes: JSON.stringify(attributesObject),
          quantity: item.quantity,
          amount: item.prices[0]?.amount || 0,
          selected_currency:
            item.prices[0]?.currency.label || DEFAULTS.CURRENCY,
        };
      });

      const orderInput: OrderInput = {
        currency: orderCurrency,
        status: ORDER_STATUS.PENDING,
        total_amount: parseFloat(subtotal.toFixed(2)),
        items: orderItems,
      };

      try {
        await placeOrderMutation({ variables: { orderInput } });
        onSuccess?.();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`Failed to place order: ${errorMessage}`);
      }
    },
    [placeOrderMutation]
  );

  return {
    placeOrder,
    isPlacingOrder,
    orderError,
  };
};
