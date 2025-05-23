import { cn, isLightColor } from '@src/lib/helpers/helper';

interface INewBadgeGallery {
  isNew: boolean;
  id?: string;
  className?: string;
  badgeType?: number;
  newBadgeColor?: string;
}

export const NewBadgeGallery = (props: INewBadgeGallery) => {
  const { isNew, id, className, badgeType, newBadgeColor } = props;
  if (!isNew) return null;
  return (
    <div
      className={cn(`absolute top-0 flex w-full h-1/4 overflow-hidden z-0 ${id} ${className}`, {
        'left-0 justify-end': badgeType === 1 || badgeType === 3,
        'float-right': badgeType === 2,
      })}
    >
      <span
        className={cn('', {
          'relative top-0 inset-x-0 flex items-center justify-center m-4 md:m-8 h-12 w-12 rounded-full':
            badgeType === 1,
          'absolute -top-4 -right-20 h-16 w-48 origin-center rotate-45 z-0': badgeType === 2,
          'top-0 inset-x-0 flex items-center justify-center h-7 w-16': badgeType === 3,
        })}
        style={{ backgroundColor: newBadgeColor }}
      >
        <p
          className={cn('text-center text-xs font-normal', {
            'relative p-2.5': badgeType === 1,
            'absolute w-full bottom-2.5': badgeType === 2,
            'text-white': !isLightColor(newBadgeColor),
            'text-black': isLightColor(newBadgeColor),
          })}
        >
          NEW!
        </p>
      </span>
    </div>
  );
};
