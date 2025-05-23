import { ChevronDown } from '@src/components/svg/chevron-down';
import { MaxMegaMenuAttributes } from '@src/components/blocks/maxmegamenu/block';
import { MegaMenuSubMenu } from '@src/components/blocks/maxmegamenu/mega-menu-sub-menu';
import { MenuLink } from '@src/components/blocks/maxmegamenu/menu-link';
import { MenuListItem } from '@src/components/blocks/maxmegamenu/styled-components';
import {
  getMenuItemById,
  TypesenseMenuItem,
  WPMenuItem,
} from '@src/lib/helpers/menu';

import { cn } from '@src/lib/helpers/helper';
import { NormalSubMenu } from '@src/components/blocks/maxmegamenu/normal-sub-menu';
import { ReactHTMLParser } from '@src/lib/block/react-html-parser';
import Image from 'next/image';

type Props = {
  attributes: MaxMegaMenuAttributes;
  menuItem: TypesenseMenuItem;
  originalItems?: TypesenseMenuItem[];
  menuItems: WPMenuItem[];
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
};

export const MobileMenuListItem: React.FC<Props> = ({
  attributes,
  menuItem,
  originalItems,
  menuItems,
  isOpen,
  onToggle,
  className,
}) => {
  const childMenus = menuItem.children || [];
  const hasChildMenus = childMenus.length > 0 || false;
  const isMegaMenu = !!childMenus.find((menu) => menu.type === 'megamenu');

  const wpMenuItem = getMenuItemById(menuItem.id ? menuItem.id.toString() : '', menuItems);

  const handleOnClick = (e: React.MouseEvent) => {
    onToggle();
    e.preventDefault();
  };

  // For menu items with children, we want to toggle the dropdown when clicked
  const handleMenuItemClick = (e: React.MouseEvent) => {
    if (hasChildMenus) {
      handleOnClick(e);
    }
  };

  // For the chevron icon, we always want to toggle the dropdown
  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the parent link from navigating
    handleOnClick(e);
  };

  return (
    <MenuListItem
      className={cn({
        'is-open': isOpen,
      }, className)}
    >
      <MenuLink
        className="flex cursor-pointer items-center justify-between gap-2.5"
        $padding={attributes.menuLinkPadding}
        $color={attributes.menuLinkColor}
        $backgroundColor={attributes.menuLinkBackgroundColor}
        $fontWeight={attributes.fontWeight}
        $letterCase={attributes.letterCase}
        $hoverColor={attributes.menuLinkHoverColor}
        $hoverBackgroundColor={attributes.menuLinkHoverBackgroundColor}
        $fontSize={attributes.fontSize ? attributes.fontSize : 14}
        href={menuItem.url}
        onClick={hasChildMenus ? handleMenuItemClick : undefined}
      >
        {wpMenuItem && wpMenuItem.megamenuSettings.customIcon && (
          <Image
            className="menu-item-icon"
            alt={menuItem.title ?? ''}
            src={wpMenuItem.megamenuSettings.customIcon.src}
            width={wpMenuItem.megamenuSettings.customIcon.width}
            height={wpMenuItem.megamenuSettings.customIcon.height}
            onClick={(e) => {
              e.stopPropagation();
              handleOnClick(e);
            }}
          />
        )}
        <ReactHTMLParser html={menuItem.title || ''} />
        {hasChildMenus && (
          <div onClick={handleChevronClick}>
            <ChevronDown />
          </div>
        )}
      </MenuLink>
      {hasChildMenus && (
        <button
          className={cn('back-button text-sm text-black w-full text-left p-2 mt-2', !isOpen && 'hidden')}
          onClick={handleOnClick}
        >
          ← Go back
        </button>
      )}
      {hasChildMenus && isMegaMenu && (
        <MegaMenuSubMenu
          items={childMenus}
          attributes={attributes}
          originalItems={originalItems}
          menuItems={menuItems}
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
};
