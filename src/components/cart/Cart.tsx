import { useEffect, useRef, type FC } from 'react';
import type { CartProps } from '../../types/interfaces';
import CartItem from './CartItem';
import { Button } from '../ui/Button';
import '../../styles/Cart.css';

/**
 * Shopping cart component with overlay
 */
const Cart: FC<CartProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  subtotal,
  onPlaceOrder,
  isPlacingOrder,
  totalCartQuantity,
}) => {
  const currencySymbol =
    cartItems.length > 0 ? cartItems[0].prices[0]?.currency.symbol : '$';
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close cart
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (modalRef.current?.contains(target)) return;
      if (target.closest('.CartBtn')) return;

      onClose();
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when cart is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, isOpen]);

  if (!isOpen) return null;

  const formattedSubtotal =
    subtotal !== undefined ? subtotal.toFixed(2) : '0.00';

  return (
    <div
      className='CartModalOverlay'
      data-testid='cart-overlay'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-labelledby='cart-title'>
      <div
        className='CartModalContainer'
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}>
        <div className='CartPanel'>
          <div className='CartContent'>
            <div className='flex forHeight flex-col overflow-y-scroll bg-white'>
              {/* Cart Header */}
              <div className='flex-1 overflow-y-auto py-2 sm:px-2'>
                <div className='flex items-start justify-between'>
                  <h1
                    id='cart-title'
                    className='text-[16px] font-[500] text-[#1D1F22]'>
                    <span className='font-[700]'>My Bag,</span>{' '}
                    {totalCartQuantity} items
                  </h1>
                  <button
                    onClick={onClose}
                    className='p-2 hover:bg-gray-100 rounded-md'
                    aria-label='Close cart'>
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </button>
                </div>

                {/* Cart Items or Empty State */}
                {cartItems.length === 0 ? (
                  <div className='mt-8 text-center'>
                    <div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                      <svg
                        className='w-8 h-8 text-gray-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                        />
                      </svg>
                    </div>
                    <p className='text-lg text-gray-500 mb-4'>
                      Your cart is empty
                    </p>
                    <Button variant='ghost' onClick={onClose}>
                      Continue Shopping →
                    </Button>
                  </div>
                ) : (
                  <div className='mt-8'>
                    <div className='flow-root'>
                      <ul
                        role='list'
                        className='-my-6 divide-y divide-gray-200'>
                        {cartItems.map((product, index) => (
                          <li key={`${product.id}-${index}`}>
                            <CartItem
                              onUpdateQuantity={onUpdateQuantity}
                              product={product}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              <div className='px-1 py-6 border-t border-gray-200'>
                <div className='flex justify-between text-base font-medium text-gray-900 mb-6'>
                  <p className='font-[500] text-[16px] text-[#1D1F22]'>Total</p>
                  <p
                    data-testid='cart-total'
                    className='font-[700] text-[16px] text-[#1D1F22]'>
                    {currencySymbol}
                    {formattedSubtotal}
                  </p>
                </div>

                <Button
                  onClick={() => void onPlaceOrder()}
                  disabled={cartItems.length === 0}
                  isLoading={isPlacingOrder}
                  fullWidth
                  className='bg-[#5ECE7B] hover:bg-[#7be396] text-[14px] font-medium py-3'>
                  PLACE ORDER
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
