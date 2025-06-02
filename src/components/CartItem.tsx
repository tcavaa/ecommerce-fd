import type {CardItemProprs, Attribute as AttributeSetType, AttributeItem as AttributeItemType} from '../types/interfaces';
import { Link } from 'react-router-dom';

const CartItem = ({
  product,
  onUpdateQuantity
}: CardItemProprs) => {
    const attributeKeyPart = product.selectedAttributes
        .map((sa) => sa.itemId)
        .sort()
        .join('-');
    const uniqueKey = `${product.id}-${attributeKeyPart}`;
    const lineItemPrice = (product.prices[0]?.amount || 0);
    const lineItemCurrencySymbol = product.prices[0]?.currency.symbol || '$';

    return (
        <li key={uniqueKey} className="flex py-6">
        

        <div className="flex flex-1 flex-col">
            <div>
            <div className="flex justify-between text-[18px] font-[300] text-[#1D1F22]">
                <h3>
                <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>
            </div>
            <div className="mt-2 text-[16px] font-normal text-[#1D1F22]">
                <p>
                {lineItemCurrencySymbol}{lineItemPrice.toFixed(2)}
                </p>
            </div>
            
            {product.attributes && product.attributes.length > 0 && (
                <div className="mt-2 text-sm text-[#1D1F22] space-y-2">
                
                {product.attributes.map((attrSet: AttributeSetType) => {
                    const kebabAttributeName = attrSet.name.toLowerCase().replace(/\s+/g, '-');
                    const selectedOptionForThisSet = product.selectedAttributes.find(
                    (sa) => sa.attributeId === attrSet.id
                    );

                    return (
                    <div key={attrSet.id} data-testid={`cart-item-attribute-${kebabAttributeName}`}>
                        <span className="font-normal text-[#1D1F22] text-[14px] capitalize block mb-1">
                        {attrSet.name}:
                        </span>
                        <div className="flex flex-wrap gap-2">
                        {attrSet.items.map((itemOption: AttributeItemType) => {
                            const isSelected = selectedOptionForThisSet?.itemId === itemOption.id;
                            const itemValueKebab = itemOption.displayValue.toLowerCase().replace(/\s+/g, '-');
                            const testIdSuffix = isSelected ? '-selected' : '';


                            if (attrSet.type.toLowerCase() === 'swatch' || attrSet.name.toLowerCase() === 'color') {
                            return (
                                <span
                                key={itemOption.id}
                                title={itemOption.displayValue}
                                data-testid={`cart-item-attribute-${kebabAttributeName}-${itemValueKebab}${testIdSuffix}`}
                                className={`inline-block size-[16px] ${isSelected ? 'ring-2 ring-offset-1 ring-[#5ECE7B] border-green' : 'border-[#5ECE7B]'}`}
                                style={{ backgroundColor: itemOption.value }}
                                aria-label={`${attrSet.name}: ${itemOption.displayValue}${isSelected ? ' (selected)' : ''}`}
                                ></span>
                            );
                            } else {
                            return (
                                <span
                                key={itemOption.id}
                                data-testid={`cart-item-attribute-${kebabAttributeName}-${itemValueKebab}${testIdSuffix}`}
                                className={`px-1 py-1 border text-[14px] ${isSelected ? 'bg-[#1D1F22] text-white border-[#1D1F22] font-semibold' : 'bg-white text-[#1D1F22] border-[#1D1F22]'}`}
                                >
                                {itemOption.value}
                                </span>
                            );
                            }
                        })}
                        </div>
                    </div>
                    );
                })}
                </div>
            )}
            </div>
        </div>
        <div className='flex flex-col justify-between'>
            <button
                data-testid="cart-item-amount-decrease"
                onClick={() => onUpdateQuantity(product.id, product.selectedAttributes, product.quantity - 1)}
                className="ml-2 mr-1 px-2 border hover:bg-gray-100"
                aria-label="Decrease quantity"
                > - </button>
            <span data-testid="cart-item-amount" className="text-center">{product.quantity}</span>
            <button
                data-testid="cart-item-amount-increase"
                onClick={() => onUpdateQuantity(product.id, product.selectedAttributes, product.quantity + 1)}
                className="ml-2 mr-1 px-2 border hover:bg-gray-100"
                aria-label="Increase quantity"
                > + </button>
        </div>
        <div className="w-30 flex-shrink-0 overflow-hidden">
            <img
            alt={product.name}
            src={product.gallery && product.gallery.length > 0 ? product.gallery[0] : ''}
            className=" object-cover object-center"
            />
        </div>
        </li>
    );
}
export default CartItem;