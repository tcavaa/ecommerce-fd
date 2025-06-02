{
  /* Products and Cart Interfaces*/
}
export interface Currency {
  label: string;
  symbol: string;
  __typename?: string;
}

export interface Price {
  amount: number;
  currency: Currency;
  __typename?: string;
}

export interface AttributeItem {
  id: string;
  value: string;
  displayValue: string;
  __typename?: string;
}

export interface Attribute {
  id: string;
  name: string;
  type: string;
  items: AttributeItem[];
  __typename?: string;
}

export interface Product {
  id: string;
  gallery: string[];
  name: string;
  inStock: boolean;
  description: string;
  category: string;
  brand: string;
  prices: Price[];
  attributes: Attribute[];
  __typename?: string;
}

export interface GetProductsData {
  products: Product[];
}

export interface GetProductData {
  product: Product;
}

export interface Category {
  name: string;
  __typename?: string;
}

export interface CategoryType {
  categories: Category[];
}

export interface SelectedAttribute {
  attributeId: string;
  itemId: string;
  itemValue: string;
  itemDisplayValue: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedAttributes: SelectedAttribute[];
}
{
  /* Order Interfaces*/
}
export interface OrderItemInput {
  product_id: string;
  product_name: string;
  attributes: string;
  quantity: number;
  amount: number;
  selected_currency: string;
}

export interface OrderInput {
  currency: string;
  status: string;
  total_amount: number;
  items: OrderItemInput[];
}

export interface PlaceOrderMutationData {
  placeOrder: string;
}

export interface PlaceOrderMutationVars {
  orderInput: OrderInput;
}
{
  /* Components and Pages Interfaces*/
}
export interface NavProps {
  cartItems: CartItem[];
  onUpdateQuantity: (
    productId: string,
    attributes: SelectedAttribute[],
    newQuantity: number
  ) => void;
  subtotal?: number;
  onPlaceOrder: () => Promise<void>;
  isPlacingOrder: boolean;
  isOpen: boolean;
  onClose: () => void;
}
export interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (
    productId: string,
    attributes: SelectedAttribute[],
    newQuantity: number
  ) => void;
  subtotal?: number;
  onPlaceOrder: () => Promise<void>;
  isPlacingOrder: boolean;
  isOpen: boolean;
  onClose: () => void;
  totalCartQuantity: number;
}
export interface ProductsPageProps {
  onAddToCart: (product: Product) => void;
}
export interface ProductCardProps {
  onAddToCart: (product: Product) => void;
  product: Product;
}
export interface CartItemProps {
  onUpdateQuantity: (
    productId: string,
    attributes: SelectedAttribute[],
    newQuantity: number
  ) => void;
  product: CartItem;
}
export interface ProductGalleryProps {
  data: GetProductData;
}
export interface ProductInnerPageProps {
  onAddToCart: (
    product: Product,
    chosenAttributes: SelectedAttribute[]
  ) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Utility Types
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface CartOperations {
  addToCart: (product: Product, chosenAttributes?: SelectedAttribute[]) => void;
  removeFromCart: (productId: string, attributes: SelectedAttribute[]) => void;
  updateQuantity: (
    productId: string,
    attributes: SelectedAttribute[],
    newQuantity: number
  ) => void;
  clearCart: () => void;
  calculateSubtotal: () => number;
}
