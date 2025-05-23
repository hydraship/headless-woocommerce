import { BlockComponentProps } from '@src/components/blocks';
import { NavigationLink } from '@src/components/blocks/core/navigation-link';

export const NavigationSubmenu = ({ block }: BlockComponentProps) => {
  return <NavigationLink block={block} />;
};
