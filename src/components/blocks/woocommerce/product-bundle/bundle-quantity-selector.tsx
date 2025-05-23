import React from 'react';
import { FaSmile } from 'react-icons/fa';
import { BundleQuantitySelectorProps } from './types';

const BundleQuantitySelector = ({
  quantity,
  onIncrement,
  onDecrement,
  onChange,
  onRemove,
}: BundleQuantitySelectorProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      onChange(newQuantity);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2.5">
      <div className="flex justify-between items-center w-full">
        <p className="text-green-800 flex gap-2 justify-start items-center">
          <FaSmile /> In Stock
        </p>
      </div>
      <div className="flex border border-primary">
        <button
          className="px-2 py-1 pr-0 border-0 text-primary"
          onClick={onDecrement}
        >
          -
        </button>
        <input
          type="text"
          value={quantity}
          onChange={handleInputChange}
          className="w-[34px] text-center border-0"
        />
        <button
          className="px-2 py-1 pl-0 border-0 text-primary"
          onClick={onIncrement}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default BundleQuantitySelector;
