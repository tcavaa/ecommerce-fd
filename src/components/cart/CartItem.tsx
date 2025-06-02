import type { FC } from 'react';
import type { CartItemProps } from '../../types/interfaces';

/**
 * Individual cart item component
 */
const CartItem: FC<CartItemProps> = ({ product, onUpdateQuantity }) => {
  const firstPrice = product.prices?.[0];
  const mainImage = product.gallery?.[0] ?? '';

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      onUpdateQuantity(product.id, product.selectedAttributes, 0);
    } else {
      onUpdateQuantity(product.id, product.selectedAttributes, newQuantity);
    }
  };

  return (
    <div className="py-6 flex">
      <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-center object-cover"
        />
      </div>

      <div className="ml-4 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <span className="text-sm font-medium text-gray-900">
                {product.name}
              </span>
            </h3>
            {firstPrice && (
              <p className="ml-4 text-sm font-medium text-gray-900">
                {firstPrice.currency.symbol}
                {(firstPrice.amount * product.quantity).toFixed(2)}
              </p>
            )}
          </div>
          {product.brand && (
            <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
          )}
        </div>
        <div className="flex-1 flex items-end justify-between text-sm">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleQuantityChange(product.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-8 text-center font-medium">
              {product.quantity}
            </span>
            <button
              type="button"
              onClick={() => handleQuantityChange(product.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="flex">
            <button
              type="button"
              onClick={() => handleQuantityChange(0)}
              className="font-medium text-red-600 hover:text-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem; 