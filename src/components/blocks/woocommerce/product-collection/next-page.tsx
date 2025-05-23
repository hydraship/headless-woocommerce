import { ParsedBlock } from '@src/components/blocks';
import { getSvgContent } from '@src/components/blocks/outermost/IconBlock';
import { RealWooCommerceProductCollectionQueryResponse } from '@src/components/blocks/woocommerce/product-collection/real-product-collection';
import { Spinner } from '@src/components/svg/spinner';
import { useContentContext } from '@src/context/content-context';
import { getBlockName } from '@src/lib/block';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { BlockAttributes } from '@src/lib/block/types';
import { ITSTaxonomyProductQueryVars } from '@src/lib/typesense/types';
import { cn } from '@src/lib/utils';
import { useEffect, useState } from 'react';

export const ProductCollectionNextPage = ({ block }: { block: ParsedBlock }) => {
  const { type, data } = useContentContext();
  const blockName = getBlockName(block);
  const attribute = block.attrs as BlockAttributes;

  if (
    'ProductCollectionNextPage' !== blockName ||
    typeof data === 'undefined' ||
    'products-query-response' !== type
  ) {
    return null;
  }

  const queryResponse = data as RealWooCommerceProductCollectionQueryResponse;
  const {
    loading,
    queryState: [, setQueryVars],
  } = queryResponse;

  const hasNextpage = data?.pageInfo.hasNextPage;
  const nextPage = data?.pageInfo.nextPage;

  const svgContent = getSvgContent(block.innerHTML);

  const handleNextPage = () => {
    if (!hasNextpage) {
      return;
    }
    setQueryVars((prev: ITSTaxonomyProductQueryVars) => {
      return {
        ...prev,
        page: nextPage,
      };
    });
  };

  return (
    <button
      className={cn(attribute.className, 'next-page')}
      onClick={handleNextPage}
      disabled={!loading && !hasNextpage}
    >
      {loading ? <Spinner className="w-4 m-0" /> : <ReactHTMLParser html={svgContent} />}
    </button>
  );
};
