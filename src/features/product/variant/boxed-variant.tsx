import { cn } from '@src/lib/utils';
import { useProductContext } from '@src/context/product-context';
import { useAttributeParams } from '@src/lib/hooks/product';
import { Attribute } from '@src/models/product/types';
import { find, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';

type Props = {
  attribute: Attribute;
  onChange: (attributeName: string, optionValue: string) => void;
  firstOption?: boolean;
};

export const BoxedVariant: React.FC<Props> = ({ attribute, onChange, firstOption }) => {
  const attributeParams = useAttributeParams();

  const {
    product,
    actions: { onAttributeSelect },
  } = useProductContext();
  const { name, label, options } = attribute;

  const [currentAttributeLabel, setCurrentAttributeLabel] = useState('');

  useEffect(() => {
    if (!isEmpty(attributeParams[name]) && !isEmpty(name)) {
      const foundLabel = find(options, { slug: attributeParams[name] });
      if (!isEmpty(foundLabel)) {
        setCurrentAttributeLabel(foundLabel.label);
      }
      onAttributeSelect(name, attributeParams[name]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributeParams]);

  if (isEmpty(product?.variantImageSrc)) return null;

  const handleOnChange = (value: string, label: string) => {
    setCurrentAttributeLabel(label);
    onChange(name, value);
  };

  useEffectOnce(() => {
    if (firstOption) {
      const firstOption = options[0];
      if (firstOption) {
        handleOnChange(firstOption.name, firstOption.label);
      }
    }
  });

  if (isEmpty(product?.variantImageSrc)) return null;

  return (
    <>
      <label className="text-foreground text-base md:text-lg leading-7 font-semibold">
        {label}: {currentAttributeLabel}
      </label>
      <div className="flex flex-wrap gap-4">
        {options.map((option, index) => (
          <label
            htmlFor={`${name}-${option.name}`}
            key={`boxed-variant-${option.name}-${index}`}
          >
            <input
              className="peer hidden"
              type="radio"
              name={name}
              id={`${name}-${option.name}`}
              checked={currentAttributeLabel === option.label}
              value={option.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleOnChange(e.target.value, option.label);
              }}
              disabled={!option.isAvailable}
            />
            <div
              className={cn(
                'p-3 rounded border border-foreground font-semibold cursor-pointer text-base leading-7 text-foreground text-center peer-checked:text-foreground peer-checked:bg-primary min-w-[100px] md:min-w-[120px] peer-checked:shadow-sm peer-checked:shadow-black/10 peer-checked:border-t peer-checked:border-black/10',
                {
                  'border-[#f4f4f5] bg-[#f4f4f5] cursor-not-allowed text-[#9ca3af]':
                    !option.isAvailable,
                }
              )}
            >
              {option.label}
            </div>
          </label>
        ))}
      </div>
    </>
  );
};
