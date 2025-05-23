import { ParsedBlock } from '@src/components/blocks';
import { SortByButton, SortByButtonIcon } from '@src/components/category/filter/sort-by-button';

import { useTaxonomyContext } from '@src/context/taxonomy-context';
import { uniqueId } from 'lodash';

export const TaxonomyCatalogSorting = ({ block }: { block: ParsedBlock }) => {
  const taxonomyCtx = useTaxonomyContext();
  const [, setSortByOpen] = taxonomyCtx.slideOverSort;
  const [selectedSortOption] = taxonomyCtx.sortByState;

  return (
    <div className={block.attrs.className}>
      <SortByButton
        setSortByOpen={setSortByOpen}
        selectedSortOption={selectedSortOption}
      />
    </div>
  );
};

export const TaxonomyCatalogSortingIcon = ({ block }: { block: ParsedBlock }) => {
  const taxonomyCtx = useTaxonomyContext();
  const [, setSortByOpen] = taxonomyCtx.slideOverSort;
  const [selectedSortOption] = taxonomyCtx.sortByState;

  return (
    <div className={block.attrs.className}>
      {block.innerBlocks.map((blocks) => {
        if (blocks.blockName === 'outermost/icon-block') {
          return (
            <SortByButtonIcon
              key={uniqueId()}
              setSortByOpen={setSortByOpen}
              selectedSortOption={selectedSortOption}
              block={blocks}
            />
          );
        }
      })}
    </div>
  );
};
