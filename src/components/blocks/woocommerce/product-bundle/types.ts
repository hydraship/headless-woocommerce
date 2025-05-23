import { ProductStockStatuses, ProductPrice } from '@src/models/product/types';

// Extended type for bundle product with UI state
export interface BundleProductWithState {
  id: number;
  bundleId: number;
  name: string;
  image: string;
  price: ProductPrice;
  stockStatus: ProductStockStatuses;
  quantity: number;
  selected: boolean;
  settings: {
    discountPercent?: number;
    showDiscountedPrice: boolean;
    pricedIndividually: boolean;
  };
}

export type BundleProductItemProps = {
  product: BundleProductWithState;
  currency: string;
  onToggleSelection: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
};

export type BundleQuantitySelectorProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange: (quantity: number) => void;
  onRemove: () => void;
};

export type BundleProductSidebarProps = {
  total: number;
  currency: string;
  onAddToBasket: () => void;
  products?: BundleProductWithState[];
};

export type TotalDisplayProps = {
  total: number;
  currency: string;
  selectedCount?: number;
  showCount?: boolean;
};

export type ButtonGroupProps = {
  total: number;
  onAddToBasket: () => void;
  isDesktop?: boolean;
};
