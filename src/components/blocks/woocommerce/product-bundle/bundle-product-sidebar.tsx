import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { BundleProductSidebarProps } from './types';
import TotalDisplay from './total-display';
import ButtonGroup from './button-group';

const BundleProductSidebar = ({
  total,
  currency,
  onAddToBasket,
  products = [],
}: BundleProductSidebarProps) => {
  const [showContents, setShowContents] = useState(false);

  const selectedProducts = products.filter((p) => p.selected && p.quantity > 0);
  const selectedCount = selectedProducts.length;

  const toggleContents = () => {
    setShowContents(!showContents);
  };

  return (
    <>
      {/* Desktop sidebar - visible on lg screens and above */}
      <div className="hidden lg:block w-full lg:w-[367px] h-fit">
        <div className="flex justify-between items-center py-4">
          <TotalDisplay
            total={total}
            currency={currency}
          />
        </div>

        <ButtonGroup
          total={total}
          onAddToBasket={onAddToBasket}
          isDesktop={true}
        />
      </div>

      {/* Mobile sidebar - visible on screens smaller than lg */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-b border-gray-200 z-50">
        {/* Selected products list */}
        {showContents && (
          <div className="p-4 max-h-[40vh] overflow-y-auto border-b border-gray-200">
            {selectedProducts.length > 0 ? (
              <ul className="space-y-2">
                {selectedProducts.map((product) => (
                  <li
                    key={product.id}
                    className="text-sm text-muted"
                  >
                    {product.quantity} x {product.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No items selected yet.</p>
            )}
          </div>
        )}

        {/* Toggle button and total */}
        <div className="flex justify-between items-center p-4">
          <TotalDisplay
            total={total}
            currency={currency}
            selectedCount={selectedCount}
            showCount={true}
          />
          <button
            onClick={toggleContents}
            className="flex items-center gap-2 text-muted text-base font-normal"
          >
            {showContents ? (
              <>
                <span>Close contents</span>
                <ChevronDownIcon className="h-5 w-5" />
              </>
            ) : (
              <>
                <span>View Contents</span>
                <ChevronUpIcon className="h-5 w-5" />
              </>
            )}
          </button>
        </div>

        {/* Add to basket button */}
        <div className="p-4 pt-0">
          <ButtonGroup
            total={total}
            onAddToBasket={onAddToBasket}
            isDesktop={false}
          />
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind the fixed sidebar - only on mobile */}
      <div className="w-full h-[150px] lg:hidden"></div>
    </>
  );
};

export default BundleProductSidebar;
