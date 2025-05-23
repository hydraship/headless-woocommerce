import Link from 'next/link';
import { cn } from '@src/lib/helpers/helper';
import MessageDisplay from './message-display';
import { ButtonGroupProps } from './types';
import { useProductContext } from '@src/context/product-context';

const ButtonGroup = ({ total, onAddToBasket, isDesktop = true }: ButtonGroupProps) => {
  // Get loading state from product context
  const {
    state: {
      addToCart: { loading },
    },
  } = useProductContext();

  return (
    <>
      {total > 0 ? (
        <button
          onClick={onAddToBasket}
          className={cn(
            'w-full font-semibold transition-colors duration-200',
            'bg-primary hover:bg-primary/90 text-white',
            isDesktop ? 'py-2' : 'py-3'
          )}
          disabled={total === 0 || loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Adding to cart...
            </div>
          ) : (
            'Add to basket'
          )}
        </button>
      ) : (
        <>
          <MessageDisplay />
          <Link
            href={process.env.NEXT_PUBLIC_CHECKOUT_URL || '/checkout'}
            className="w-full inline-block text-center border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2 transition-colors duration-200"
          >
            Skip
          </Link>
        </>
      )}
    </>
  );
};

export default ButtonGroup;
