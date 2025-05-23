import { MaxMegaMenuAttributes } from '@src/components/blocks/maxmegamenu/block';
import { MenuLink } from '@src/components/blocks/maxmegamenu/menu-link';
import {
  Menu as StyledMenu,
  MenuListItem,
  MenuWrapper,
} from '@src/components/blocks/maxmegamenu/styled-components';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { getMenuById } from '@src/lib/helpers/menu';
import { filter } from 'lodash';
import { ChevronDown } from '@components/svg/chevron-down';
import { MegaMenuSubMenu } from '@src/components/blocks/maxmegamenu/mega-menu-sub-menu';
import { NormalSubMenu } from '@src/components/blocks/maxmegamenu/normal-sub-menu';
import { cn } from '@src/lib/utils';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MobileMenuListItem } from '@src/components/blocks/maxmegamenu/mobile-menu-list-item';
import { MobileMenu } from '@src/components/blocks/maxmegamenu/mobile-menu';

type MenuProps = {
  menuId: number;
  attributes?: MaxMegaMenuAttributes;
  screen?: string;
};
export const Menu = ({ menuId, attributes, screen = 'desktop' }: MenuProps) => {
  const { asPath } = useRouter();
  const [linkHovered, setLinkHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const handleMenuLinkClicked = (index: number | null) => {
    setActiveMenu(index !== activeMenu ? index : null);
  };

  useEffect(() => {
    setLinkHovered(false);
  }, [asPath]);

  const defaultAttributes = {
    location: 'max_mega_menu_1',
    className: 'flex',
    menuId: '6292',
    menuMaxWidth: '1456px',
    fontWeight: '700',
    letterCase: 'uppercase',
    menuCentered: false,
    menuFullWidth: false,
    menuLinkPadding: { top: '20px', left: '8px', right: '8px', bottom: '20px' },
    submenuFullWidth: true,
    submenuLinkColor: '#030712',
    submenuLinkHoverColor: '#030712',
    submenuContainerPadding: { top: '32px', left: '32px', right: '32px', bottom: '32px' },
    submenuLinkPadding: { top: '6px', left: '12px', right: '12px', bottom: '6px' },
    fontSize: 12,
    mainNavigationBackgroundColor: '',
    mobileMenuLinkColor: '',
    menuLinkMargin: '10px',
    menuSeparatorColor: '',
    submenuContainerBackgroundColor: '',
    submenuLinkBackgroundColor: '',
    submenuLinkHoverBackgroundColor: '',
    mobileSubmenuLinkColor: '',
    submenuLinkMargin: {
      bottom: '2px',
      left: '2px',
      right: '2px',
      top: '2px',
    },
    submenuClasses: '',
  } as MaxMegaMenuAttributes;

  // Merge defaultAttributes with attributes, where attributes override defaultAttributes
  const mergedAttributes = { ...defaultAttributes, ...attributes } as MaxMegaMenuAttributes;

  const mainMenu = getMenuById(menuId);
  const mainMenuItems = filter(mainMenu.items, (item) => !!item.title);
  if (!mainMenuItems || !mainMenu) {
    return null;
  }

  if ('mobile' === screen) {
    return (
      <MobileMenu
        mainMenu={mainMenu}
        attributes={mergedAttributes}
      />
    );
  }

  return (
    <>
      <MenuWrapper
        className={cn(
          `main-navigation-wrapper main-navigation-wrapper-${menuId} nav hidden h-full ${mergedAttributes.className}`,
          {
            hovered: linkHovered,
            'justify-center': mergedAttributes.menuCentered,
          }
        )}
        $attrs={mergedAttributes}
      >
        <StyledMenu
          $isCentered={mergedAttributes.menuCentered}
          $isFullWidth={mergedAttributes.menuFullWidth}
          $menuMaxWidth={mergedAttributes.menuMaxWidth}
          className={cn('main-navigation flex items-center', {
            'w-full': mergedAttributes.submenuFullWidth,
          })}
          aria-label="Main Navigation"
        >
          {Object.values(mainMenuItems).map((item, index) => {
            const childMenus = item.children || [];
            const hasChildMenus = childMenus.length > 0 || false;
            const isMegaMenu = !!childMenus.find((menu) => menu.type === 'megamenu');

            const menuToggle = (index: number | null) =>
              item.url === '#' && hasChildMenus ? () => handleMenuLinkClicked(index) : undefined;
            return (
              <MenuListItem
                key={`${item?.url}-${index}`}
                $attrs={mergedAttributes}
                className={cn(`nav-item nav-item-${index} flex items-center`, {
                  active: activeMenu === index || (index === 0 && activeMenu === null),
                  'has-submenu': hasChildMenus,
                })}
                onMouseEnter={() => setLinkHovered(true)}
                onMouseLeave={() => setLinkHovered(false)}
              >
                <MenuLink
                  $padding={mergedAttributes.menuLinkPadding}
                  $color={mergedAttributes.menuLinkColor}
                  $backgroundColor={mergedAttributes.menuLinkBackgroundColor}
                  $fontWeight={mergedAttributes.fontWeight}
                  $letterCase={mergedAttributes.letterCase}
                  $hoverColor={mergedAttributes.menuLinkHoverColor}
                  $hoverBackgroundColor={mergedAttributes.menuLinkHoverBackgroundColor}
                  $fontSize={mergedAttributes.fontSize ? mergedAttributes.fontSize : 14}
                  className={cn(
                    'flex cursor-pointer items-center gap-2.5',
                    hasChildMenus && 'has-submenu'
                  )}
                  onClick={menuToggle(index)}
                  onMouseEnter={menuToggle(index)}
                  onMouseLeave={menuToggle(null)}
                  href={item.url}
                >
                  <ReactHTMLParser html={item.title || ''} />

                  {hasChildMenus && <ChevronDown />}
                </MenuLink>

                {hasChildMenus && isMegaMenu && (
                  <MegaMenuSubMenu
                    items={childMenus}
                    originalItems={mainMenu.items}
                    attributes={mergedAttributes}
                    menuItems={mainMenu.menuItems}
                  />
                )}
                {hasChildMenus && !isMegaMenu && (
                  <NormalSubMenu
                    items={childMenus}
                    attributes={mergedAttributes}
                  />
                )}
              </MenuListItem>
            );
          })}
        </StyledMenu>
      </MenuWrapper>
    </>
  );
};
