import { Dictionary } from '@reduxjs/toolkit';

import { PrefetchLink } from '@src/components/common/prefetch-link';
import { cn } from '@src/lib/utils';

type ListItem = {
  redirectUrl: string;
  text: string;
};

type Props = {
  list: ListItem[];
  config?: Dictionary<string>;
};

export const List = ({ list, config }: Props) => {
  const listClass = cn('flex flex-col', config?.listClass);
  return (
    <div className={listClass}>
      {list.map((listItem) => {
        const { text, redirectUrl } = listItem;

        if (redirectUrl) {
          return (
            <PrefetchLink
              key={text}
              unstyled
              href={redirectUrl}
            >
              {text}
            </PrefetchLink>
          );
        }

        return text;
      })}
    </div>
  );
};
