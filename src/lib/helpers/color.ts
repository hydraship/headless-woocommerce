import Color from 'color';

const CSS_VARIABLE_TO_HEX: Record<string, string> = {
  'var(--contrast)': '#222222',
  'var(--contrast-2)': '#575760',
  'var(--contrast-3)': '#B2B2BE',
  'var(--base)': '#F0F0F0',
  'var(--base-2)': '#F7F8F9',
  'var(--base-3)': '#FFFFFF',
  'var(--accent)': '#1E73BE',
};

const getHexFromCssVar = (cssVar: string): string => {
  return CSS_VARIABLE_TO_HEX[cssVar] || cssVar;
};

export const hexToHslValue = (hexColor: string, separator = ' '): string => {
  // If it's a CSS variable, convert it to hex first
  const actualHex = getHexFromCssVar(hexColor);
  const [h, s, l] = hexToHslArray(actualHex);
  return `${h}${separator}${s}%${separator}${l}%`;
};

export const hexToHslArray = (hexColor: string): number[] => {
  const color = Color(hexColor).hsl(); // Get the HSL object

  const h = Math.round(color.hue()); // Hue
  const s = Math.round(color.saturationl()); // Saturation
  const l = Math.round(color.lightness()); // Lightness

  return [h, s, l];
};

export const percentageToDecimal = (percentage: number): number => {
  if (percentage < 0 || percentage > 100) {
    // eslint-disable-next-line no-console
    console.error('Percentage must be between 0 and 100.');
    return 0;
  }
  return percentage / 100;
};
