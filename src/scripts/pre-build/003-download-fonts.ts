/* eslint-disable no-console */
import { maybeCreateDir, maybeDeleteDir, maybeDeleteFile } from '@src/scripts/utils';

import * as fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { IncomingMessage } from 'http';
import wpTheme from '@public/wp-theme.json';
import { camelCase } from 'lodash';

// TODO: Add fonts from dancewear and squadron
const defaultFonts = [
  {
    name: 'Geist Sans',
    slug: 'geist-sans',
    fontFamily: 'Geist Sans',
    fontFace: [
      {
        fontFamily: 'Geist Sans',
        fontStyle: 'normal',
        fontWeight: '100',
        src: 'https://fonts.gstatic.com/s/geist/v1/gyBhhwUxId8gMGYQMKR3pzfaWI_RnOI4nZPby1QNtA.ttf',
      },
      {
        fontFamily: 'Geist Sans',
        fontStyle: 'normal',
        fontWeight: '200',
        src: 'https://fonts.gstatic.com/s/geist/v1/gyBhhwUxId8gMGYQMKR3pzfaWI_RHOM4nZPby1QNtA.ttf',
      },
      {
        fontFamily: 'Geist Sans',
        fontStyle: 'normal',
        fontWeight: '300',
        src: 'https://fonts.gstatic.com/s/geist/v1/gyBhhwUxId8gMGYQMKR3pzfaWI_RwuM4nZPby1QNtA.ttf',
      },
      {
        fontFamily: 'Geist Sans',
        fontStyle: 'normal',
        fontWeight: '400',
        src: 'https://fonts.gstatic.com/s/geist/v1/gyBhhwUxId8gMGYQMKR3pzfaWI_RnOM4nZPby1QNtA.ttf',
      },
      {
        fontFamily: 'Geist Sans',
        fontStyle: 'normal',
        fontWeight: '500',
        src: 'https://fonts.gstatic.com/s/geist/v1/gyBhhwUxId8gMGYQMKR3pzfaWI_RruM4nZPby1QNtA.ttf',
      },
      {
        fontFamily: 'Geist Sans',
        fontStyle: 'normal',
        fontWeight: '600',
        src: 'https://fonts.gstatic.com/s/geist/v1/gyBhhwUxId8gMGYQMKR3pzfaWI_RQuQ4nZPby1QNtA.ttf',
      },
      {
        fontFamily: 'Geist Sans',
        fontStyle: 'normal',
        fontWeight: '700',
        src: 'https://fonts.gstatic.com/s/geist/v1/gyBhhwUxId8gMGYQMKR3pzfaWI_Re-Q4nZPby1QNtA.ttf',
      },
      {
        fontFamily: 'Geist Sans',
        fontStyle: 'normal',
        fontWeight: '800',
        src: 'https://fonts.gstatic.com/s/geist/v1/gyBhhwUxId8gMGYQMKR3pzfaWI_RHOQ4nZPby1QNtA.ttf',
      },
      {
        fontFamily: 'Geist Sans',
        fontStyle: 'normal',
        fontWeight: '900',
        src: 'https://fonts.gstatic.com/s/geist/v1/gyBhhwUxId8gMGYQMKR3pzfaWI_RNeQ4nZPby1QNtA.ttf',
      },
    ],
  },
  {
    name: 'Geist Mono',
    slug: 'geist-mono',
    fontFamily: 'Geist Mono',
    fontFace: [
      {
        fontFamily: 'Geist Mono',
        fontStyle: 'normal',
        fontWeight: '100',
        src: 'https://fonts.gstatic.com/s/geistmono/v1/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeE9KZ5T7ihaO_CS.ttf',
      },
      {
        fontFamily: 'Geist Mono',
        fontStyle: 'normal',
        fontWeight: '200',
        src: 'https://fonts.gstatic.com/s/geistmono/v1/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeG9KJ5T7ihaO_CS.ttf',
      },
      {
        fontFamily: 'Geist Mono',
        fontStyle: 'normal',
        fontWeight: '300',
        src: 'https://fonts.gstatic.com/s/geistmono/v1/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeFjKJ5T7ihaO_CS.ttf',
      },
      {
        fontFamily: 'Geist Mono',
        fontStyle: 'normal',
        fontWeight: '400',
        src: 'https://fonts.gstatic.com/s/geistmono/v1/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeE9KJ5T7ihaO_CS.ttf',
      },
      {
        fontFamily: 'Geist Mono',
        fontStyle: 'normal',
        fontWeight: '500',
        src: 'https://fonts.gstatic.com/s/geistmono/v1/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeEPKJ5T7ihaO_CS.ttf',
      },
      {
        fontFamily: 'Geist Mono',
        fontStyle: 'normal',
        fontWeight: '600',
        src: 'https://fonts.gstatic.com/s/geistmono/v1/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeHjL55T7ihaO_CS.ttf',
      },
      {
        fontFamily: 'Geist Mono',
        fontStyle: 'normal',
        fontWeight: '700',
        src: 'https://fonts.gstatic.com/s/geistmono/v1/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeHaL55T7ihaO_CS.ttf',
      },
      {
        fontFamily: 'Geist Mono',
        fontStyle: 'normal',
        fontWeight: '800',
        src: 'https://fonts.gstatic.com/s/geistmono/v1/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeG9L55T7ihaO_CS.ttf',
      },
      {
        fontFamily: 'Geist Mono',
        fontStyle: 'normal',
        fontWeight: '900',
        src: 'https://fonts.gstatic.com/s/geistmono/v1/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeGUL55T7ihaO_CS.ttf',
      },
    ],
  },
];

export function getFonts() {
  const fontFamilies = wpTheme.typography?.fontFamilies?.custom || [];
  return defaultFonts.map((font, index) => {
    // Make sure we have a valid font object with a slug property
    return fontFamilies[index] && typeof fontFamilies[index] === 'object' && 'slug' in fontFamilies[index]
      ? fontFamilies[index]
      : font;
  });
}

// Helper function to download a font file
async function downloadFont(url: string, filePath: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Use HTTP for localhost, HTTPS for everything else
    const httpModule = url.includes('localhost') || url.includes('.local') ? http : https;

    const request = httpModule.get(url, { timeout: 10000 }, (res: IncomingMessage) => {
      // Handle redirects (status codes 301, 302, 307, 308)
      if (res.statusCode && [301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        console.log(`Following redirect from ${url} to ${res.headers.location}`);
        return downloadFont(res.headers.location, filePath).then(resolve);
      }

      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Downloaded: ${filePath}`);
          resolve(true);
        });

        fileStream.on('error', (err) => {
          console.error(`Error writing to file ${filePath}: ${err.message}`);
          resolve(false);
        });
      } else {
        console.error(`Failed to download font. Status code: ${res.statusCode}`);
        resolve(false);
      }
    });

    request.on('error', (err) => {
      console.error(`Error downloading ${url}: ${err.message}`);
      resolve(false);
    });

    request.on('timeout', () => {
      console.error(`Timeout downloading ${url}`);
      request.destroy();
      resolve(false);
    });
  });
}

export default async function execute() {
  try {
    const fontPath = path.resolve(process.cwd(), 'public', 'fonts');
    const newFontPath = path.join(process.cwd(), 'public', 'fonts.ts');

    // Get WordPress site URL from environment
    const wpSiteUrl = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || '';

    // Check if it's a local environment by URL
    const isLocalEnvironment = wpSiteUrl.includes('.local');

    // If we're in a local environment, we'll use the production URL for fonts
    let fontBaseUrl = wpSiteUrl;
    if (isLocalEnvironment) {
      // Use NEXT_PUBLIC_WORDPRESS_SITE_URL but ensure it's HTTP for local
      fontBaseUrl = wpSiteUrl.replace(/^https:/, 'http:');
      console.log(`Local environment detected. Using ${fontBaseUrl} for font downloads.`);
    }

    maybeDeleteDir(fontPath);
    // Ensure the directory exists
    maybeCreateDir(fontPath);
    maybeDeleteFile(path.resolve(process.cwd(), 'public', 'fonts.ts'));

    // Try to get WordPress fonts first, fallback to default fonts
    const wpFontFamilies = wpTheme.typography?.fontFamilies?.custom || [];

    // Determine which fonts to use - WordPress fonts or default fonts
    let fontFamilies = defaultFonts;

    // Check if WordPress has valid font definitions
    if (wpFontFamilies.length > 0 && wpFontFamilies.every(font => font && typeof font === 'object' && 'slug' in font)) {
      console.log('Using WordPress theme fonts');
      fontFamilies = wpFontFamilies.map((font, index) => {
        // If WordPress font is valid, use it; otherwise, use the corresponding default font
        return (font && typeof font === 'object' && 'slug' in font) ? font : defaultFonts[index] || defaultFonts[0];
      });
    } else {
      console.log('WordPress theme fonts not found or invalid, using default fonts');
    }

    if (fontFamilies && fontFamilies.length > 0) {
      let output = '// Generated fonts.ts file\n\n';
      output += `import localFont from '${'next/font/local'}';\n\n`;

      // Process each font family
      for (const font of fontFamilies) {
        // Process each font face within the family
        for (const face of font.fontFace) {
          // Get the original URL
          let fontUrl = face.src;

          // If we're in a local environment, adjust the URL
          if (isLocalEnvironment) {
            // Extract the path part of the URL (after the domain)
            const urlParts = fontUrl.match(/https?:\/\/[^\/]+(\/.*)/);
            if (urlParts && urlParts[1]) {
              const fontPath = urlParts[1];
              // Construct new URL with appropriate domain and same path
              fontUrl = `${fontBaseUrl}${fontPath}`;
              console.log(`Using adjusted URL for font: ${fontUrl}`);
            }
          }

          const fileName = path.basename(fontUrl);
          const filePath = path.join(process.cwd(), 'public', 'fonts', fileName);

          // First create an empty placeholder file to ensure the build doesn't fail
          fs.writeFileSync(filePath, '');

          // Then try to download the actual font
          try {
            const success = await downloadFont(fontUrl, filePath);
            if (success) {
              console.log(`Successfully downloaded font: ${fileName}`);
            } else {
              console.log(`Using empty placeholder for font: ${fileName}`);
            }
          } catch (err) {
            console.error(`Error in font download process: ${err}`);
            // Placeholder already created, so build will continue
          }
        }
      }

      // Now generate the fonts.ts file
      fontFamilies.forEach((font) => {
        output += `export const ${camelCase(font.slug)} = localFont({\n`;
        output += '    src: [\n';
        font.fontFace.forEach((face) => {
          const fileName = path.basename(face.src);

          output += `\t\t\t{ path: 'fonts/${fileName}', weight: '${
            face.fontWeight.replace(/[a-zA-Z]/g, '').trim() || '400'
          }', style: '${face.fontStyle}' },\n`;
        });
        output += '\t\t],\n';
        output += `\t\tvariable: '--font-${font.slug}'\n`;
        output += '});\n\n';
      });

      fs.writeFileSync(newFontPath, output, {
        encoding: 'utf-8',
      });

      console.log('Font files created and fonts.ts generated successfully.');
    }
  } catch (error) {
    console.error('Error processing fonts:', error);
  }
}
