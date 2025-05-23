import { useHits } from 'react-instantsearch-hooks-web';

import { PrefetchLink } from '@src/components/common/prefetch-link';
import { cn } from '@src/lib/helpers/helper';

export const SearchResultsCount = ({ searchResultsLink }: { searchResultsLink: string }) => {
  const { results } = useHits();

  return (
    <PrefetchLink
      unstyled
      href={searchResultsLink}
      className="product-search-result-count"
    >
      <span
        className={cn(
          'flex flex-row items-center gap-2.5 text-center text-foreground text-base font-bold underline leading-normal'
        )}
      >
        See All Products ({results?.nbHits})
      </span>
    </PrefetchLink>
  );
};
