/* eslint-disable no-console */
import * as fs from 'fs';
import path from 'path';
import theme from '@public/theme.json';
import wptheme from '@public/wp-theme.json';
import { hexToHslValue } from '@src/lib/helpers/color';

const gridItemWidths = ['25', '33', '50', '66', '75', '100']; // this is what is provider by generate press block settins GRID ITEM WIDTH (%)
const gridItemWidthsClasses = gridItemWidths
  .flatMap((i) => [`w-[${i}%]`, `md:w-[${i}%]`, `lg:w-[${i}%]`])
  .map((item) => `'${item}'`)
  .join(',');

const safeListPattern = /(mb|mt|ml|mr)-\d*/;

const colorVars = Object.entries(theme.colorVars)
  .map(([key, value]) => `${key}: ${hexToHslValue(value)};`)
  .join('\n');

const themeColors = Object.entries(theme.colorClasses)
  .map(([key, value]) => `'${key}': 'hsl(${value})'`)
  .join(',\n');

const fontFamilies = Object.entries(theme.fontFamilies);
const modifiedFontFamilies: [string, string][] = [];

if (fontFamilies.length >= 1) {
  modifiedFontFamilies.push(['primary', fontFamilies[0][1]]);
}

if (fontFamilies.length >= 2) {
  modifiedFontFamilies.push(['secondary', fontFamilies[1][1]]);
}

if (fontFamilies.length >= 3) {
  modifiedFontFamilies.push(['tertiary', fontFamilies[2][1]]);
}

const fontFamilyConfig = modifiedFontFamilies
  .map(([key, value]) => `'${key}': ['${value}']`)
  .join(',\n');

const tailwindConfig = `module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/config.json',
    './src/styles/styles.css',
    './public/menu.json',
    './public/product.json',
    './public/footer.json',
    './public/header.json',
    './public/styles/*.css',
    './public/homepage.json',
    './public/page/*.json',
    './public/post/*.json',
    './public/*.json',
  ],
  theme: {
    container: {
      center: true,
      screens: {
        '2xl': '${wptheme.layout.contentSize}',
      },
    },
    extend: {
      fontSize: {
        xxs: '0.625rem',
      },
      animation: {
        fade: 'fadeIn 1s ease-in-out',
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
        'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
      },
      colors: {
        'brand-icons': 'var(--colors-brandIcons)',
        'brand-primary': 'var(--colors-brandPrimary)',
        'brand-secondary': 'var(--colors-brandSecondary)',
        'brand-tertiary': 'var(--colors-brandTertiary)',
        'brand-font': 'var(--colors-brandFont)',
        'brand-links': 'var(--colors-brandLinks)',
        'brand-hover-links': 'var(--colors-brandHoverLinks)',
        'brand-button-background': 'var(--colors-brandButtonBackground)',
        'brand-button-text': 'var(--colors-brandButtonText)',
        'brand-hover-button-background': 'var(--colors-brandHoverButtonBackground)',
        'brand-hover-button-text': 'var(--colors-brandHoverButtonText)',
        'brand-wishlist-background': 'var(--colors-brandWishlistBackground)',
        'brand-wishlist-icon-fill': 'var(--colors-brandWishlistIconFill)',
        'brand-wishlist-icon-stroke': 'var(--colors-brandWishlistIconStroke)',
        'brand-wishlist-hover-background': 'var(--colors-brandWishlistHoverBackground)',
        'brand-wishlist-hover-icon-fill': 'var(--colors-brandWishlistHoverIconFill)',
        'brand-wishlist-hover-icon-stroke': 'var(--colors-brandWishlistHoverIconStroke)',
        'brand-primary-light': 'var(--colors-brandPrimary)',
        'brand-second-grey': 'var(--colors-brandPrimary)',
        'sub-title': 'var(--colors-subTitle)',
        'contrast-3': '#655B51',
        'accent-3': '#FF8A00',
        ${themeColors}
      },
      fontFamily: {
        ${fontFamilyConfig},
        'courier': ['Courier New', 'Courier', 'monospace'],
      },
    },
  },
  safelist: [
    {
      pattern: ${safeListPattern},
    },
    ${gridItemWidthsClasses}
  ],
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio')],
};`;

const themeVariables = `
@tailwind base;
@layer base {
  :root {
    ${colorVars}
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
    --container-width: ${wptheme.layout.contentSize};
  }
}
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}  
`;

export default async function execute() {
  try {
    console.log('recreating/update tailwind config');
    const tailwindPath = path.join(process.cwd(), 'tailwind.config.js');

    fs.writeFileSync(tailwindPath, tailwindConfig, {
      encoding: 'utf-8',
      flag: 'w',
    });

    const themeVariablesPath = path.join(process.cwd(), 'src/styles', 'theme-variables.css');
    fs.writeFileSync(themeVariablesPath, themeVariables, {
      encoding: 'utf-8',
      flag: 'w',
    });
  } catch (error) {
    console.error('Error recreating/update tailwind config:', error);
  }
}
