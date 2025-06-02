// Storage Keys
export const STORAGE_KEYS = {
  CART_ITEMS: 'shoppingCartItems',
} as const;

// API Configuration
export const API_CONFIG = {
  GRAPHQL_ENDPOINT: 'https://bd.rretrocar.ge/graphql',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Default Values
export const DEFAULTS = {
  CURRENCY: 'USD',
  QUANTITY: 1,
} as const;

// UI Constants
export const UI_CONSTANTS = {
  CART_ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
} as const;

// Test IDs for better testing
export const TEST_IDS = {
  CART_BUTTON: 'cart-btn',
  ACTIVE_CATEGORY_LINK: 'active-category-link',
  CATEGORY_LINK: 'category-link',
  ADD_TO_CART_BUTTON: 'add-to-cart',
  PRODUCT_CARD: 'product-card',
  CART_ITEM: 'cart-item',
} as const;
