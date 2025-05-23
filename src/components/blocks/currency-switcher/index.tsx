import React from 'react';
import { cn } from '@src/lib/helpers/helper';
import { useSiteContext } from '@src/context/site-context';
import { type ShortcodeAttribute } from '@src/components/blocks/shortcode';
import { Dropdown, DropdownOption } from './dropdown';
import { BlockComponentProps } from '@src/components/blocks';
import { Content } from '@src/components/blocks/content';

const currencyLongName: { [key: string]: string } = {
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  GBP: 'Pound sterling',
  USD: 'United States (US) Dollar',
  NZD: 'New Zealand Dollar',
  IDR: 'Indonesian Rupiah',
  PES: 'Philippine Peso',
  SGD: 'Singapore Dollar',
  MYR: 'Malaysian Ringgit',
  HKD: 'Hong Kong Dollar',
  NPR: 'Nepalese Rupee',
};

// Component for use with shortcodes
export const CurrencySwitcher = ({ attributes }: { attributes: ShortcodeAttribute[] }) => {
  const { currencies, handleCountryChange, currentCountry } = useSiteContext();

  if (Object.values(currencies).length === 1) return null;

  const defaultAttributes: { [key: string]: string } = {
    class_name: '',
  };

  attributes.forEach((attribute: ShortcodeAttribute) => {
    const name = String(attribute.name);
    if (name in defaultAttributes) {
      defaultAttributes[name] = String(attribute.value) ?? '';
    }
  });

  const handleChange = (value: string) => {
    handleCountryChange({ target: { value } } as React.ChangeEvent<HTMLSelectElement>);
  };

  const options: DropdownOption[] = Object.values(currencies)
    .filter((currency): currency is NonNullable<typeof currency> => typeof currency !== 'undefined')
    .map((currency) => ({
      value: currency.baseCountry,
      label: currencyLongName[currency.currency as string] ?? currency.currency,
    }));

  return (
    <div className="relative">
      <Dropdown
        className={cn(
          'currency-switcher text-accent-foreground text-center font-secondary text-sm',
          defaultAttributes.class_name
        )}
        options={options}
        value={currentCountry}
        onChange={handleChange}
      />
    </div>
  );
};

// Component for use with block system
export const CurrencySwitcherBlock = ({ block }: BlockComponentProps) => {
  const { currencies, handleCountryChange, currentCountry } = useSiteContext();

  if (Object.values(currencies).length === 1) return null;

  const handleChange = (value: string) => {
    handleCountryChange({ target: { value } } as React.ChangeEvent<HTMLSelectElement>);
  };

  const options: DropdownOption[] = Object.values(currencies)
    .filter((currency): currency is NonNullable<typeof currency> => typeof currency !== 'undefined')
    .map((currency) => ({
      value: currency.baseCountry,
      label: currencyLongName[currency.currency as string] ?? currency.currency,
    }));

  const className = block.attrs?.className || '';

  return (
    <div className="relative">
      <Dropdown
        className={cn(
          'currency-switcher text-accent-foreground text-center font-secondary text-sm',
          className
        )}
        options={options}
        value={currentCountry}
        onChange={handleChange}
        icon={
          <Content
            type="page"
            content={block.innerBlocks}
            globalData={{}}
          />
        }
      />
    </div>
  );
};
