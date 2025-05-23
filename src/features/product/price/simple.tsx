import { ReactElement, Fragment } from 'react';
import { cn } from '@src/lib/helpers/helper';
import { useSiteContext } from '@src/context/site-context';
import { formatPrice } from '@src/lib/helpers/helper';
import { Product } from '@src/models/product';

type TSimplePrice = {
  product: Product;
  isTaxExclusive: boolean;
};

export const SimplePrice = ({ product, isTaxExclusive }: TSimplePrice) => {
  const { currentCurrency: currency, location } = useSiteContext();
  const [locationData] = location;
  const { regularPrice, salePrice } = product;
  const isOnSale = product.onSale && (product.salePrice?.[currency] as number) > 0;

  const renderedResult: ReactElement[] = [];

  if (isOnSale && salePrice) {
    renderedResult.push(<span className="sale-price">{formatPrice(regularPrice, currency)}</span>);
  }

  renderedResult.push(
    <span className="price">{formatPrice(product.getTaxedPrice(locationData), currency)}</span>
  );

  return (
    <span className={cn('simple-product-price', { 'on-sale': isOnSale })}>
      {renderedResult.map((price, i) => {
        return <Fragment key={`simple-product-price-${i}`}>{price}</Fragment>;
      })}
    </span>
  );
};
