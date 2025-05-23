import { MaxMegaMenuAttributes } from '@src/components/blocks/maxmegamenu/block';
import { MenuLink } from '@src/components/blocks/maxmegamenu/menu-link';
import {
  Menu as StyledMenu,
  MenuListItem,
  MenuWrapper,
} from '@src/components/blocks/maxmegamenu/styled-components';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { getMenuById, TypesenseMenu } from '@src/lib/helpers/menu';
import { filter } from 'lodash';
import { ChevronDown } from '@components/svg/chevron-down';
import { MegaMenuSubMenu } from '@src/components/blocks/maxmegamenu/mega-menu-sub-menu';
import { NormalSubMenu } from '@src/components/blocks/maxmegamenu/normal-sub-menu';
import { cn } from '@src/lib/utils';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MobileMenuListItem } from '@src/components/blocks/maxmegamenu/mobile-menu-list-item';

type MenuProps = {
  mainMenu: TypesenseMenu;
  attributes: MaxMegaMenuAttributes;
};
export const MobileMenu = ({ mainMenu, attributes }: MenuProps) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const mainMenuItems = filter(mainMenu.items, (item) => !!item.title);
  if (!mainMenuItems || !mainMenu) {
    return null;
  }

  const handleToggle = (index: number | null) => {
    setActiveMenu(index);
  };

  return (
    <StyledMenu
      className={cn(
        'relative overlaywats mobile-navigation',
        activeMenu !== null && 'child-menu-open'
      )}
      aria-label="Mobile Navigation"
    >
      {Object.values(mainMenuItems).map((menuItem, index) => (
        <MobileMenuListItem
          key={`${menuItem.url}-${index}`}
          menuItem={menuItem}
          attributes={attributes}
          originalItems={mainMenu.items}
          menuItems={mainMenu.menuItems}
          isOpen={activeMenu === index}
          onToggle={() => (activeMenu === index ? handleToggle(null) : handleToggle(index))}
        />
      ))}
    </StyledMenu>
  );
};
