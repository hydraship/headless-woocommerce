import { formatPrice as formatPriceHelper } from '@src/lib/helpers/helper';

/**
 * Format price for display
 */
export const formatItemPrice = (price: string | number, currency: string) => {
  return formatPriceHelper({ [currency]: Number(price) }, currency);
};

/**
 * Calculate discounted price based on original price and discount percentage
 */
export const calculateDiscountedPrice = (
  originalPrice: number,
  discountPercent?: number
): number | null => {
  if (!discountPercent) return null;

  const discountMultiplier = (100 - discountPercent) / 100;
  return originalPrice * discountMultiplier;
};

/**
 * Format bundle items for GraphQL request
 * This function formats the selected bundle items to be properly included in the GraphQL request
 * Returns a JSON string in the format: {"1235":{"quantity":1}, "1236":{"quantity":2}}
 */
export const formatBundleItemsForGraphQL = (
  selectedBundleItems: Record<string, { id: number; quantity: number; price: number }>
): string => {
  const formattedItems: Record<string, { quantity: number }> = {};

  // Format each bundle item for the GraphQL request
  Object.entries(selectedBundleItems).forEach(([_bundleId, item]) => {
    // Use the product ID as the key
    formattedItems[item.id.toString()] = {
      quantity: item.quantity,
    };
  });

  return JSON.stringify(formattedItems);
};
