import Head from 'next/head';
import type { NextPageWithLayout } from '@src/pages/_app';
import CART_TEMPLATE from '@public/cart.json';
import { Content } from '@src/components/blocks/content';
import { useIsClient } from 'usehooks-ts';
import { env } from '@src/lib/env';

const CartPage: NextPageWithLayout = () => {
  const isClient = useIsClient();
  if (!isClient) {
    return null; // or a loading spinner, etc.
  }
  const { NEXT_PUBLIC_SHOP_NAME } = env();
  return (
    <>
      <Head>
        <title>Cart {NEXT_PUBLIC_SHOP_NAME ? ` - ${NEXT_PUBLIC_SHOP_NAME}` : ''}</title>
      </Head>
      <Content content={CART_TEMPLATE} />
    </>
  );
};

export default CartPage;
