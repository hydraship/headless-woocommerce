import { FaFrown } from 'react-icons/fa';

const OutOfStockIndicator = () => {
  return (
    <div className="px-0 py-2 text-base font-normal cursor-not-allowed text-primary flex items-center gap-2">
      <FaFrown /> Out of Stock
    </div>
  );
};

export default OutOfStockIndicator;
