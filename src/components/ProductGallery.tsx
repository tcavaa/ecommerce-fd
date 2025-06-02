import { useState, useEffect } from 'react';
import type { GetProductData } from '../types/interfaces';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ProductGallery = (data:GetProductData) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const { product } = data;

    useEffect(() => {
        if (product?.gallery?.length) {
        setCurrentIndex(0);
        }
    }, [product?.id]);

    const mainImage = product?.gallery?.[currentIndex] || (product?.gallery?.[0] || '');
    
    const handleThumbnailClick = (index: number) => {
        setCurrentIndex(index);
    };

    const handlePrevImage = () => {
        if (product?.gallery) {
            setCurrentIndex((prevIndex) => 
            (prevIndex === 0 ? product.gallery.length - 1 : prevIndex - 1)
            );
        }
    };

    const handleNextImage = () => {
        if (product?.gallery) {
            setCurrentIndex((prevIndex) => 
            (prevIndex === product.gallery.length - 1 ? 0 : prevIndex + 1)
            );
        }
    };

    return (
        <div className="flex flex-row items-start gap-x-2 sm:gap-x-4 lg:sticky lg:top-24 self-start" data-testid="product-gallery">
            {product.gallery && product.gallery.length > 0 && (
            <div 
                className="flex flex-col w-16 sm:w-20 mr-[27px] flex-shrink-0 gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100" 
                style={{ maxHeight: '480px' }}
            >
                {product.gallery.map((imgUrl:string, index:number) => (
                <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`w-full galleryImg aspect-square overflow-hidden flex-shrink-0 transition-all duration-150
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

            <div className="flex-grow relative  MainImageInner aspect-[0.8] sm:aspect-square lg:aspect-[0.8] bg-gray-100 rounded-sm overflow-hidden shadow-sm">
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
    );
}
export default ProductGallery;