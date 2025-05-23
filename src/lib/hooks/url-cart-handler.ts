import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { v4 } from 'uuid';
import { useMutation } from '@apollo/client';
import { useSiteContext } from '@src/context/site-context';
import { APPLY_COUPON, REMOVE_CART_ITEM } from '@src/lib/graphql/queries';
import { useAddToCartMutation } from '@src/lib/actions/add-to-cart';

interface CartOperationParams {
  productId?: number | string;
  clearCart?: boolean;
  couponCode?: string;
}

/**
 * Custom hook to handle cart operations, either from URL parameters or direct calls
 * @param params Optional parameters for direct cart operations
 * @returns Object containing cart operation functions and loading state
 */
export const useUrlCartHandler = (params?: CartOperationParams) => {
  const router = useRouter();
  const {
    fetchCart,
    cart,
    miniCartState: [, setMiniCartOpen],
  } = useSiteContext();
  const [processed, setProcessed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mutation to apply coupon
  const [applyCoupon] = useMutation(APPLY_COUPON, {
    onCompleted: () => {
      fetchCart();
    },
  });

  // Mutation to remove all items from cart
  const [removeItemsFromCart] = useMutation(REMOVE_CART_ITEM, {
    onCompleted: () => {
      fetchCart();
    },
  });

  // Add to cart mutation
  const [addToCart] = useAddToCartMutation({
    variables: {
      input: {
        clientMutationId: v4(),
        productId: 0,
        quantity: 1,
      },
    },
    onCompleted: () => {
      fetchCart();
      setMiniCartOpen(true);
    },
  });

  const handleCartOperations = useCallback(
    async (options: CartOperationParams) => {
      setIsLoading(true);
      try {
        // Clear cart if requested
        if (options.clearCart && cart?.products?.length > 0) {
          const cartKeys = cart.products.map((item) => item.cartKey);
          if (cartKeys.length > 0) {
            await removeItemsFromCart({
              variables: {
                cartKey: cartKeys,
              },
            });
          }
        }

        // Add product to cart if provided
        if (options.productId) {
          const productId = parseInt(options.productId.toString(), 10);
          if (!isNaN(productId)) {
            await addToCart({
              variables: {
                input: {
                  clientMutationId: v4(),
                  productId,
                  quantity: 1,
                },
              },
            });
          }
        }

        // Apply coupon if provided
        if (options.couponCode) {
          await applyCoupon({
            variables: {
              input: {
                clientMutationId: v4(),
                code: options.couponCode,
              },
            },
          });
        }
      } catch (error) {
        // Silently handle error
      } finally {
        setIsLoading(false);
      }
    },
    [cart, addToCart, removeItemsFromCart, applyCoupon]
  );

  const processUrlParams = useCallback(async () => {
    if (processed || !router.isReady) {
      return;
    }

    const { atc, clearcart, apply_coupon } = router.query;
    const productId = Array.isArray(atc) ? atc[0] : atc;
    const couponCode = Array.isArray(apply_coupon) ? apply_coupon[0] : apply_coupon;

    if (!productId && !couponCode) {
      setProcessed(true);
      return;
    }

    await handleCartOperations({
      productId,
      clearCart: clearcart !== undefined,
      couponCode,
    });

    setProcessed(true);

    // Clean up URL parameters
    const newQuery = { ...router.query };
    delete newQuery.atc;
    delete newQuery.clearcart;
    delete newQuery.apply_coupon;
    router.replace(window.location.pathname, undefined, { shallow: true });
  }, [processed, router, handleCartOperations]);

  // Process URL parameters on mount
  useEffect(() => {
    if (params) {
      handleCartOperations(params);
    } else {
      processUrlParams();
    }
  }, [processUrlParams, params, handleCartOperations]);

  return {
    handleCartOperations,
    applyCoupon,
    removeItemsFromCart,
    addToCart,
    processUrlParams,
    isLoading,
  };
};
