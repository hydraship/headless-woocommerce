import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@src/lib/helpers/helper';
import { TAddOnItem, TBundleItem } from '@src/types/addToCart';
import { BlockComponentProps } from '@src/components/blocks';
import { AddToCartContextProvider } from '@src/context/add-to-cart-context';
import { useProductContext } from '@src/context/product-context';
import { useSiteContext } from '@src/context/site-context';
import { Variant } from '@src/features/product/variant';
import { CompositeComponents } from '@src/features/product/composite';
import { GiftCardForm } from '@src/features/product/gift-card/gift-card-form';
import { shouldCheckLocation } from '@src/lib/helpers/product';

const AddToCartBundle = dynamic(() =>
  import('@src/features/product/add-to-cart/bundle').then((mod) => mod.AddToCartBundle)
);

const AddToCartAddons = dynamic(() =>
  import('@src/features/product/add-to-cart/addons').then((mod) => mod.AddToCartAddons)
);

const ProductNotifyMe = dynamic(() =>
  import('@src/features/product/product-notify-me').then((mod) => mod.ProductNotifyMe)
);

const AddToCartFormComponent = dynamic(() =>
  import('@src/features/product/add-to-cart-form').then((mod) => mod.AddToCartForm)
);

const AddToCartSubscriptionATT = dynamic(() =>
  import('@src/features/product/add-to-cart/subscriptions-att').then(
    (mod) => mod.AddToCartSubscriptionATT
  )
);

export const AddToCartForm = ({ block }: BlockComponentProps) => {
  const { className } = block.attrs;
  const { product } = useProductContext();
  const { location } = useSiteContext();
  const [locationData] = location;
  const [items, setItems] = useState<TAddOnItem[]>([]);
  const [bundles, setBundles] = useState<TBundleItem[]>([]);
  const [locationError, setLocationError] = useState<boolean>(shouldCheckLocation(product));

  useEffect(() => {
    if (!shouldCheckLocation(product)) return;

    if (!product?.metaData?.acf?.geo_restriction) return;

    const restrictionType = product?.metaData?.acf?.geo_restriction;

    if (['us-only', 'us-exclude-texas'].includes(restrictionType)) {
      if (locationData?.countryCode.toUpperCase() !== 'US') {
        setLocationError(true);
      } else if (
        restrictionType === 'us-exclude-texas' &&
        locationData?.subDivision.toUpperCase() === 'TEXAS'
      ) {
        setLocationError(true);
      } else {
        setLocationError(false);
      }
    } else {
      setLocationError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationData]);

  if (!product) return null;

  if (locationError) {
    return (
      <div className="text-red-500 p-3 bg-secondary/5 text-primary/50">
        This product is not eligible for purchase in your region.
      </div>
    );
  }

  return (
    <AddToCartContextProvider
      addons={[items, setItems]}
      bundles={[bundles, setBundles]}
    >
      <div className={cn('add-to-cart-form', block?.id, className, product.classes)}>
        {!product.isOutOfStock && (
          <>
            {product.hasVariations && <Variant />}
            {product.hasBundle && <AddToCartBundle />}
            {product.hasAddons() && <AddToCartAddons />}
            {product.isComposite && <CompositeComponents />}
            {product.isGiftCard && <GiftCardForm />}
            {product.hasSubscriptionsATT() && <AddToCartSubscriptionATT />}
            <AddToCartFormComponent />
          </>
        )}
        {product.isOutOfStock && <ProductNotifyMe />}
      </div>
    </AddToCartContextProvider>
  );
};
