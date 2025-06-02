import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_PRODUCT } from '../graphql/queries';
import ProductGallery from '../components/ProductGallery';
import AttributeDisplay from '../components/AttributeDisplay';
import type {
  GetProductData,
  Attribute as AttributeSetType,
  SelectedAttribute,
  ProductInnerPageProps
} from '../types/interfaces';
import '../styles/ProductInnerPage.css';

const ProductInnerPage = ({ onAddToCart, onClose }: ProductInnerPageProps) => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery<GetProductData>(GET_PRODUCT, {
    variables: { id: id || "" },
    skip: !id,
  });
  const cleanDescription = DOMPurify.sanitize(data?.product.description || "");
  const [currentSelections, setCurrentSelections] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (data?.product?.id) {
       setCurrentSelections({});
    }
  }, [data?.product?.id]);

  const allAttributesSelected = data?.product?.attributes?.every(
    (attrSet) => currentSelections[attrSet.id] !== undefined
  ) ?? (data?.product?.attributes?.length === 0);

  const handleAttributeSelect = (attributeSetId: string, itemId: string) => {
    setCurrentSelections(prev => ({
      ...prev,
      [attributeSetId]: itemId,
    }));
  };

  const handleAddToCartClick = () => {
    if (!data?.product || !data.product.inStock) return;

    const product = data.product;
    const chosenForCart: SelectedAttribute[] = [];

    if (product.attributes && product.attributes.length > 0) {
      for (const attrSet of product.attributes) {
        const selectedItemId = currentSelections[attrSet.id];
        if (selectedItemId) {
          const selectedItem = attrSet.items.find(item => item.id === selectedItemId);
          if (selectedItem) {
            chosenForCart.push({
              attributeId: attrSet.id,
              itemId: selectedItem.id,
              itemValue: selectedItem.value,
              itemDisplayValue: selectedItem.displayValue,
            });
          }
        }
      }
    }
    onAddToCart(product, chosenForCart);
    onClose();
  };

  if (loading) return <p className="py-20 text-center text-xl">Loading product details...</p>;
  if (error) return <p className="py-20 text-center text-black-500 text-xl">Product Not Found</p>;
  if (!data || !data.product) return <p className="py-20 text-center text-xl">Product not found.</p>;

  const { product } = data;
  const currentPrice = product.prices && product.prices.length > 0 ? product.prices[0] : null;

  return (
  <div className="ProductsInnerContainer container mx-auto mt-8 sm:mt-12 mb-20 px-4 sm:px-6">
    <div className="lg:grid lg:grid-cols-2 lg:gap-x-10 xl:grid-cols-[auto_1fr] xl:gap-x-12 items-start">
      
      <ProductGallery product={data.product} />

      <div className="mt-8 lg:mt-0 pr-[160px] space-y-5 md:space-y-6 lg:pl-15">
        <div>
          <h1 className="text-[30px] sm:text-3xl font-[600] text-[#1D1F22] tracking-normal">{product.name}</h1>
        </div>

        {product.attributes && product.attributes.length > 0 && (
          <div className="space-y-5">
            {product.attributes.map((attrSet: AttributeSetType) => (
              <AttributeDisplay
                key={attrSet.id}
                attributeSet={attrSet}
                selectedItemId={currentSelections[attrSet.id]}
                onAttributeSelect={handleAttributeSelect}
                baseTestIdPrefix="product"
                displayContext="productPage"
              />
            ))}
          </div>
        )}

        {currentPrice && (
          <div className="mt-6">
            <h3 className="text-[18px] font-[700] text-[#1D1F22] uppercase tracking-wider mb-1">Price:</h3>
            <p className="text-[24px] font-[700] text-[#1D1F22]" data-testid="product-price">
              {currentPrice.currency.symbol}
              {currentPrice.amount.toFixed(2)}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleAddToCartClick}
          disabled={!product.inStock || !allAttributesSelected}
          data-testid="add-to-cart"
          className={`mt-6 w-full py-3.5 px-6 border border-transparent rounded-none text-sm font-semibold uppercase text-white tracking-wider
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700
                      ${(!product.inStock || !allAttributesSelected)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#5ECE7B] hover:bg-[#4CAF50]'
                      }`}
        >
          {!product.inStock ? 'Out of Stock' : (!allAttributesSelected ? 'Select Options' : 'Add to Cart')}
        </button>

        {product.description && cleanDescription && (
          <div className="mt-8">
            <div
              className="text-sm text-gray-700 space-y-3"
              data-testid="product-description"
            >
              {parse(cleanDescription)}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

};

export default ProductInnerPage;