import type { FC } from 'react';
import type { CartItemProps, Attribute as AttributeSetType } from '../../types/interfaces';
import AttributeDisplay from '../AttributeDisplay';
import { Link } from 'react-router-dom';

const CartItem: FC<CartItemProps> = ({ product, onUpdateQuantity }) => {
  const attributeKeyPart = product.selectedAttributes
    .map(sa => sa.itemId)
    .sort()
    .join('-');
  const uniqueKey = `${product.id}-${attributeKeyPart}`;
  const lineItemPrice = product.prices[0]?.amount || 0;
  const lineItemCurrencySymbol = product.prices[0]?.currency.symbol || '$';

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      onUpdateQuantity(product.id, product.selectedAttributes, 0);
    } else {
      onUpdateQuantity(product.id, product.selectedAttributes, newQuantity);
    }
  };

  return (
    <li key={uniqueKey} className="flex py-6">
      <div className="flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-[18px] font-[300] text-[#1D1F22]">
            <h3>
              <Link to={`/product/${product.id}`}>{product.name}</Link>
            </h3>
          </div>
          <div className="mt-2 text-[16px] font-normal text-[#1D1F22]">
            <p>
              {lineItemCurrencySymbol}
              {lineItemPrice.toFixed(2)}
            </p>
          </div>

          {product.attributes && product.attributes.length > 0 && (
            <div className="mt-2 text-sm text-[#1D1F22] space-y-2">
              {product.attributes.map((attrSet: AttributeSetType) => {
                const selectedOptionForThisSet = product.selectedAttributes.find(
                  sa => sa.attributeId === attrSet.id
                );
                return (
                  <AttributeDisplay
                    key={attrSet.id}
                    attributeSet={attrSet}
                    selectedItemId={selectedOptionForThisSet?.itemId}
                    baseTestIdPrefix="cart-item"
                    displayContext="cartItem"
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <button
          data-testid="cart-item-amount-decrease"
          onClick={() => handleQuantityChange(product.quantity - 1)}
          className="ml-2 mr-1 px-2 border hover:bg-gray-100"
          aria-label="Decrease quantity"
        >
          {' '}
          -{' '}
        </button>
        <span data-testid="cart-item-amount" className="text-center">
          {product.quantity}
        </span>
        <button
          data-testid="cart-item-amount-increase"
          onClick={() => handleQuantityChange(product.quantity + 1)}
          className="ml-2 mr-1 px-2 border hover:bg-gray-100"
          aria-label="Increase quantity"
        >
          {' '}
          +{' '}
        </button>
      </div>
      <div className="w-30 flex-shrink-0 overflow-hidden">
        <img
          alt={product.name}
          src={product.gallery && product.gallery.length > 0 ? product.gallery[0] : ''}
          className=" object-cover object-center"
        />
      </div>
    </li>
  );
};
export default CartItem;
