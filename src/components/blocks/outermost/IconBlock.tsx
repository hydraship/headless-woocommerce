import dynamic from 'next/dynamic';

import { ParsedBlock } from '@src/components/blocks';
import { Hamburger } from '@src/components/blocks/maxmegamenu/hamburger';
import { SearchClose } from '@src/components/blocks/search/close';
import { SearchIcon } from '@src/components/blocks/search/search-icon';
import { NextPage } from '@src/components/blocks/templates/products-widget/next-page';
import { PrevPage } from '@src/components/blocks/templates/products-widget/prev-page';
import { AddToWishlistButton } from '@src/components/blocks/wish-list/add-to-wishlist-button';
import { WishlistCloseButton } from '@src/components/blocks/wish-list/wishlist-close-button';
import { MiniCartCloseButton } from '@src/components/blocks/woocommerce/mini-cart/mini-cart-close-button';
import { RemoveCartItemButton } from '@src/components/blocks/woocommerce/product-collection/product-template/remove-cart-item';
import { getBlockName } from '@src/lib/block';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { parseLink } from '@src/lib/helpers/helper';
import Link from 'next/link';
import { BlockAttributes } from '@src/lib/block/types';
import { CarouselPreviousButtonBlock } from '@src/components/blocks/carousel/previous';
import { CarouselNextButtonBlock } from '@src/components/blocks/carousel/next';
import { TaxonomySortByClose } from '@src/components/blocks/woocommerce/taxonomy-sort-by-close';
import { ProductCollectionNextPage } from '@src/components/blocks/woocommerce/product-collection/next-page';
import { ProductCollectionPrevPage } from '@src/components/blocks/woocommerce/product-collection/prev-page';
import { MaxMegaMenuCloseButton } from '@src/components/blocks/maxmegamenu/mega-menu-close-button';
import { ClearSearchIcon } from '@src/components/blocks/search/clear-search-icon';

type IconBlockProps = {
  block: ParsedBlock;
};

export const getSvgContent = (html: string) => {
  return html.match(/<svg[\s\S]*<\/svg>/)?.[0] || '';
};

const placeHolderBlocks = {
  ProductsWidgetNextPage: NextPage,
  ProductsWidgetPrevPage: PrevPage,
  ProductCollectionNextPage,
  ProductCollectionPrevPage,
  MenuHamburger: Hamburger,
  CloseMiniCartButton: MiniCartCloseButton,
  WishlistCloseButton: WishlistCloseButton,
  AddToWishlistButton: AddToWishlistButton,
  RemoveCartItem: RemoveCartItemButton,
  SearchIcon: SearchIcon,
  ClearSearchIcon,
  SearchClose: dynamic(() =>
    import('@src/components/blocks/search/close').then((mod) => mod.SearchClose)
  ),
  CarouselPreviousButton: CarouselPreviousButtonBlock,
  CarouselNextButton: CarouselNextButtonBlock,
  TaxonomySortByClose,
  MaxMegaMenuCloseButton,
};

export const IconBlock = ({ block }: IconBlockProps) => {
  if ('outermost/icon-block' !== block.blockName && !block.innerBlocks[0]) {
    return null;
  }

  const blockName = getBlockName(block);

  const PlaceHolderBlock = placeHolderBlocks[blockName as keyof typeof placeHolderBlocks];
  if (PlaceHolderBlock || typeof PlaceHolderBlock !== 'undefined') {
    return <PlaceHolderBlock block={block} />;
  }

  const link = parseLink(block.innerHTML);
  const svgContent = getSvgContent(block.innerHTML);
  const attributes = block.attrs as BlockAttributes;

  return link ? (
    <Link
      href={link}
      className={attributes.className}
      aria-label={attributes.label}
    >
      <ReactHTMLParser html={svgContent} />
    </Link>
  ) : (
    <ReactHTMLParser html={svgContent} />
  );
};
