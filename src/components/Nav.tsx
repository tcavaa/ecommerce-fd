import { useQuery } from '@apollo/client';
import { Link, useLocation } from 'react-router-dom';
import { GET_CATS } from '../graphql/queries';
import Cart from './Cart';
import type { CategoryType, Category, NavProps } from '../types/interfaces';
import '../styles/Nav.css' 
import logo from '../assets/a-logo.png';
import BlackCart from '../assets/BlackCart.png';

const Nav = ({ cartItems, onUpdateQuantity, subtotal,onPlaceOrder, isPlacingOrder, isOpen, onClose }: NavProps) => {
  const { data: categoryData } = useQuery<CategoryType>(GET_CATS);
  const location = useLocation();
  const currentPath = location.pathname;
  const totalCartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <nav className="NavContainer flex justify-between items-center">
      <div className="flex items-center flex-nowrap gap-2 sm:gap-3 md:gap-8 overflow-x-auto min-w-0 pr-2">
        
        {categoryData?.categories.map((cat: Category) => {
          const linkTo = cat.name === 'all' ? '/all' : `/${cat.name}`;
          const isActive = currentPath === linkTo || (linkTo === '/all' && currentPath === '/');
          const testId = isActive ? 'active-category-link' : 'category-link';

          return (
            <div className="flex-shrink-0 mx-2 sm:mx-4">
              <Link
                key={cat.name}
                to={linkTo}
                className={`CategoryLink
                  transition uppercase
                  ${isActive ? 'border-b-2 ActiveCategoryLink' : ''}
                `}
                data-testid={testId}
              >
                {cat.name}
            </Link>
            </div>
          );
        })}
      </div>
      <Link to="/">
        <img src={logo} alt="Logo" className='Logo' />
      </Link>
      <div className="relative">
        <button
          onClick={onClose}
          aria-label="Open cart"
          data-testid='cart-btn'
          className="CartBtn"
        >
          <img src={BlackCart} aria-hidden="true" className="h-6 w-6 text-gray-700" />
          {totalCartQuantity > 0 && (
            <span className="absolute -top-2 -right-3 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalCartQuantity}
            </span>
          )}
        </button>
      </div>  
      {isOpen && (
        <Cart  isOpen={isOpen} 
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

export default Nav;
