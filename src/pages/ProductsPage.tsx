import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../graphql/queries';
import { useParams, Link } from 'react-router-dom';
import type { GetProductsData, ProductsPageProps }  from '../types/interfaces';
import WhiteCart from '../assets/WhiteCart.png';
import '../styles/ProductsPage.css';

const ProductsPage = ({ onAddToCart }: ProductsPageProps) => {
  const { category } = useParams<{ category: string }>()
  const { loading, error, data } = useQuery<GetProductsData>(
    GET_PRODUCTS,
    {
      variables: { category: category || "" }
    }
  );
  
  if (loading) return <p className="text-center mt-8">Loading...</p>
  if (error) return <p className="text-center text-red-500 mt-8">Error: {error.message}</p>
  
  return (
    <div className="ProductsPageContainer max-w-7xl mx-auto py-19 px-4 sm:px-6 lg:px-4">
      <h1 className="text-[42px] font-normal tracking-tight text-[#1D1F22] mb-10 capitalize">
        {category || 'All Products'}
      </h1>
      <div className="grid grid-cols-1 gap-y-25 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8">
      {data && data.products && data.products.length > 0 ? (
        data?.products?.map((product) => {
          const kebabCaseName = product.name.toLowerCase().replace(/\s+/g, '-');
          const firstPrice = product.prices && product.prices.length > 0 ? product.prices[0] : null;
          const mainImage = product.gallery && product.gallery.length > 0 ? product.gallery[0] : '';

          return (
            <div
              key={product.id}
              data-testid={`product-${kebabCaseName}`}
              className="ProductsContainer group relative pt-4 flex flex-col overflow-hidden"
            >
              <Link to={`/product/${product.id}`} className="block" aria-label={`View details for ${product.name}`}>
                <div className="aspect-w-1 aspect-h-1 overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                  <div className="relative ProductImage h-full">
                    <img
                      src={mainImage}
                      alt={product.name}
                      className={`ProductImage h-full object-cover object-center transition-opacity duration-300
                                  ${!product.inStock ? 'filter grayscale' : ''}`}
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
                    <h3 className="text-[18px] font-[300] text-[#1D1F22] truncate" title={product.name}>
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

              {product.inStock && (
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product);
                  }}
                  aria-label={`Add ${product.name} to cart`}
                  className="absolute top-81 right-8 p-2 bg-[#5ECE7B] text-white rounded-full shadow-md 
                             opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300
                             transform translate-y-2 group-hover:translate-y-0 cursor-pointer
                             hover:bg-[#5ECE7B] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <img src={WhiteCart} className="h-6 w-6 text-white-700"/>
                </button>
              )}
            </div>
          );
        })
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-xl text-gray-500">No products found in this category.</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductsPage;
