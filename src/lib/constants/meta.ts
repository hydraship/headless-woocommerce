import { startCase } from 'lodash';

import { env } from '@src/lib/env';

export const meta = (title: string) => {
  const { NEXT_PUBLIC_SHOP_NAME } = env();
  return `<title>${startCase(title)}${
    NEXT_PUBLIC_SHOP_NAME ? ` - ${NEXT_PUBLIC_SHOP_NAME}` : ''
  }</title>`;
};
