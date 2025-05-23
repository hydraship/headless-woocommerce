import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useTaxonomyContext } from '@src/context/taxonomy-context';
import siteConfig from '@public/config.json';
import { cn } from '@src/lib/utils';

type Props = {
  productCount: number;
  pageNo: number;
  className?: string;
};

export const ResultCount = (props: Props) => {
  const taxonomyCtx = useTaxonomyContext();
  const { asPath } = useRouter();
  const pathIndex = asPath.split('/');
  const { productCount, pageNo } = props;

  const [, , selectedPriceFilter] = taxonomyCtx.priceFilter;
  const [, , selectedBrandsFilter] = taxonomyCtx.brandsFilter;
  const [, , selectedSaleFilter] = taxonomyCtx.saleFilter;
  const [, , selectedNewFilter] = taxonomyCtx.newFilter;
  const [, , selectedCategoryFilter] = taxonomyCtx.categoryFilter;
  const [, , selectedAvailabilityFilter] = taxonomyCtx.availabilityFilter;
  const [, , selectedRefinedSelection] = taxonomyCtx.refinedSelection;

  const [isSortByChanged] = taxonomyCtx.onSortByChanged;

  const isFilterSet =
    !isEmpty(selectedPriceFilter) ||
    !isEmpty(selectedBrandsFilter) ||
    !isEmpty(selectedSaleFilter) ||
    !isEmpty(selectedNewFilter) ||
    !isEmpty(selectedCategoryFilter) ||
    !isEmpty(selectedAvailabilityFilter) ||
    !isEmpty(selectedRefinedSelection);

  let loadedResult = pageNo * +siteConfig.category.productPerPage;
  if (loadedResult > productCount) {
    loadedResult = productCount;
  }

  return (
    <>
      {(pathIndex[1] !== 'brand' || isFilterSet || isSortByChanged) && (
        <>
          <div className={cn('result-count', props.className)}>
            Showing {loadedResult !== 0 && `1 - ${loadedResult} of ${productCount}`}
          </div>
        </>
      )}
    </>
  );
};
