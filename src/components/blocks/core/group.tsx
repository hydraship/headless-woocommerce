import { BlockComponentProps, ParsedBlock } from '@src/components/blocks';
import { Content } from '@src/components/blocks/content';
import { MiniCartContainer } from '@src/components/blocks/woocommerce/mini-cart/mini-cart-container';
import { WishlistContainer } from '@src/components/blocks/wish-list/wishlist-container';
import { NoCartItemsContainer } from '@src/components/blocks/woocommerce/mini-cart/no-cart-items-container';
import { WooCommerceProductTemplateCardSaleBadge } from '@src/components/blocks/woocommerce/product-collection/product-template/badges/sale';
import { WooCommerceProductRatingIconsTemplate } from '@src/components/blocks/woocommerce/product-collection/product-template/product-rating-icons';
import { FreeShippingProgress } from '@src/components/free-shipping-progress';
import { useContentContext } from '@src/context/content-context';
import { getBlockName } from '@src/lib/block';
import { BlockAttributes } from '@src/lib/block/types';
import { cn } from '@src/lib/helpers/helper';
import { NoWishlistContainer } from '@src/components/blocks/wish-list/no-wishlist-container';
import { WishlistSignUp } from '@src/components/blocks/wish-list/wishlist-sign-up';
import { CartItemDecrementButton } from '@src/components/blocks/woocommerce/product-collection/product-template/cart-item-decrement-button';
import { CartItemIncrementButton } from '@src/components/blocks/woocommerce/product-collection/product-template/cart-item-increment-button';
import { CartItemInput } from '@src/components/blocks/woocommerce/product-collection/product-template/cart-item-input';
import { CouponCodeFormContainer } from '@src/components/blocks/woocommerce/mini-cart/coupon/coupon-code-form-container';
import { CouponFormAccordion } from '@src/components/blocks/woocommerce/mini-cart/coupon/coupon-form-accordion';
import { CouponFormAccordionIcons } from '@src/components/blocks/woocommerce/mini-cart/coupon/coupon-form-accordion-icons';
import { CouponForm } from '@src/components/blocks/woocommerce/mini-cart/coupon/coupon-form';
import { CouponFormInput } from '@src/components/blocks/woocommerce/mini-cart/coupon/coupon-form-input';
import { CouponFormApplyButton } from '@src/components/blocks/woocommerce/mini-cart/coupon/coupon-form-applly-button';
import { HasCartItemsContainer } from '@src/components/blocks/woocommerce/mini-cart/has-cart-items-container';
import { CouponFormError } from '@src/components/blocks/woocommerce/mini-cart/coupon/coupon-form-error';
import { CartDiscountContainer } from '@src/components/blocks/woocommerce/mini-cart/cart-discount-container';
import { ProductGrid } from '@src/components/blocks/woocommerce/product-collection/product-grid';
import { AppliedCartDiscountContainer } from '@src/components/blocks/woocommerce/mini-cart/applied-cart-discount-container';
import { ProductCollectionPaginationDots } from '@src/components/blocks/woocommerce/product-collection/pagination-dots';
import { SaveToPinterest } from '@src/components/blocks/woocommerce/product-collection/product-template/badges/save-to-pinterest';
import { TaxonomyLoadMore } from '@src/components/blocks/woocommerce/taxonomy-load-more';
import { CarouselBlock } from '@src/components/blocks/carousel';
import {
  CarouselContentBlock,
  ProductCarouselContent,
} from '@src/components/blocks/carousel/content';
import { CarouselItemBlock } from '@src/components/blocks/carousel/item';
import { VariationThumbnail } from '@src/components/blocks/woocommerce/product-collection/product-template/product-variation-thumbnail';
import { TaxonomyProductFilter } from '@src/components/blocks/woocommerce/taxonomy-product-filter';
import { TaxonomySortingTemplate } from '@src/components/blocks/woocommerce/taxonomy-sorting-template';
import { TaxonomySortValues } from '@src/components/blocks/woocommerce/taxonomy-sort-values';
import { CartItemFreeProductLabel } from '@src/components/blocks/woocommerce/product-collection/product-template/cart-item-free-product-label';
import { CardBestSellerBadge } from '@src/components/blocks/woocommerce/product-collection/product-template/badges/best-seller';
import { CardNewBadge } from '@src/components/blocks/woocommerce/product-collection/product-template/badges/new';
import { FeaturedProductAd } from '@src/components/category/featured-product-ad';
import { CarouselDotsBlock } from '@src/components/blocks/carousel/dots';
import { NotLoggedInContainer } from '@src/components/blocks/account/not-logged-in-container copy';
import { LoggedInContainer } from '@src/components/blocks/account/logged-in-container';
import { WooCommerceProductTemplateCardOutOfStockBadge } from '@src/components/blocks/woocommerce/product-collection/product-template/badges/out-of-stock';
import dynamic from 'next/dynamic';

const ProductVariationColor = dynamic(() =>
  import(
    '@src/components/blocks/woocommerce/product-collection/product-template/product-variation-color'
  ).then((mod) => mod.ProductVariationColor)
);

const ProductDescriptionContent = dynamic(() =>
  import(
    '@src/components/blocks/woocommerce/product-collection/product-template/product-description'
  ).then((mod) => mod.ProductDescriptionContent)
);

const SortByFilter = dynamic(() =>
  import('@src/components/blocks/woocommerce/taxonomy-catalog-sorting').then(
    (mod) => mod.TaxonomyCatalogSortingIcon
  )
);

const CheckboxGate = dynamic(() =>
  import('@src/components/blocks/gravityforms/checkbox-gate').then((mod) => mod.CheckboxGate)
);

const CurrencySwitcher = dynamic(() =>
  import('@src/components/blocks/currency-switcher').then((mod) => mod.CurrencySwitcherBlock)
);

const ClickDropDown = dynamic(() =>
  import('@src/components/blocks/custom/ClickDropDown').then((mod) => mod.ClickDropDown)
);

const placeHolderBlocks = {
  MiniCartContainer,
  WishlistContainer,
  FreeShippingProgress,
  NoCartItemsContainer,
  HasCartItemsContainer,
  NoWishlistContainer,
  NotLoggedInContainer,
  LoggedInContainer,
  CardSaleBadge: WooCommerceProductTemplateCardSaleBadge,
  CardOutOfStockBadge: WooCommerceProductTemplateCardOutOfStockBadge,
  CardBestSellerBadge,
  CardNewBadge,
  SaveToPinterest,
  ProductCardsLoadMore: TaxonomyLoadMore,
  ProductRatingIcons: WooCommerceProductRatingIconsTemplate,
  WishlistSignUp: WishlistSignUp,
  WishlistSignUpButton: WishlistSignUp,
  CartItemDecrementButton: CartItemDecrementButton,
  CartItemIncrementButton: CartItemIncrementButton,
  CartItemInput: CartItemInput,
  CouponCodeFormContainer: CouponCodeFormContainer,
  CouponForm: CouponForm,
  CouponFormAccordion: CouponFormAccordion,
  CouponFormAccordionIcons: CouponFormAccordionIcons,
  CouponFormInput: CouponFormInput,
  CouponFormError: CouponFormError,
  CartDiscountContainer: CartDiscountContainer,
  AppliedCartDiscountContainer: AppliedCartDiscountContainer,
  ProductGrid: ProductGrid,
  VariationColor: ProductVariationColor,
  VariationThumbnail: VariationThumbnail,
  PaginationDots: ProductCollectionPaginationDots,
  Carousel: CarouselBlock,
  CarouselContent: CarouselContentBlock,
  ProductCarouselContent,
  CarouselItem: CarouselItemBlock,
  CarouselDots: CarouselDotsBlock,
  ProductFilters: TaxonomyProductFilter,
  TaxonomySortingTemplate: TaxonomySortingTemplate,
  TaxonomySortValues,
  CartItemFreeProductLabel,
  FeaturedProductAd,
  DescriptionContent: ProductDescriptionContent,
  SortByFilter,
  CheckboxGate,
  ClickDropDownMenu: ClickDropDown,
  CurrencySwitcher,
};

export const getGroupClasses = (block: ParsedBlock) => {
  const attributes = block.attrs as BlockAttributes;
  const groupType = attributes.layout?.type;
  const justifyContent = attributes.layout?.justifyContent;
  const orientation = attributes.layout?.orientation;

  return cn(
    block?.id,
    'core-group',
    {
      flex: groupType == 'flex',
      grid: groupType == 'grid',
      'justify-center': justifyContent == 'center',
      'justify-start': justifyContent == 'left',
      'justify-end': justifyContent == 'right',
      'justify-between': justifyContent == 'space-between',
      'flex-col': orientation == 'vertical',
    },
    attributes.className
  );
};

export const Group = ({ block }: BlockComponentProps) => {
  const { type, data } = useContentContext();

  if ('core/group' !== block.blockName) {
    return null;
  }

  const TagName = block.attrs?.tagName
    ? (block.attrs.tagName as keyof JSX.IntrinsicElements)
    : ('div' as keyof JSX.IntrinsicElements);

  const blockName = getBlockName(block);
  const GroupBlock = placeHolderBlocks[blockName as keyof typeof placeHolderBlocks];
  if (GroupBlock || typeof GroupBlock !== 'undefined') {
    return <GroupBlock block={block as ParsedBlock} />;
  }

  return (
    <TagName className={getGroupClasses(block)}>
      <Content
        type={type}
        content={block.innerBlocks}
        globalData={data}
      />
    </TagName>
  );
};
