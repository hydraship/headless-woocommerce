import { BlockAttributes } from '@src/lib/block/types';
import { BlockComponentProps } from '@src/components/blocks';
import { getMenuById } from '@src/lib/helpers/menu';
import { Menu, MenuListItem } from '@src/components/blocks/maxmegamenu/styled-components';
import { cn } from '@src/lib/helpers/helper';
import { useState } from 'react';
import { MenuLink } from '@src/components/blocks/maxmegamenu/menu-link';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import { ChevronDown } from '@src/components/svg/chevron-down';
import { NormalSubMenu } from '@src/components/blocks/maxmegamenu/normal-sub-menu';
import { IconBlock } from '@src/components/blocks/outermost/IconBlock';
import { convertAttributes } from '@src/lib/block';
import React from 'react';
import { Content } from '@src/components/blocks/content';

// Define the type for navigation items
interface NavigationItem {
  id: string;
  name: string;
  content: string;
  status: string;
  updatedAt: number;
  createdAt: number;
}

// Import navigation data directly from the JSON file
// Type assertion to treat the imported JSON as NavigationItem[]
import rawNavigationData from '@public/navigation.json';
const navigationData = rawNavigationData as NavigationItem[];

export const Navigation = ({ block }: BlockComponentProps) => {
  const [linkHovered, setLinkHovered] = useState(false);

  // Using any as other components in the codebase do the same
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const attributes = convertAttributes(block.attrs as any) as BlockAttributes;

  // Get the ref from attributes
  const ref = attributes.ref ? Number(attributes.ref) : null;

  // If we're using the traditional menu approach
  const menuId = (attributes.menu as string) || '';
  const iconBlock = block.innerBlocks.length > 0 ? block.innerBlocks[0] : null;
  const hasChevronDownIcon = attributes.hasChevronDown;
  const color = attributes.color;

  // If we have a ref, find the matching navigation item
  const navigationItem =
    ref && navigationData.length > 0
      ? navigationData.find((item) => item.id === ref.toString())
      : null;

  // If we found a navigation item with matching ref, render it using Content
  if (navigationItem) {
    return (
      <Content
        content={navigationItem.content}
        type="page"
      />
    );
  }

  // Otherwise, fall back to the traditional menu approach
  const mainMenu = getMenuById(parseInt(menuId, 10));

  if (!mainMenu) {
    return null;
  }

  return (
    <Menu
      className={cn('flex items-center relative', attributes?.className, {
        'w-full': attributes.submenuFullWidth,
        'menu-hovered': linkHovered,
      })}
    >
      {mainMenu.items.map((item, index) => {
        const childMenus = item.children || [];
        const hasChildMenus = childMenus.length > 0 || false;

        return (
          <MenuListItem
            key={`${item?.url}-${index}`}
            $attrs={attributes}
            className="nav-item flex items-center"
            onMouseEnter={() => setLinkHovered(true)}
            onMouseLeave={() => setLinkHovered(false)}
          >
            <MenuLink
              $fontSize={14}
              className={cn(
                'flex cursor-pointer items-center gap-2.5 rounded',
                hasChevronDownIcon === true && hasChildMenus === true && 'has-submenu'
              )}
              href={item.url}
              $backgroundColor={'transparent'}
              $hoverBackgroundColor={'transparent'}
              $color={(color as string) || '#fff'}
              $hoverColor={(color as string) || '#fff'}
            >
              <React.Fragment>
                {iconBlock && <IconBlock block={iconBlock} />}
                <ReactHTMLParser html={item.title || ''} />

                {hasChevronDownIcon === true && hasChildMenus === true && <ChevronDown />}
              </React.Fragment>
            </MenuLink>

            {hasChildMenus && (
              <NormalSubMenu
                items={childMenus}
                attributes={attributes}
              />
            )}
          </MenuListItem>
        );
      })}
    </Menu>
  );
};
