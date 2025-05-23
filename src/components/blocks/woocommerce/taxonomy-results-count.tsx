import { ResultCount } from '@src/components/category/filter/result-count';
import { useContentContext } from '@src/context/content-context';
import { ParsedBlock } from '@src/components/blocks';

export const TaxonomyResultsCount = ({ block }: { block: ParsedBlock }) => {
  const { data } = useContentContext();

  return (
    <ResultCount
      pageNo={data?.data?.pageInfo?.page}
      className={block.attrs.className}
      productCount={data?.data?.pageInfo?.totalFound}
    />
  );
};
