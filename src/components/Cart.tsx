import { useEffect, useRef } from 'react';
import type { Attribute as AttributeSetType, AttributeItem as AttributeItemType, CartProps } from '../types/interfaces';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';

const Cart = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  subtotal,
  onPlaceOrder,
  isPlacingOrder,
  totalCartQuantity,
}: CartProps) => {
  
  const currencySymbol = cartItems.length > 0 ? cartItems[0].prices[0]?.currency.symbol : '$';
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: React.MouseEvent | MouseEvent) => {
    const target = e.target as HTMLElement;

    if (modalRef.current?.contains(target)) return;

    if (target.closest('.CartBtn')) return;

    onClose();
  };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;
  
  return (
    <div className="CartModalOverlay" data-testid="cart-overlay" onClick={onClose}>
    <div className="CartModalContainer" ref={modalRef} onClick={(e) => e.stopPropagation()}>
      <div className="CartPanel">
        <div className="CartContent">
              <div className="flex forHeight flex-col overflow-y-scroll bg-white">
                <div className="flex-1 overflow-y-auto py-2 sm:px-2">
                  <div className="flex items-start justify-between">
                    <h1 className="text-[16px] font-[500] text-[#1D1F22]"><span className='font-[700]'>My Bag,</span> {totalCartQuantity} items</h1>
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="mt-8 text-center">
                      <p className="text-lg text-gray-500">Your cart is empty.</p>
                      <button
                        type="button"
                        onClick={onClose}
                        className="mt-4 font-medium text-green-600 hover:text-green-500"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Total</p>
                      <p data-testid="cart-total">
                        {currencySymbol}
                        {subtotal !== undefined ? subtotal.toFixed(2) : '0.00'}
                      </p>
                      </div>
                      <div className="mt-6">
                      <button
                        type="button"
                        disabled={isPlacingOrder || cartItems.length === 0}
                        className="w-full flex items-center justify-center border border-transparent bg-[#949996] py-3 text-base font-medium text-white hover:bg-[#949996] cursor-not-allowed"
                      >
                        {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                      </button>
                    </div>
                    </div>
                  ) : (
                    <div className="mt-8">
                      <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                          {cartItems.map((product) => {
                            const attributeKeyPart = product.selectedAttributes
                              .map((sa) => sa.itemId)
                              .sort()
                              .join('-');
                            const uniqueKey = `${product.id}-${attributeKeyPart}`;
                            const lineItemPrice = (product.prices[0]?.amount || 0);
                            const lineItemCurrencySymbol = product.prices[0]?.currency.symbol || '$';

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
                                        {lineItemCurrencySymbol}{lineItemPrice.toFixed(2)}
                                      </p>
                                    </div>
                                    
                                    {product.attributes && product.attributes.length > 0 && (
                                      <div className="mt-2 text-sm text-[#1D1F22] space-y-2">
                                        
                                        {product.attributes.map((attrSet: AttributeSetType) => {
                                          const kebabAttributeName = attrSet.name.toLowerCase().replace(/\s+/g, '-');
                                          const selectedOptionForThisSet = product.selectedAttributes.find(
                                            (sa) => sa.attributeId === attrSet.id
                                          );

                                          return (
                                            <div key={attrSet.id} data-testid={`cart-item-attribute-${kebabAttributeName}`}>
                                              <span className="font-normal text-[#1D1F22] text-[14px] capitalize block mb-1">
                                                {attrSet.name}:
                                              </span>
                                              <div className="flex flex-wrap gap-2">
                                                {attrSet.items.map((itemOption: AttributeItemType) => {
                                                  const isSelected = selectedOptionForThisSet?.itemId === itemOption.id;
                                                  const itemValueKebab = itemOption.displayValue.toLowerCase().replace(/\s+/g, '-');
                                                  const testIdSuffix = isSelected ? '-selected' : '';


                                                  if (attrSet.type.toLowerCase() === 'swatch' || attrSet.name.toLowerCase() === 'color') {
                                                    return (
                                                      <span
                                                        key={itemOption.id}
                                                        title={itemOption.displayValue}
                                                        data-testid={`cart-item-attribute-${kebabAttributeName}-${itemValueKebab}${testIdSuffix}`}
                                                        className={`inline-block size-[16px] ${isSelected ? 'ring-2 ring-offset-1 ring-[#5ECE7B] border-green' : 'border-[#5ECE7B]'}`}
                                                        style={{ backgroundColor: itemOption.value }}
                                                        aria-label={`${attrSet.name}: ${itemOption.displayValue}${isSelected ? ' (selected)' : ''}`}
                                                      ></span>
                                                    );
                                                  } else {
                                                    return (
                                                      <span
                                                        key={itemOption.id}
                                                        data-testid={`cart-item-attribute-${kebabAttributeName}-${itemValueKebab}${testIdSuffix}`}
                                                        className={`px-1 py-1 border text-[14px] ${isSelected ? 'bg-[#1D1F22] text-white border-[#1D1F22] font-semibold' : 'bg-white text-[#1D1F22] border-[#1D1F22]'}`}
                                                      >
                                                        {itemOption.value}
                                                      </span>
                                                    );
                                                  }
                                                })}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className='flex flex-col justify-between'>
                                  <button
                                        data-testid="cart-item-amount-decrease"
                                        onClick={() => onUpdateQuantity(product.id, product.selectedAttributes, product.quantity - 1)}
                                        className="ml-2 mr-1 px-2 border hover:bg-gray-100"
                                        aria-label="Decrease quantity"
                                      > - </button>
                                  <span data-testid="cart-item-amount" className="text-center">{product.quantity}</span>
                                  <button
                                        data-testid="cart-item-amount-increase"
                                        onClick={() => onUpdateQuantity(product.id, product.selectedAttributes, product.quantity + 1)}
                                        className="ml-2 mr-1 px-2 border hover:bg-gray-100"
                                        aria-label="Increase quantity"
                                      > + </button>
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
                          })}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className=" px-1 py-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p className='font-[500] text-[16px] text-[#1D1F22]'>Total</p>
                      <p data-testid="cart-total" className='font-[700] text-[16px] text-[#1D1F22]'>
                        {currencySymbol}
                        {subtotal !== undefined ? subtotal.toFixed(2) : '0.00'}
                      </p>
                    </div>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={onPlaceOrder}
                        disabled={isPlacingOrder || cartItems.length === 0}
                        className="w-full flex items-center justify-center border border-transparent bg-[#5ECE7B] py-3 text-[14px] font-medium text-white hover:bg-[#7be396]"
                      >
                        {isPlacingOrder ? 'Placing Order...' : 'PLACE ORDER'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
      </div>
    </div>
  </div>
  );
};

export default Cart;
