import { ProductAddons } from '@src/models/product/types';
import { Product } from '@src/models/product';
import { AddOnsDescription } from '@src/features/product/addons/description';
import { AddOnsTitle } from '@src/features/product/addons/title';
import { cn } from '@src/lib/helpers/helper';
import { useProductContext } from '@src/context/product-context';
import { debounce } from 'lodash';

type TProps = {
  field: ProductAddons;
  product: Product;
};

export const AddOnsTextarea = ({ field, product }: TProps) => {
  const { classNames = [] } = field;
  const { fields } = useProductContext();
  const [, setFieldsValue] = fields.value;

  const handleChange = debounce((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const key = event.target.name;

    setFieldsValue((prev) => {
      return {
        ...prev,
        [key]: event.target.value,
      };
    });
  }, 500);

  return (
    <div
      className={cn('addon-field-group textarea-field', {
        [classNames.join(' ')]: classNames.length > 0,
      })}
    >
      <AddOnsTitle field={field} />
      <AddOnsDescription field={field} />
      <textarea
        className="w-full rounded-sm border-[#E7E7E7] border"
        placeholder={field.placeholder}
        name={'addon-' + product.productId + '-' + field.id}
        onChange={handleChange}
      />
    </div>
  );
};
