import React from 'react';
import type { Attribute as AttributeSetType, AttributeItem as AttributeItemType } from '../types/interfaces';

interface AttributeDisplayProps {
  attributeSet: AttributeSetType;
  selectedItemId?: string;
  onAttributeSelect?: (attributeSetId: string, itemId: string) => void;
  baseTestIdPrefix: string;
  displayContext: 'productPage' | 'cartItem';
}

const AttributeDisplay: React.FC<AttributeDisplayProps> = ({
  attributeSet,
  selectedItemId,
  onAttributeSelect,
  baseTestIdPrefix,
  displayContext,
}) => {
  const kebabAttributeName = attributeSet.name.toLowerCase().replace(/\s+/g, '-');
  const isInteractive = displayContext === 'productPage' && !!onAttributeSelect;

  const attributeNameClasses = displayContext === 'productPage'
    ? "text-[18px] font-[700] text-[#1D1F22] uppercase tracking-wider mb-2"
    : "font-normal text-[#1D1F22] text-[14px] capitalize block mb-1";

  return (
    <div key={attributeSet.id} data-testid={`${baseTestIdPrefix}-attribute-${kebabAttributeName}`}>
      <h3 className={attributeNameClasses}>
        {attributeSet.name}:
      </h3>
      <div className="flex flex-wrap gap-2">
        {attributeSet.items.map((itemOption: AttributeItemType) => {
          const isSelected = selectedItemId === itemOption.id;
          const itemValueKebab = itemOption.displayValue.toLowerCase().replace(/\s+/g, '-');
          const testId = `${baseTestIdPrefix}-attribute-${kebabAttributeName}-${itemValueKebab}${isSelected ? '-selected' : ''}`;

          const commonProps = {
            key: itemOption.id,
            title: itemOption.displayValue,
            'data-testid': testId,
          };
          
          const ariaLabel = `${attributeSet.name}: ${itemOption.displayValue}${isSelected ? ' (selected)' : ''}`;

          if (attributeSet.type.toLowerCase() === 'swatch' || attributeSet.name.toLowerCase() === 'color') {
            const swatchBaseClasses = `block w-full h-full`;
            let containerClasses = displayContext === 'productPage'
              ? `size-[32px] transition-all`
              : `inline-block size-[16px]`;

            if (isSelected) {
              containerClasses += displayContext === 'productPage'
                ? ' ring-1 ring-[green] ring-offset-1'
                : ' ring-2 ring-offset-1 ring-[#5ECE7B] border-green';
            } else if (displayContext === 'productPage') {
              containerClasses += ' hover:border-gray-400';
            } else {
              containerClasses += ' border border-transparent';
            }
            
            if (isInteractive) {
                 containerClasses += ` focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500`;
                 return (
                    <button
                      {...commonProps}
                      type="button"
                      onClick={() => onAttributeSelect(attributeSet.id, itemOption.id)}
                      className={containerClasses}
                      aria-label={ariaLabel}
                      aria-pressed={isSelected}
                    >
                      <span className={swatchBaseClasses} style={{ backgroundColor: itemOption.value }} />
                    </button>
                  );
            } else {
                 // For CartItem, ensure border for swatch itself when not interactive and selected
                 if (isSelected && displayContext === 'cartItem') {
                    // Already handled by containerClasses's `border-green` part
                 } else if (displayContext === 'cartItem' && !isSelected) {
                    // Ensure non-selected swatches in cart also have a subtle border if needed or match original
                    // Original CartItem code had `border-[#5ECE7B]` for swatches generally if not selected, then added more for selected.
                    // The current logic for `containerClasses` for cartItem non-selected is `inline-block size-[16px] border border-transparent`
                    // which might differ if a visible border was always intended.
                    // For consistency with original CartItem:
                     if (!isSelected) containerClasses += ' border-[#A6A6A6]'; // A neutral border for non-selected swatches in cart
                 }


                 return (
                    <span {...commonProps} className={containerClasses} aria-label={ariaLabel}>
                      <span className={swatchBaseClasses} style={{ backgroundColor: itemOption.value }} />
                    </span>
                  );
            }
          } else { // Text-based attributes
            let textItemClasses = `border transition-colors text-[${displayContext === 'productPage' ? '16px' : '14px'}] font-normal`;
             textItemClasses += displayContext === 'productPage'
                ? ' min-w-[40px] h-10 px-3 py-1'
                : ' px-1 py-1'; 

            if (isSelected) {
              textItemClasses += ' bg-[#1D1F22] text-white border-[#1D1F22]';
              if (displayContext === 'cartItem') textItemClasses += ' font-semibold';
            } else {
              textItemClasses += ' bg-white text-[#1D1F22]';
              textItemClasses += displayContext === 'productPage'
                ? ' border-gray-400 hover:border-black'
                : ' border-[#1D1F22]';
            }

            if (isInteractive) {
                textItemClasses += ` focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500`;
                return (
                    <button
                      {...commonProps}
                      type="button"
                      onClick={() => onAttributeSelect(attributeSet.id, itemOption.id)}
                      className={textItemClasses}
                      aria-label={ariaLabel}
                      aria-pressed={isSelected}
                    >
                      {itemOption.value}
                    </button>
                  );
            } else {
                 return (
                    <span {...commonProps} className={textItemClasses} aria-label={ariaLabel}>
                      {itemOption.value}
                    </span>
                  );
            }
          }
        })}
      </div>
    </div>
  );
};

export default AttributeDisplay;