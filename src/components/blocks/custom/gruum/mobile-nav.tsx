import { BlockAttributes } from '@src/lib/block/types';
import { BlockComponentProps } from '@src/components/blocks';
import { useState } from 'react';
import { cn } from '@src/lib/utils';
import { Menu } from '@src/components/blocks/maxmegamenu/menu';
import { Menu as StyledMenu } from '@src/components/blocks/maxmegamenu/styled-components';
import { MobileMenuListItem } from '@src/components/blocks/maxmegamenu/mobile-menu-list-item';
import { getMenuById } from '@src/lib/helpers/menu';
import { filter } from 'lodash';

export const GruumMobileNav = ({ block }: BlockComponentProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if ('sg-gutenberg-customisations/theme-blocks-mobile-nav' !== block.blockName) {
    return null;
  }

  const attrs = block.attrs as BlockAttributes;
  if (attrs.blockVisibility && attrs.blockVisibility.hideBlock) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const classNames = attrs.className ? attrs.className.split(' ') : [];
  const menuIds = classNames?.filter((className) => className.includes('menu-id'));

  return (
    <div className="relative w-full mobile-nav">
      <ul className="relative z-30">
        <li className="item text-orange menu">
          <a
            className="icon-wrapper menu-trigger"
            onClick={toggleMenu}
          >
            <span className="icon">
              <div className={cn('hamburger-icon', isMenuOpen && 'open')}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </span>
          </a>
        </li>
      </ul>

      {isMenuOpen && (
        <div
          className={cn(
            'menu-container flex xl:hidden absolute top-0 left-0 w-screen z-20 transition-all duration-300 ease-in-out h-max',
            isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-[-100%] opacity-0'
          )}
        >
          {/* White background div - 80% width, visible when menu is open */}
          <div
            className={cn(
              'menu-container-content w-[80vw] bg-white shadow-xl flex flex-col justify-start'
            )}
          >
            {/* Menu content would go here */}
            {menuIds.map((classMenuId) => {
              let screen = 'desktop';
              let menuId = classMenuId.startsWith('menu-id-')
                ? parseInt(classMenuId.replace('menu-id-', ''))
                : 0;

              if (classMenuId.startsWith('mobile-menu-id-')) {
                menuId = parseInt(classMenuId.replace('mobile-menu-id-', ''));
                screen = 'mobile';
              }

              return (
                <Menu
                  menuId={menuId}
                  key={menuId}
                  screen={screen}
                />
              );
            })}
          </div>
          {/* Menu overlay - visible when menu is open */}
          <div
            className="menu-container-overlay w-[20vw] bg-black bg-opacity-70 z-10 transition-opacity duration-300"
            onClick={toggleMenu}
          ></div>
        </div>
      )}
    </div>
  );
};
