import {
  useMutation,
  MutationHookOptions,
  OperationVariables,
  DefaultContext,
  ApolloCache,
} from '@apollo/client';
import { ADD_BUNDLE_TO_CART } from '@src/lib/graphql/queries';
import { track } from '@src/lib/track';
import { CartItemSchema } from '@src/lib/actions/add-to-cart/schema';

/**
 * Hook for adding bundle products to cart
 */
export const useAddBundleToCartMutation = (
  options:
    | MutationHookOptions<any, OperationVariables, DefaultContext, ApolloCache<any>>
    | undefined
) => {
  const { onCompleted, ...restOptions } = options || {};

  return useMutation(ADD_BUNDLE_TO_CART, {
    ...restOptions,
    onCompleted: (data) => {
      if (data.addBundleToCart?.cart?.contents?.nodes) {
        // Track the added items
        const cartItems = data.addBundleToCart.cart.contents.nodes;
        cartItems.forEach((item: any) => {
          const cartItem = CartItemSchema.safeParse(item);
          if (cartItem.success) {
            track.addToCart(cartItem.data);
          }
        });

        if (onCompleted) {
          onCompleted(data);
        }
      }
    },
    onError: (error) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.log(error?.graphQLErrors?.[0]?.message ?? '');
      }
    },
  });
};
