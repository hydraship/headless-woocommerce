import Image from 'next/image';
import { cn } from '@src/lib/helpers/helper';
import { FaCheckCircle } from 'react-icons/fa';
import { BundleProductItemProps } from './types';
import OutOfStockIndicator from './out-of-stock-indicator';
import BundleQuantitySelector from './bundle-quantity-selector';
import { calculateDiscountedPrice, formatItemPrice } from './utils';

const BundleProductItem = ({
  product,
  currency,
  onToggleSelection,
  onUpdateQuantity,
}: BundleProductItemProps) => {
  const isOutOfStock = product.stockStatus === 'outofstock';

  const handleAddClick = () => {
    if (!isOutOfStock) {
      onToggleSelection(product.id);
    }
  };

  // Calculate discounted price if applicable
  const discountedPrice = calculateDiscountedPrice(
    Number(product.price[currency] || 0),
    product.settings.discountPercent
  );

  const shouldShowDiscount = product.settings.showDiscountedPrice && discountedPrice !== null;

  return (
    <div
      className={cn('group relative', {
        'opacity-75': isOutOfStock,
      })}
    >
      <div
        className={cn(
          'relative bg-muted/10 flex items-center justify-center p-4',
          product.selected && 'border-2 border-primary rounded-md bg-transparent'
        )}
      >
        {product.selected && <FaCheckCircle className="text-primary absolute top-2 right-2" />}
        <Image
          src={product.image}
          alt={product.name}
          width={315}
          height={315}
          className="object-contain h-[315] rounded-full"
        />
      </div>

      <div className="py-4">
        <h3 className="text-base font-bold text-muted truncate mb-2.5">{product.name}</h3>
        <div className="flex flex-col justify-between items-start space-y-2.5">
          {shouldShowDiscount ? (
            <div className="flex gap-1">
              <p className="text-base font-normal text-gray-500 line-through">
                {formatItemPrice(product.price[currency], currency)}
              </p>
              <p className="text-base font-semibold text-primary">
                {formatItemPrice(discountedPrice, currency)}
              </p>
            </div>
          ) : (
            <p className="text-base font-normal text-gray-900">
              {formatItemPrice(product.price[currency], currency)}
            </p>
          )}

          {isOutOfStock ? (
            <OutOfStockIndicator />
          ) : product.selected ? (
            <BundleQuantitySelector
              quantity={product.quantity}
              onIncrement={() => onUpdateQuantity(product.id, product.quantity + 1)}
              onDecrement={() => onUpdateQuantity(product.id, Math.max(0, product.quantity - 1))}
              onChange={(value) => onUpdateQuantity(product.id, value)}
              onRemove={() => onToggleSelection(product.id)}
            />
          ) : (
            <button
              onClick={handleAddClick}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 text-base font-semibold transition-colors duration-200"
              disabled={isOutOfStock}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BundleProductItem;
