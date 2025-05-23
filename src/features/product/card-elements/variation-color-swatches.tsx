import { useEffect, useState, Dispatch, SetStateAction, useMemo } from 'react';
import { Product } from '@src/models/product';
import { cn } from '@src/lib/helpers/helper';

// Define ColorVariant interface for better type safety
interface ColorVariant {
  readonly name: string;
  readonly color: string;
}

// Define props for VariationColorSwatches component
interface VariationColorSwatchesProps {
  readonly product: Product;
  readonly detailsAlignment?: 'left' | 'right' | 'center';
  readonly setShowColorVariant: Dispatch<SetStateAction<string>>;
  readonly maxVisibleColors?: number;
  readonly thresholdForExpansion?: number;
}

// Main component for displaying color swatches
export const VariationColorSwatches: React.FC<VariationColorSwatchesProps> = ({
  product,
  detailsAlignment = 'left',
  setShowColorVariant,
  maxVisibleColors = 3,
  thresholdForExpansion = 4,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Memoize colors derived from product variableColors
  const colors = useMemo<ColorVariant[]>(() => {
    if (product?.variableColors && typeof product.variableColors === 'object') {
      return Object.entries(product.variableColors).map(([name, color]) => ({ name, color }));
    }
    return [];
  }, [product?.variableColors]);

  // Effect to determine if the color swatches should be expanded
  useEffect(() => {
    setIsExpanded(colors.length > thresholdForExpansion);
  }, [colors, thresholdForExpansion]);

  // Return null if no colors are available
  if (colors.length < 1) return null;

  // Determine which colors to display based on expansion state
  const visibleColors = isExpanded ? colors.slice(0, maxVisibleColors) : colors;

  // Handle color selection
  const handleColorSelect = (colorName: string) => {
    setShowColorVariant(colorName);
  };

  return (
    <div
      className={cn('product-variants', `justify-${detailsAlignment}`, {
        'display-more': isExpanded,
        'hide-more': !isExpanded,
      })}
    >
      {visibleColors.map((color, index) => (
        <ColorSwatch
          key={`color-variant-${color.name}-${index}`}
          color={color}
          onSelect={handleColorSelect}
        />
      ))}
      {colors.length > maxVisibleColors && isExpanded && (
        <button
          type="button"
          className="product-colors-more"
          onClick={() => setIsExpanded(false)}
          aria-label={`Show ${colors.length - maxVisibleColors} more colors`}
        >
          +{colors.length - maxVisibleColors}
        </button>
      )}
    </div>
  );
};

// Define props for ColorSwatch component
interface ColorSwatchProps {
  readonly color: ColorVariant;
  readonly onSelect: (colorName: string) => void;
}

// Component for individual color swatch
const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, onSelect }) => (
  <label
    htmlFor={`swatch-${color.name}`}
    className="color-swatch-label"
  >
    <input
      className="peer hidden"
      type="radio"
      name="color-variant"
      id={`swatch-${color.name}`}
      value={color.name}
      onChange={() => onSelect(color.name)}
    />
    <div className="h-8 p-1 rounded-full border border-[#ebeced] cursor-pointer inline-flex justify-start items-center gap-2.5 peer-checked:outline peer-checked:outline-2 peer-checked:outline-foreground peer-checked:outline-offset-[-2px]">
      <div className="w-6 h-6 flex justify-start items-start gap-2">
        <div
          className={cn('h-6 w-6 relative rounded-full', {
            'border-[#f5f5f5] border': color.name === 'white',
          })}
          style={{ backgroundColor: color.color }}
        />
      </div>
    </div>
  </label>
);
