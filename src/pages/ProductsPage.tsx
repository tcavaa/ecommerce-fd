import { useQuery } from '@apollo/client';
import type { FC } from 'react';
import { GET_PRODUCTS } from '../graphql/queries';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import type { GetProductsData, ProductsPageProps } from '../types/interfaces';
import '../styles/ProductsPage.css';

/**
 * Products page component for displaying product listings
 */
const ProductsPage: FC<ProductsPageProps> = ({ onAddToCart }) => {
  const { category } = useParams<{ category: string }>();
  const { loading, error, data } = useQuery<GetProductsData>(
    GET_PRODUCTS,
    {
      variables: { category: category ?? "" },
      errorPolicy: 'all'
    }
  );
  
  const categoryTitle = category ?? 'All Products';
  
  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto py-19 px-4 sm:px-6 lg:px-4">
        <div className="h-12 w-64 bg-gray-200 rounded animate-pulse mb-10" />
        <div className="grid grid-cols-1 gap-y-25 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-[1280px] mx-auto py-19 px-4 sm:px-6 lg:px-4">
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Failed to load products</h2>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-[1280px] mx-auto py-19 px-4 sm:px-6 lg:px-4">
      <h1 className="text-[42px] font-normal tracking-tight text-[#1D1F22] mb-10 capitalize">
        {categoryTitle}
      </h1>
      
      <div className="grid grid-cols-1 gap-y-25 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8">
        {data?.products?.length ? (
          data.products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-500">
              {category 
                ? `No products available in the "${categoryTitle}" category.`
                : 'No products are currently available.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;