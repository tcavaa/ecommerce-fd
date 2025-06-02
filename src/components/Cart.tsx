import { useEffect, useRef } from 'react';
import type { CartProps } from '../types/interfaces';
import CartItem from './CartItem';
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
                          {cartItems.map((product) => (
                            <CartItem onUpdateQuantity={onUpdateQuantity} product={product} />
                          ))}
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
