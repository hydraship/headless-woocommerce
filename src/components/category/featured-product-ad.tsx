import { ParsedBlock } from '@src/components/blocks';
import { RealWooCommerceProductCollectionQueryResponse } from '@src/components/blocks/woocommerce/product-collection/real-product-collection';
import { useContentContext } from '@src/context/content-context';
import { BlockAttributes } from '@src/lib/block/types';
import { useFetchPosts } from '@src/lib/hooks/page';
import { cn } from '@src/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface AcfData {
  link: string;
  main_image: string;
}

interface MetaData {
  acf: AcfData;
}

const isAcfData = (acf: unknown): acf is AcfData =>
  typeof acf === 'object' &&
  acf !== null &&
  typeof (acf as Record<string, unknown>).link === 'string' &&
  typeof (acf as Record<string, unknown>).main_image === 'string';

const isFeaturedProductAdMetaData = (obj: unknown): obj is MetaData =>
  typeof obj === 'object' &&
  obj !== null &&
  'acf' in obj &&
  isAcfData((obj as Record<string, unknown>).acf);

export const FeaturedProductAd = ({ block }: { block: ParsedBlock }) => {
  const attribute = block.attrs as BlockAttributes;
  const { data } = useContentContext();

  const queryResponse = data as RealWooCommerceProductCollectionQueryResponse;
  const {
    queryState: [queryVars],
  } = queryResponse;

  const { data: post, loading } = useFetchPosts({
    postType: 'feature_product_slid',
    termSlug: queryVars.termSlug,
    taxonomySlug: 'product_cat',
  });

  if (!queryVars.termSlug || loading) {
    return null;
  }

  if (post.length <= 0) {
    return null;
  }

  const foundAd = post[0];
  if (!isFeaturedProductAdMetaData(foundAd.metaData)) {
    return null;
  }

  if (!foundAd.metaData.acf.link && !foundAd.metaData.acf.main_image) {
    return null;
  }

  return (
    <div className={cn('featured-product-ad relative space-y-6 group', attribute.className)}>
      <Image
        src={foundAd.metaData.acf.main_image}
        alt={foundAd.name}
        fill
        className="!static"
      />
      <Link
        href={foundAd.metaData.acf.link}
        className="absolute inset-0 z-10 bg-transparent !m-0"
      />
      <button className="text-center w-full border border-black py-2 rounded-sm uppercase group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
        Check Product
      </button>
    </div>
  );
};
