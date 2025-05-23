import { BlockComponentProps } from '@src/components/blocks';
import { buttonVariants } from '@src/components/ui/button';
import { BlockAttributes } from '@src/lib/block/types';
import { cn } from '@src/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUrlCartHandler } from '@src/lib/hooks/url-cart-handler';
import { useEffect, useState } from 'react';
import { Product } from '@src/models/product';
import { WoolessTypesense } from '@src/lib/typesense';

export const AddToCartButtonBlock = ({ block }: BlockComponentProps) => {
  const attr = block.attrs as BlockAttributes;
  const router = useRouter();
  const { handleCartOperations, isLoading: isCartLoading } = useUrlCartHandler();
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [isCheckingStock, setIsCheckingStock] = useState(false);

  useEffect(() => {
    const checkStockStatus = async () => {
      if (!attr.product?.value) return;

      setIsCheckingStock(true);
      try {
        // Get product ID from attribute
        const productId = attr.product.value;

        // Query Typesense directly
        const searchParameters = {
          q: '*',
          query_by: 'name',
          filter_by: `productId:=[${productId}]`,
          per_page: 1,
        };

        const response = await WoolessTypesense.product.documents().search(searchParameters);

        if (response.hits && response.hits.length > 0) {
          const productData = response.hits[0].document;
          const product = new Product(productData);

          setIsOutOfStock(product.isOutOfStock);
        } else {
          // If product is not found in Typesense, set it as out of stock
          setIsOutOfStock(true);
        }
      } catch (error) {
        // If there's an error querying Typesense, set product as out of stock
        setIsOutOfStock(true);
      } finally {
        setIsCheckingStock(false);
      }
    };

    checkStockStatus();
  }, [attr.product?.value]);

  const handleClick = async (e: React.MouseEvent) => {
    if (isOutOfStock) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    await handleCartOperations({
      productId: attr.product?.value,
      clearCart: attr.clearCart,
      couponCode: attr.applyCoupon ? attr.coupon : undefined,
    });

    // Redirect to the next URL after processing if it's different from current URL
    if (attr.nextUrl) {
      // Get current URL path without query parameters
      const currentPath = router.asPath.split('?')[0];
      // Get nextUrl without query parameters
      const nextPath = attr.nextUrl.split('?')[0];

      // Only push to new URL if it's different from current path
      if (currentPath !== nextPath) {
        router.push(attr.nextUrl);
      }
    }
  };

  if (!attr.product?.value) {
    return null;
  }

  const link = `${attr.nextUrl || ''}?atc=${attr.product.value}${
    attr.clearCart ? '&clear-cart' : ''
  }${attr.applyCoupon ? `&apply_coupon=${attr.coupon}` : ''}`;

  const isLoading = isCartLoading || isCheckingStock;

  return (
    <Link
      href={isOutOfStock ? '#' : link}
      className={cn(
        buttonVariants(),
        attr.className,
        {
          'opacity-50 pointer-events-none': isLoading,
          'bg-muted cursor-not-allowed out-of-stock hover:bg-muted': isOutOfStock,
          'in-stock bg-primary hover:bg-primary/90': !isOutOfStock,
        },
        attr.product.value
      )}
      onClick={handleClick}
      aria-disabled={isOutOfStock}
    >
      {isLoading ? 'Loading...' : isOutOfStock ? 'Out of Stock' : attr.inStockButtonText}
    </Link>
  );
};
