import { useQuery } from '@apollo/client';
import { Link, useLocation } from 'react-router-dom';
import type { FC } from 'react';
import { GET_CATS } from '../../graphql/queries';
import Cart from '../cart/Cart';
import type { CategoryType, Category, NavProps } from '../../types/interfaces';
import { TEST_IDS } from '../../constants';
import { calculateTotalCartQuantity } from '../../utils/cart';
import logo from '../../assets/a-logo.png';
import BlackCart from '../../assets/BlackCart.png';

/**
 * Main navigation component with category links and cart
 */
const Navigation: FC<NavProps> = ({
  cartItems,
  onUpdateQuantity,
  subtotal,
  onPlaceOrder,
  isPlacingOrder,
  isOpen,
  onClose,
}) => {
  const {
    data: categoryData,
    loading,
    error,
  } = useQuery<CategoryType>(GET_CATS);
  const location = useLocation();
  const currentPath = location.pathname;
  const totalCartQuantity = calculateTotalCartQuantity(cartItems);

  if (error) {
    console.error('Error loading categories:', error);
  }

  return (
    <nav
      className='flex justify-between items-center max-w-[1440px] m-auto pt-[23px] pr-[100px] pb-[17px] pl-[100px]'
      role='navigation'
      aria-label='Main navigation'>
      {/* Category Links */}
      <div className='flex items-center flex-nowrap gap-2 sm:gap-3 md:gap-8 overflow-x-auto min-w-0 pr-2'>
        {loading ? (
          <div className='flex space-x-4'>
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className='h-4 w-16 bg-gray-200 rounded animate-pulse'
              />
            ))}
          </div>
        ) : (
          categoryData?.categories.map((cat: Category) => {
            const linkTo = cat.name === 'all' ? '/all' : `/${cat.name}`;
            const isActive =
              currentPath === linkTo ||
              (linkTo === '/all' && currentPath === '/');
            const testId = isActive
              ? TEST_IDS.ACTIVE_CATEGORY_LINK
              : TEST_IDS.CATEGORY_LINK;

            return (
              <div key={cat.name} className='flex-shrink-0 mx-2 sm:mx-4'>
                <Link
                  to={linkTo}
                  className={`CategoryLink
                    text-[16px] font-[400] h-[73px] flex items-center justify-center
                    transition uppercase
                    ${
                      isActive
                        ? 'border-b-2 ActiveCategoryLink text-[#5ECE7B]'
                        : ''
                    }
                  `}
                  data-testid={testId}
                  aria-current={isActive ? 'page' : undefined}>
                  {cat.name}
                </Link>
              </div>
            );
          })
        )}
      </div>

      {/* Logo */}
      <Link to='/' aria-label='Go to homepage'>
        <img src={logo} alt='Store Logo' className='size-[31px]' />
      </Link>

      {/* Cart Button */}
      <div className='relative'>
        <button
          onClick={onClose}
          aria-label={`Open cart (${totalCartQuantity} items)`}
          data-testid={TEST_IDS.CART_BUTTON}
          className='CartBtn size-[20px] relative hover:bg-gray-100 transition-colors'>
          <img
            src={BlackCart}
            alt=''
            className='text-gray-700'
            aria-hidden='true'
          />
          {totalCartQuantity > 0 && (
            <span
              className='absolute -top-2 -right-3 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'
              aria-label={`${totalCartQuantity} items in cart`}>
              {totalCartQuantity}
            </span>
          )}
        </button>
      </div>

      {/* Cart Overlay */}
      {isOpen && (
        <Cart
          isOpen={isOpen}
          onClose={onClose}
          cartItems={cartItems}
          onUpdateQuantity={onUpdateQuantity}
          subtotal={subtotal}
          onPlaceOrder={onPlaceOrder}
          isPlacingOrder={isPlacingOrder}
          totalCartQuantity={totalCartQuantity}
        />
      )}
    </nav>
  );
};

export default Navigation;