import React from 'react';
import { ParsedBlock } from '@src/components/blocks';
import { cn } from '@src/lib/utils';
import { useContentContext } from '@src/context/content-context';
import { SortByOptions } from '@src/components/category/filter/sort-by-options';
import { useTaxonomyContext } from '@src/context/taxonomy-context';
import TSTaxonomy from '@src/lib/typesense/taxonomy';
import { useSiteContext } from '@src/context/site-context';
import { ITSTaxonomyProductQueryVars } from '@src/lib/typesense/types';

export const TaxonomySortValues = ({ block }: { block: ParsedBlock }) => {
  const { data } = useContentContext();
  const taxonomyCtx = useTaxonomyContext();
  const { currentCurrency } = useSiteContext();

  const [, setTsQueryVars] = data.queryState;

  const onSortChange = (e: { target: { value: string } }) => {
    setTsQueryVars((prevProps: ITSTaxonomyProductQueryVars) => {
      const newProps: ITSTaxonomyProductQueryVars = {
        ...prevProps,
        appendProducts: false,
        sortBy: e.target.value,
      };
      return newProps;
    });
  };

  return (
    <div className={cn('taxonomy-sort-values', block?.attrs?.className)}>
      <SortByOptions
        state={taxonomyCtx.sortByState}
        options={TSTaxonomy.sortOptions(currentCurrency)}
        onSortChange={onSortChange}
      />
    </div>
  );
};
