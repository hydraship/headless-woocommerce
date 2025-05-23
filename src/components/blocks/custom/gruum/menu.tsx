import { BlockAttributes } from '@src/lib/block/types';
import { BlockComponentProps } from '@src/components/blocks';
import { Menu } from '@src/components/blocks/maxmegamenu/menu';

export const GruumMenu = ({ block }: BlockComponentProps) => {
  const allowedBlocks = [
    'sg-gutenberg-customisations/theme-blocks-menu',
    'sg-gutenberg-customisations/theme-blocks-sub-menu-container',
  ];

  if (block.blockName && !allowedBlocks.includes(block.blockName)) {
    return null;
  }

  const attrs = block.attrs as BlockAttributes;
  if (attrs.blockVisibility && attrs.blockVisibility.hideBlock) {
    return null;
  }

  let menuId = 0;
  const menuIdMatch = attrs.className && attrs.className.match(/menu-id-(\d+)/);
  if (menuIdMatch) {
    menuId = parseInt(menuIdMatch[1], 10);
  }
  if (menuId <= 0) {
    return null;
  }

  return <Menu menuId={menuId} />;
};
