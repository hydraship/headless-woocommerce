import { createPortal } from 'react-dom';
import { isMobile } from 'react-device-detect';
import { filter } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { BlockComponentProps } from '@src/components/blocks';
import { ChevronDown } from '@components/svg/chevron-down';
import { MegaMenuSubMenu } from '@src/components/blocks/maxmegamenu/mega-menu-sub-menu';
import {
  Menu,
  MenuListItem,
  MenuWrapper,
} from '@src/components/blocks/maxmegamenu/styled-components';
import { MenuLink } from '@src/components/blocks/maxmegamenu/menu-link';
import { MobileMenuListItem } from '@src/components/blocks/maxmegamenu/mobile-menu-list-item';

import { getMenuById } from '@src/lib/helpers/menu';
import { useSiteContext } from '@src/context/site-context';
import { cn } from '@src/lib/helpers/helper';
import { NormalSubMenu } from '@src/components/blocks/maxmegamenu/normal-sub-menu';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { isBlockNameA } from '@src/lib/block';
export const MAXMEGAMENU_BLOCK_NAME = 'maxmegamenu/location';

export type BoxControlProps = Partial<{
  bottom: string;
  left: string;
  right: string;
  top: string;
}>;

export type MaxMegaMenuAttributes = Partial<{
  className: string;
  fontSize: number;
  fontWeight: string;
  letterCase: string;
  mainNavigationBackgroundColor: string;
  menuCentered: boolean;
  menuFullWidth: boolean;
  menuMaxWidth: string;
  menuId: string;
  menuLinkBackgroundColor: string;
  menuLinkColor: string;
  menuLinkHoverBackgroundColor: string;
  menuLinkHoverColor: string;
  menuLinkActiveBackgroundColor: string;
  menuLinkActiveColor: string;
  mobileMenuLinkColor: string;
  menuLinkMargin: BoxControlProps;
  menuLinkPadding: BoxControlProps;
  menuSeparatorColor: string;
  submenuContainerBackgroundColor: string;
  submenuFullWidth: boolean;
  submenuLinkBackgroundColor: string;
  submenuLinkColor: string;
  submenuLinkHoverBackgroundColor: string;
  submenuLinkHoverColor: string;
  mobileSubmenuLinkColor: string;
  submenuContainerPadding: BoxControlProps;
  submenuLinkMargin: BoxControlProps;
  submenuLinkPadding: BoxControlProps;
  submenuClasses: string;
}>;

export const MaxMegaMenu = ({ block }: BlockComponentProps) => {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('');
  const [linkHovered, setLinkHovered] = useState(false);

  useEffect(() => {
    const raw = router.asPath.split('?')[0];
    setCurrentPath(raw.replace(/\/$/, ''));
  }, [router.asPath]);

  useEffect(() => {
    setLinkHovered(false); // Reset hover state when the path changes
  }, [currentPath]);

  if (MAXMEGAMENU_BLOCK_NAME !== block.blockName) {
    return null;
  }

  const attributes = block.attrs as MaxMegaMenuAttributes;

  const menuId = attributes.menuId || '';
  const mainMenu = getMenuById(parseInt(menuId, 10));

  if (!mainMenu) {
    return null;
  }

  const mainMenuItems = filter(mainMenu.items, (item) => !!item.title);

  if (isBlockNameA(block, 'MobileMaxMegaMenu')) {
    // Use the MobileMenu component which has proper state management
    const { MobileMenu } = require('@src/components/blocks/maxmegamenu/mobile-menu');
    return <MobileMenu mainMenu={mainMenu} attributes={attributes} />;
  }

  return (
    <>
      <MenuWrapper
        className={cn(`main-navigation-wrapper nav hidden w-full h-full ${attributes.className}`, {
          hovered: linkHovered,
          'justify-center': attributes.menuCentered,
        })}
        $attrs={attributes}
      >
        <Menu
          $isCentered={attributes.menuCentered}
          $isFullWidth={attributes.menuFullWidth}
          $menuMaxWidth={attributes.menuMaxWidth}
          className={cn('main-navigation flex items-center', {
            'w-full': attributes.submenuFullWidth,
            relative: !attributes.menuFullWidth,
          })}
          aria-label="Main Navigation"
        >
          {Object.values(mainMenuItems).map((item, index) => {
            const childMenus = item.children || [];
            const hasChildMenus = childMenus.length > 0 || false;
            const isMegaMenu = !!childMenus.find((menu) => menu.type === 'megamenu');

            return (
              <MenuListItem
                key={`${item?.url}-${index}`}
                $attrs={attributes}
                className="nav-item flex items-center h-full"
                onMouseEnter={() => setLinkHovered(true)}
                onMouseLeave={() => setLinkHovered(false)}
              >
                <MenuLink
                  $padding={attributes.menuLinkPadding}
                  $color={attributes.menuLinkColor}
                  $backgroundColor={attributes.menuLinkBackgroundColor}
                  $fontWeight={attributes.fontWeight}
                  $letterCase={attributes.letterCase}
                  $hoverColor={attributes.menuLinkHoverColor}
                  $hoverBackgroundColor={attributes.menuLinkHoverBackgroundColor}
                  $activeColor={attributes.menuLinkActiveColor}
                  $activeBackgroundColor={attributes.menuLinkActiveBackgroundColor}
                  $fontSize={attributes.fontSize ? attributes.fontSize : 14}
                  className="flex cursor-pointer items-center gap-2.5"
                  href={item.url}
                >
                  <ReactHTMLParser html={item.title || ''} />

                  {hasChildMenus && <ChevronDown />}
                </MenuLink>

                {hasChildMenus && isMegaMenu && (
                  <MegaMenuSubMenu
                    items={childMenus}
                    originalItems={mainMenu.items}
                    attributes={attributes}
                    menuItems={mainMenu.menuItems}
                  />
                )}
                {hasChildMenus && !isMegaMenu && (
                  <NormalSubMenu
                    items={childMenus}
                    attributes={attributes}
                  />
                )}
              </MenuListItem>
            );
          })}
        </Menu>
      </MenuWrapper>
    </>
  );
};
