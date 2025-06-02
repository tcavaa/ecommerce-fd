import type { SelectedAttribute, Product, CartItem } from '../types/interfaces';

/**
 * Compares two arrays of selected attributes for equality
 * @param attrs1 First array of selected attributes
 * @param attrs2 Second array of selected attributes
 * @returns True if arrays are equal, false otherwise
 */
export const areSelectedAttributesEqual = (
  attrs1: SelectedAttribute[] | undefined,
  attrs2: SelectedAttribute[] | undefined
): boolean => {
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

  return sortedAttrs1.every((attr1Item, index) => {
    const attr2Item = sortedAttrs2[index];
    return (
      attr1Item.attributeId === attr2Item.attributeId &&
      attr1Item.itemId === attr2Item.itemId
    );
  });
};

/**
 * Gets default attributes for a product
 * @param product Product to get default attributes for
 * @returns Array of default selected attributes
 */
export const getDefaultAttributes = (product: Product): SelectedAttribute[] => {
  if (!product.attributes || product.attributes.length === 0) {
    return [];
  }

  return product.attributes
    .map((attr) => {
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
};

/**
 * Calculates the subtotal for cart items
 * @param cartItems Array of cart items
 * @returns Total amount
 */
export const calculateCartSubtotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, item) => {
    const price =
      item.prices && item.prices.length > 0 ? item.prices[0].amount : 0;
    return total + price * item.quantity;
  }, 0);
};

/**
 * Calculates total quantity of items in cart
 * @param cartItems Array of cart items
 * @returns Total quantity
 */
export const calculateTotalCartQuantity = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Finds an existing cart item with matching product ID and attributes
 * @param cartItems Array of cart items
 * @param productId Product ID to search for
 * @param attributes Attributes to match
 * @returns Found cart item or undefined
 */
export const findCartItem = (
  cartItems: CartItem[],
  productId: string,
  attributes: SelectedAttribute[]
): CartItem | undefined => {
  return cartItems.find(
    (item) =>
      item.id === productId &&
      areSelectedAttributesEqual(item.selectedAttributes, attributes)
  );
};

/**
 * Creates order attributes object from selected attributes
 * @param selectedAttributes Array of selected attributes
 * @returns Object with attribute keys and values
 */
export const createOrderAttributes = (
  selectedAttributes: SelectedAttribute[]
): Record<string, string> => {
  const attributesObject: Record<string, string> = {};
  selectedAttributes.forEach((sa) => {
    attributesObject[sa.attributeId.toLowerCase()] = sa.itemDisplayValue;
  });
  return attributesObject;
};
