import { formatPrice } from '@src/lib/helpers/helper';
import { TotalDisplayProps } from './types';

const TotalDisplay = ({
  total,
  currency,
  selectedCount = 0,
  showCount = false,
}: TotalDisplayProps) => (
  <div className="text-primary font-semibold lg:flex lg:justify-between lg:w-full">
    <span>Total:</span>
    <span>{formatPrice({ [currency]: total }, currency)}</span>
    {showCount && <span>{` (${selectedCount})`}</span>}
  </div>
);

export default TotalDisplay;
