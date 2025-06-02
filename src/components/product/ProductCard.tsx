import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { ProductCardProps } from '../../types/interfaces';
import { TEST_IDS } from '../../constants';
import WhiteCart from '../../assets/WhiteCart.png';

/**
 * Product card component for displaying products in grid
 */
const ProductCard: FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const kebabCaseName = product.name.toLowerCase().replace(/\s+/g, '-');
  const firstPrice = product.prices && product.prices.length > 0 ? product.prices[0] : null;
  const mainImage = product.gallery && product.gallery.length > 0 ? product.gallery[0] : '';
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div
      key={product.id}
      data-testid={`product-${kebabCaseName}`}
      className="ProductsContainer group relative flex flex-col overflow-hidden"
    >
      <Link 
        to={`/product/${product.id}`} 
        className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg" 
        aria-label={`View details for ${product.name}`}
      >
        <div className="overflow-hidden">
          <div className="relative ProductImage">
            <img
              src={mainImage}
              alt={product.name}
              className={`ProductImage object-cover object-center transition-opacity duration-300
                          ${!product.inStock ? 'filter grayscale' : ''}`}
              loading="lazy"
            />
            {!product.inStock && (
              <div className="absolute OverlayProductOut inset-0 flex items-center justify-center">
                <span className="text-[#8D8F9A] text-[24px] font-normal uppercase tracking-wider px-2 py-1">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 
              className="text-[18px] font-[300] text-[#1D1F22] truncate" 
              title={product.name}
            >
              {product.name}
            </h3>
            {firstPrice && (
              <p className="mt-1 text-[18px] font-[400] text-[#1D1F22]">
                {firstPrice.currency.symbol}
                {firstPrice.amount.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      {product.inStock && (
        <button
          type="button"
          onClick={handleAddToCart}
          data-testid={TEST_IDS.ADD_TO_CART_BUTTON}
          aria-label={`Add ${product.name} to cart`}
          className="absolute top-81 right-8 p-2 bg-[#5ECE7B] text-white rounded-full shadow-md 
                     opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300
                     transform translate-y-2 group-hover:translate-y-0 cursor-pointer
                     hover:bg-[#7be396] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <img 
            src={WhiteCart} 
            className="h-6 w-6" 
            alt=""
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
};

export default ProductCard; 