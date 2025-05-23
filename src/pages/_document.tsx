import Document, {
  Head,
  Html,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';
import Script from 'next/script';

import { env } from '@src/lib/env';
import { isDevelopmentEnvironment } from '@src/lib/helpers/helper';
import * as fonts from '@public/fonts';
import siteData from '@public/config.json';
import { ServerStyleSheet } from 'styled-components';
const fontClasses = Object.keys(fonts)
  .map((key) => fonts[key as keyof typeof fonts].variable)
  .filter(Boolean)
  .join(' ');

const { KLAVIYO_PUBLIC_KEY, NEXT_PUBLIC_GTM_ID } = env();

class BlazeCommerceDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps & { html: string }> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      // Collect styles from styled-components
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
        html:
          '\n<!-- Open Source Headless WooCommerce by Blaze Commerce - https://blazecommerce.io -->' +
          initialProps.html,
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {isDevelopmentEnvironment() && (
            <meta
              name="robots"
              content="noindex, nofollow"
            />
          )}
          {/* Google Tag Manager Script - Add to Head */}
          {NEXT_PUBLIC_GTM_ID && (
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtm.js?id=${NEXT_PUBLIC_GTM_ID}`}
            />
          )}
        </Head>
        <body className={fontClasses ?? 'font-sans'}>
          {/* Google Tag Manager (noscript) */}
          {NEXT_PUBLIC_GTM_ID && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${NEXT_PUBLIC_GTM_ID}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
                title="GTM"
              ></iframe>
            </noscript>
          )}

          <Main />
          <NextScript />

          {/* Klaviyo Script */}
          {KLAVIYO_PUBLIC_KEY && (
            <Script
              id="klaviyo-script"
              src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${KLAVIYO_PUBLIC_KEY}`}
              strategy="beforeInteractive"
            />
          )}

          {/* Pinterest Script */}
          {siteData.showShareToPinterestButton && (
            <Script
              id="pinterest-pin-it"
              src="//assets.pinterest.com/js/pinit.js"
            />
          )}
        </body>
      </Html>
    );
  }
}

export default BlazeCommerceDocument;
