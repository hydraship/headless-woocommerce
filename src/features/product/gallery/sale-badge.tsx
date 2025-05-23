import { cn, isLightColor } from '@src/lib/helpers/helper';

interface IOnSaleBadgeGallery {
  onSale: boolean;
  badgeType?: number;
  saleBadgeColor?: string;
}
export const OnSaleBadgeGallery = (props: IOnSaleBadgeGallery) => {
  const { onSale, badgeType, saleBadgeColor } = props;
  if (!onSale) return null;
  return (
    <div className="absolute top-0 lg:m-5 flex space-x-1">
      {onSale && (
        <span
          className={cn('absolute ', {
            'top-0 inset-x-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary':
              badgeType === 1,
            '-top-4 -left-20 lg:-top-11 lg:-left-28 h-16 w-48 origin-center -rotate-45 z-0 bg-primary':
              badgeType === 3,
            'top-0 inset-x-0 flex items-center justify-center h-7 w-16 bg-primary rounded-md':
              badgeType === 2,
          })}
        >
          <p
            className={cn('text-center text-xs font-bold font-primary leading-normal', {
              'relative p-2.5': badgeType === 1,
              'w-full absolute bottom-2.5': badgeType === 3,
              'text-white': !isLightColor(saleBadgeColor),
              'text-black': isLightColor(saleBadgeColor),
            })}
          >
            SALE
          </p>
        </span>
      )}
    </div>
  );
};
