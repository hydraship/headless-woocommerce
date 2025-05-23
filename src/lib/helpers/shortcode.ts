export interface IAttribute {
  name: string;
  value?: string;
}

export interface IShortcode {
  code: string;
  raw: string;
  attributeKeys?: string[];
  attributeString: string;
  attributeStringWithoutHTML: string;
  attributeStringWithoutValues: string;
  attributes: IAttribute[];
}

export interface IResult {
  markup: string;
  shortcodes: IShortcode[];
}

export const WPShortcodes = (
  data: string,
  functionMap: { [key: string]: (_attributes: IAttribute[]) => string } = {}
): IResult => {
  if (!data) {
    throw new Error('Must pass data to WPShortcodes');
  }

  let markup = data;

  // Picks up all of the shortcodes and turns them into an array.
  const shortcodesRaw = data.match(/\[.*?\]/g) || [];
  const shortcodes: IShortcode[] = [];

  // Loops through the shortcode array to find the name and attributes.
  for (const shortcode of shortcodesRaw) {
    const codeMatch = shortcode.match(/(?<=\[)[a-zA-Z0-9_]+/);

    if (!codeMatch) continue;
    const code = codeMatch[0];
    const attributes: IAttribute[] = [];

    let attributeString: string = shortcode.replace(`[${code}`, '').replace(']', '').trim();

    // Remove all HTML tags from attributeString
    const attributeStringWithoutHTML: string = attributeString.replace(/<[^>]*>/g, '');

    // Step 1: Create a variable with all values removed
    const attributeStringWithoutValues: string = attributeStringWithoutHTML.replace(
      /(\w+)=["'][^"']*["']/g,
      '$1=""'
    );

    // Step 2: Extract attribute keys
    const attributeKeys: string[] = attributeStringWithoutValues.match(/\w+(?==)/g) || [];

    // Convert all single quotes to HTML character codes
    attributeString = attributeString.replace(/'/g, '&#39;');

    // Step 3: Extract attribute values based on keys
    attributeKeys.forEach((key) => {
      const valueMatch = attributeString.match(new RegExp(`${key}=["']((?:[^"']|\\.)*?)["']`));
      if (valueMatch) {
        attributes.push({
          name: key,
          // eslint-disable-next-line quotes
          value: valueMatch[1].replace(/&#39;/g, "'"), // Convert back HTML character codes to single quotes
        });
      }
    });

    shortcodes.push({
      code,
      raw: shortcode,
      attributes,
      attributeKeys,
      attributeString,
      attributeStringWithoutHTML,
      attributeStringWithoutValues,
    });

    if (typeof functionMap[code] === 'function') {
      const shortCodeMarkup = functionMap[code](attributes);
      if (shortCodeMarkup) {
        markup = markup.replace(shortcode, shortCodeMarkup);
      }
    }
  }

  return { markup, shortcodes };
};
