import { Fragment, useState, useEffect } from 'react';
import Image from 'next/image';
import { FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';
import { ProductBundle as TProductBundle } from '@src/models/product/types';
import { formatPrice } from '@src/lib/helpers/helper';
import { useSiteContext } from '@src/context/site-context';
import { useAddToCartContext } from '@src/context/add-to-cart-context';
import { useProductContext } from '@src/context/product-context';

export const ProductSimpleBundle = ({ bundle }: { bundle: TProductBundle }) => {
  const { product, settings } = bundle;
  const { currentCurrency } = useSiteContext();
  const { bundles } = useAddToCartContext();
  const {
    fields: { extra },
  } = useProductContext();
  const [, setExtraFields] = extra;
  const [, setBundles] = bundles;
  const [quantity, setQuantity] = useState<number>(settings?.defaultQuantity);
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    if (checked) {
      setBundles((prev) => {
        const existingBundleIndex = prev.findIndex((item) => item.id === String(product?.bundleId));
        if (existingBundleIndex !== -1) {
          const updatedBundles = [...prev];
          updatedBundles[existingBundleIndex].quantity = quantity;
          return updatedBundles;
        }
        return [
          ...prev,
          {
            id: String(product?.bundleId),
            name: settings?.title,
            price: product?.price ? product?.price[currentCurrency] ?? 0 : 0,
            quantity,
          },
        ];
      });

      setExtraFields((prev) => {
        const optionKey = `bundle_selected_optional_${product?.bundleId}`;
        const quantityKey = `bundle_quantity_${product?.bundleId}`;
        if (checked) {
          return {
            ...prev,
            [optionKey]: '',
            [quantityKey]: quantity,
          };
        } else {
          //remove optionKey and quantityKey from extra fields
          const { [optionKey]: _, [quantityKey]: __, ...rest } = prev;
          return rest;
        }
      });
    } else {
      setBundles((prev) => prev.filter((item) => item.id !== String(product?.bundleId)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, quantity]);

  return (
    <div className="product-simple-bundle flex gap-4">
      {product?.image && (
        <div className="product-simple-bundle__image">
          <Image
            src={product.image}
            alt={settings?.title}
            width={100}
            height={100}
          />
        </div>
      )}
      <div className="product-simple-bundle__content flex-grow">
        <h3 className="product-simple-bundle__title text-lg font-semibold leading-6">
          {settings?.title}
          {product?.status === 'publish' && product.link && product?.link !== '' && (
            <Link
              href={product.link}
              className="hidden"
            >
              <Fragment>
                <FaExternalLinkAlt />
              </Fragment>
            </Link>
          )}
        </h3>

        <div className="product-simple-bundle__price ">
          <label className="cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            {''} add for each {formatPrice(product?.price, currentCurrency)}
          </label>
        </div>
      </div>
      <div className="product-simple-bundle__quantity">
        <input
          type="number"
          className="text-sm p-1"
          defaultValue={settings?.defaultQuantity}
          min={settings?.minQuantity}
          max={settings?.maxQuantity}
          onKeyDown={(e) => {
            if (
              e.key === 'ArrowUp' ||
              e.key === 'ArrowDown' ||
              e.key === 'Backspace' ||
              e.key === 'Delete'
            ) {
              return;
            }
            const value = Number(e.key);
            if (value < settings?.minQuantity || (settings?.maxQuantity !== undefined && value > settings?.maxQuantity)) {
              e.preventDefault();
            }
          }}
          onChange={(e) => setQuantity(Number(e.target.value))}
          onFocus={(e) => e.currentTarget.select()}
        />
      </div>
    </div>
  );
};
