import { BlockComponentProps, ParsedBlock } from '@src/components/blocks';
import { Content } from '@src/components/blocks/content';
import { BlockAttributes } from '@src/lib/block/types';
import { cn } from '@src/lib/utils';

export const SocialLinks = ({ block }: BlockComponentProps) => {
  if (block.blockName !== 'core/social-links') {
    return null;
  }

  const { attrs, innerBlocks } = block;
  const { iconColor, iconColorValue, size, className, layout } = attrs as BlockAttributes;

  // Map WordPress size classes to Tailwind classes
  const sizeClasses = {
    'has-small-icon-size': 'text-sm',
    'has-normal-icon-size': 'text-base',
    'has-large-icon-size': 'text-2xl',
    'has-huge-icon-size': 'text-3xl',
  };

  // Generate Tailwind classes based on attributes
  const classes = cn(
    // Base classes
    'flex flex-wrap p-0 list-none gap-2',

    // Layout classes
    layout?.justifyContent === 'center' && 'justify-center',
    layout?.justifyContent === 'right' && 'justify-end',
    layout?.justifyContent === 'space-between' && 'justify-between',
    layout?.flexWrap === 'nowrap' && 'flex-nowrap',

    // Size classes
    size && sizeClasses[size as keyof typeof sizeClasses],

    // Custom classes from WordPress
    className
  );

  // Apply inline styles for icon color if provided
  const style = iconColorValue
    ? {
        '--social-icon-color': iconColorValue,
      }
    : {};

  return (
    <ul
      className={classes}
      style={style as React.CSSProperties}
    >
      <Content content={innerBlocks} />
    </ul>
  );
};
