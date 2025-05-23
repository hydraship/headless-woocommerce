import HEADER_DATA from '@public/header.json';
import { Content } from '@src/components/blocks/content';
import { WishList } from '@src/features/wish-list';
import { cn } from '@src/lib/helpers/helper';

export const Header = () => {
  return (
    <>
      <header
        id="top"
        className={cn('w-full bg-white shadow-lg font-primary')}
      >
        <Content content={HEADER_DATA} />
      </header>

      <WishList />
    </>
  );
};
