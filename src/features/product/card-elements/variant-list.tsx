import { Product } from '@src/models/product';
import { cn } from '@src/lib/helpers/helper';

type ICardList = {
  product: Product;
  detailsAlignment: string;
};

export const CardVariantList: React.FC<ICardList> = (props) => {
  const { product, detailsAlignment = 'left' } = props;

  return (
    <>
      <div className={cn('product-variant-lists', `justify-${detailsAlignment}`)}>
        <div className="title text-sm leading-6">Variants</div>
        <div className="list font-semibold text-sm leading-6">
          {Array.isArray(product?.attributes) &&
            product?.attributes.map((attr) => attr.label).join(', ')}
        </div>
      </div>
    </>
  );
};
