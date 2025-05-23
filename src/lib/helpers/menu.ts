import { find } from 'lodash';

import menus from '@public/menu.json';

export type DisplayType = 'icon_only' | 'text_only' | 'both';

type MegaMenuMeta = Partial<{
  class: string;
  'hide-on-desktop': string;
  'hide-on-mobile': string;
  span: string;
}>;

type MegaMenuColumn = {
  meta: MegaMenuMeta;
  items: {
    id: string;
    type?: string;
    title?: string;
    url?: string;
    image?: string;
    content?: string;
  }[];
};

export type MegaMenu = {
  meta: MegaMenuMeta;
  columns: MegaMenuColumn[];
  type?: string;
};

export type MegaMenuItem = Partial<{
  isMegaMenu: boolean;
  megaMenuItems: MegaMenu[];
}>;

export type MenuItem = {
  parentId: string;
  title: string;
  url: string;
  id: number;
};

type TypesenseMenuItemLink = Partial<MenuItem & MegaMenu>;
export type TypesenseMenuItem = TypesenseMenuItemLink &
  Partial<{ children: TypesenseMenuItemLink[] & MegaMenu[] }>;

export type WPMenuItem = {
  id: string;
  classes: string[];
  type: string;
  title: string;
  url: string;
  parent: string;
  displayMode: string;
  submenuType: string;
  megamenuSettings: {
    hideText: boolean;
    icon: string;
    type: string;
    customIcon?: {
      id: string;
      src: string;
      width: number;
      height: number;
    };
  };
};

export type TypesenseMenu = {
  items: TypesenseMenuItem[];
  menuItems: WPMenuItem[];
};

export const getMenuById = (menuId: number): TypesenseMenu => {
  const selectedMenu = find(menus, ['wpMenuId', menuId]) as unknown as TypesenseMenu;
  return selectedMenu;
};

export const getMenuItemById = (id: string, menuItems: WPMenuItem[]) => {
  return find(menuItems, ['id', id]) as WPMenuItem;
};

export const getMenuItemByTitle = (title: string, menuItems: WPMenuItem[]) => {
  return find(menuItems, ['title', title]) as WPMenuItem;
};

export const getDisplayTypeValues = (displayType?: DisplayType | string | null) => {
  switch (displayType) {
    case 'icon_only':
    case 'icon':
      return { showText: false, showIcon: true };
    case 'text_only':
      return { showText: true, showIcon: false };
    case 'both':
    default:
      return { showText: true, showIcon: true };
  }
};
