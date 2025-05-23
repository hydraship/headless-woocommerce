import { cn } from '@src/lib/utils';

type SkeletonProps = React.FC<React.HTMLAttributes<HTMLDivElement>>;

const CartItemSkeletonDecrementButton: SkeletonProps = ({ className }) => {
  return (
    <div
      className={cn('flex items-center justify-center text-xl w-9 h-10 bg-gray-300', className)}
    ></div>
  );
};

const CartItemSkeletonIncrementButton: SkeletonProps = ({ className }) => {
  return (
    <div
      className={cn('flex items-center justify-center text-xl w-9 h-10 bg-gray-300', className)}
    ></div>
  );
};

const CartItemSkeletonInput: SkeletonProps = ({ className }) => {
  return (
    <div
      className={cn('flex items-center justify-center text-xl w-9 h-10 bg-gray-300', className)}
    ></div>
  );
};

const CartItemSkeletonImage: SkeletonProps = ({ className }) => {
  return (
    <div
      className={cn(
        ' min-h-[100px] flex-shrink-0 overflow-hidden bg-gray-300 h-[112px] w-[120px]',
        className
      )}
    ></div>
  );
};

const CartItemSkeletonPrice: SkeletonProps = ({ className }) => {
  return <div className={cn('w-28 h-4 bg-gray-300', className)}></div>;
};

const CartItemSkeletonName: SkeletonProps = ({ className }) => {
  return <div className={cn('w-full h-8 bg-gray-300', className)}></div>;
};

const CartItemSkeletonRemoveItem: SkeletonProps = ({ className }) => {
  return <div className={cn(' w-8 h-8 bg-gray-300', className)}></div>;
};

const CartItemSkeleton = () => {
  return (
    <div className="flex w-full items-start py-[22px] gap-4">
      <CartItemSkeletonImage />
      <div className="flex flex-col flex-1 gap-3">
        <CartItemSkeletonName />
        <CartItemSkeletonPrice />
        <div className="flex border rounded-md self-start">
          <CartItemSkeletonDecrementButton />
          <CartItemSkeletonInput />
          <CartItemSkeletonIncrementButton />
        </div>
      </div>
      <CartItemSkeletonRemoveItem />
    </div>
  );
};

export {
  CartItemSkeleton,
  CartItemSkeletonDecrementButton,
  CartItemSkeletonIncrementButton,
  CartItemSkeletonInput,
  CartItemSkeletonImage,
  CartItemSkeletonPrice,
  CartItemSkeletonName,
  CartItemSkeletonRemoveItem,
};
