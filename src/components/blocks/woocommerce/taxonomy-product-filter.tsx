import { ParsedBlock } from '@src/components/blocks';
import { FilterOptionBlocks } from '@components/filter-option-blocks';
import { PriceRangeFilter } from '@src/components/category/filter/price-range';

import { useTaxonomyContext } from '@src/context/taxonomy-context';
import { useSiteContext } from '@src/context/site-context';
import { cn } from '@src/lib/utils';

export const TaxonomyProductFilter = ({ block }: { block: ParsedBlock }) => {
  const taxonomyCtx = useTaxonomyContext();
  const { currentCountry } = useSiteContext();
  return (
    <div className={cn('product-archive-filter', block?.attrs?.className)}>
      <FilterOptionBlocks
        blocks={taxonomyCtx.filterOptionContent}
        baseCountry={currentCountry}
      />

      <PriceRangeFilter
        enableDisclosure={true}
        defaultShow={true}
      />
    </div>
  );
};
