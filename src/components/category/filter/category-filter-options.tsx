import { decode } from 'html-entities';
import { findIndex, isEmpty, remove, some } from 'lodash';
import uniqueId from 'lodash/uniqueId';
import { useState } from 'react';

import { useTaxonomyContext } from '@src/context/taxonomy-context';
import { IFilterOptionData, IFilterOptionState } from '@src/lib/types/taxonomy';
import { cn } from '@src/lib/utils';
import { useContentContext } from '@src/context/content-context';

type Props = {
  name?: string;
  option?: IFilterOptionData;
  disclosureProp: IFilterOptionState;
  title: string;
};

export const CategoryFilterOptions = (props: Props) => {
  const taxonomyCtx = useTaxonomyContext();
  const { data } = useContentContext();
  const { name, option, disclosureProp, title } = props;
  const [, , filterValue, setFilterValue] = disclosureProp;
  const [checked, setChecked] = useState(false);
  const [, setPreviousSelectedFilterState] = taxonomyCtx.previouslySelectedFilter;

  if (isEmpty(option)) {
    return null;
  }

  const uId = uniqueId();
  const label = option.label;

  const filterValueIndex = findIndex(filterValue as IFilterOptionData[], { value: option.value });

  const isSameOptionValue = some(filterValue as IFilterOptionData[], { value: option.value });

  const onChange = (e: { target: { checked: boolean } }) => {
    setPreviousSelectedFilterState(title);

    if (e.target.checked) {
      if (!isEmpty(filterValue)) {
        setFilterValue([
          ...(filterValue as IFilterOptionData[]),
          {
            label: label,
            value: option.value,
          },
        ]);
      } else {
        setFilterValue([
          {
            label: label,
            value: option.value,
          },
        ]);
      }

      setChecked(true);
    } else {
      const removedItem = remove(filterValue as IFilterOptionData[], (filterOption) => {
        return option.value !== filterOption.value;
      });

      setFilterValue(removedItem as IFilterOptionData[]);

      setChecked(false);
    }
  };

  const renderCount = () => {
    const currentTotalFound = data?.data?.pageInfo?.totalFound ?? 0;

    if (currentTotalFound < (option?.count ?? 0)) {
      return currentTotalFound;
    }

    return option?.count;
  };

  return (
    <div className="option flex items-center gap-3 py-1.5">
      <input
        id={uId}
        name={name}
        type="checkbox"
        value={option.value}
        checked={
          !isEmpty(filterValue) &&
          (filterValue as IFilterOptionData[])?.[filterValueIndex]?.value !== null &&
          typeof (filterValue as IFilterOptionData[])?.[filterValueIndex]?.value !== 'undefined' &&
          (option.value === (filterValue as IFilterOptionData)?.value || isSameOptionValue)
        }
        defaultChecked={
          !isEmpty(filterValue) &&
          (filterValue as IFilterOptionData[])?.[filterValueIndex]?.value !== null &&
          typeof (filterValue as IFilterOptionData[])?.[filterValueIndex]?.value !== 'undefined' &&
          (option.value === (filterValue as IFilterOptionData)?.value || isSameOptionValue) &&
          checked
        }
        onChange={onChange}
        className={cn(
          `relative peer shrink-0
  appearance-none w-4 h-4 border-2 border-primary-foreground rounded-sm bg-white
  checked:bg-primary-foreground checked:border-0
  focus:outline-none focus:ring-offset-0 focus:ring-2 focus:ring-primary
  disabled:border-steel-400 disabled:bg-steel-400`,
          {
            hasProduct: (option?.count as number) > 0,
            hasNoProduct: (option?.count as number) === 0,
          }
        )}
        disabled={option?.count === 0 ? true : false}
      />
      <label
        htmlFor={uId}
        className={cn('', {
          hasProduct: (option?.count as number) > 0,
        })}
      >
        {decode(label)}

        <span className="text-xs text-foreground ml-2 bg-primary rounded-full py-1 px-2">
          {renderCount()}
        </span>
      </label>
    </div>
  );
};
