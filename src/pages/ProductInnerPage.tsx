import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_PRODUCT } from '../graphql/queries';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type {
  GetProductData,
  Attribute as AttributeSetType,
  AttributeItem as AttributeItemType,
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
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (data?.product?.gallery?.length) {
      setCurrentIndex(0);
       setCurrentSelections({});
    }
  }, [data?.product?.id]);

  const mainImage = data?.product?.gallery?.[currentIndex] || (data?.product?.gallery?.[0] || '');

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handlePrevImage = () => {
    if (data?.product?.gallery) {
      setCurrentIndex((prevIndex) => 
        (prevIndex === 0 ? data.product.gallery.length - 1 : prevIndex - 1)
      );
    }
  };

  const handleNextImage = () => {
    if (data?.product?.gallery) {
      setCurrentIndex((prevIndex) => 
        (prevIndex === data.product.gallery.length - 1 ? 0 : prevIndex + 1)
      );
    }
  };

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
      
      <div className="flex flex-row items-start gap-x-2 sm:gap-x-4 lg:sticky lg:top-24 self-start" data-testid="product-gallery">
        {product.gallery && product.gallery.length > 0 && (
          <div 
            className="flex flex-col w-16 sm:w-20 flex-shrink-0 gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100" 
            style={{ maxHeight: '480px' }}
          >
            {product.gallery.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`w-full galleryImg aspect-square rounded-sm overflow-hidden border-2 flex-shrink-0 transition-all duration-150
                            ${currentIndex === index ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-300 hover:border-gray-500 opacity-70 hover:opacity-100'}`}
                aria-label={`View image ${index + 1} of ${product.gallery.length}`}
              >
                <img 
                  src={imgUrl} 
                  alt={`${product.name} thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div className="flex-grow relative  MainImageInner aspect-[0.8] sm:aspect-square lg:aspect-[0.8] bg-gray-100 rounded-sm overflow-hidden shadow-sm"> {/* Adjusted aspect ratio */}
          <img
            src={mainImage}
            alt={product.name}
            className=" MainImageInnerImg object-cover"
          />
          {product.gallery && product.gallery.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#000000BA] bg-opacity-70 text-white hover:bg-opacity-75 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="w-5 h-5"/>
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#000000BA] bg-opacity-70 text-white hover:bg-opacity-75 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Next image"
              >
                <ChevronRightIcon className="w-5 h-5"/>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 lg:mt-0 pr-[160px] space-y-5 md:space-y-6 lg:pl-15">
        <div>
          <h1 className="text-[30px] sm:text-3xl font-[600] text-[#1D1F22] tracking-normal">{product.name}</h1>
        </div>

        {product.attributes && product.attributes.length > 0 && (
          <div className="space-y-5">
            {product.attributes.map((attrSet: AttributeSetType) => {
              const kebabAttribute = attrSet.name.toLowerCase().replace(/\s+/g, '-');
              
              return (
                <div key={attrSet.id} data-testid={`product-attribute-${kebabAttribute}`}>
                  <h3 className="text-[18px] font-[700] text-[#1D1F22] uppercase tracking-wider mb-2">
                    {attrSet.name}:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {attrSet.items.map((item: AttributeItemType) => {
                      const isSelected = currentSelections[attrSet.id] === item.id;
                      const focusRingClasses = "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500";
                      const kebabAttribute2 = item.value.toLowerCase().replace(/\s+/g, '-');
                      if (attrSet.name.toLowerCase() === 'color') {
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleAttributeSelect(attrSet.id, item.id)}
                            className={`w-8 h-8  ${focusRingClasses} transition-all
                                        ${isSelected ? ' ring-1 ring-[green] ring-offset-1' : 'hover:border-gray-400'}`}
                            title={item.displayValue}
                            aria-label={`Select ${attrSet.name} ${item.displayValue}`}
                            aria-pressed={isSelected}
                            data-testid={`product-attribute-${kebabAttribute}-${kebabAttribute2}`}
                          >
                            <span className="block w-full h-full" style={{ backgroundColor: item.value }}></span>
                          </button>
                        );
                      } else {
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleAttributeSelect(attrSet.id, item.id)}
                            className={`min-w-[40px] h-10 px-3 py-1 border text-[16px] font-normal ${focusRingClasses} transition-colors
                                        ${isSelected
                                          ? 'bg-[#1D1F22] text-white border-[#1D1F22]'
                                          : 'bg-white text-[#1D1F22] border-gray-400 hover:border-black'
                                        }`}
                            aria-pressed={isSelected}
                            data-testid={`product-attribute-${kebabAttribute}-${kebabAttribute2}`}
                          >
                            {item.value}
                          </button>
                        );
                      }
                    })}
                  </div>
                </div>
              );
            })}
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