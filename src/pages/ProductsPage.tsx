import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../graphql/queries';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import type { GetProductsData, ProductsPageProps }  from '../types/interfaces';
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
        data?.products?.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart}/>
        ))
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
