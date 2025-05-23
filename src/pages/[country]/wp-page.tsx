import DOMPurify from 'isomorphic-dompurify';
import { defaultLayout } from '@src/components/layouts/default';
import type { NextPageWithLayout } from '@src/pages/_app';
import { GetServerSideProps } from 'next';
import { DOMParser } from 'xmldom';
import { JSDOM } from 'jsdom';
import { useEffect } from 'react';
import Script from 'next/script';

interface PageProps {
  html: string;
  content: string;
  stylesheets: string[];
  inlineStyles: string[];
  scripts: string[];
  externalScripts: string[];
  inlineScripts: string[];
}

// Function to load external scripts
function loadExternalScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;

    // Define event handlers with the correct type signatures
    script.onload = () => {
      resolve(); // Resolve the promise when the script is loaded
    };

    script.onerror = (error) => {
      reject(error); // Reject the promise if there's an error loading the script
    };

    document.head.appendChild(script); // Simulate adding the script to the document head
  });
}

// Function to mimic how the browser loads scripts
async function loadScripts(document: Document) {
  // Ensure this code only runs in the client-side
  if (typeof window === 'undefined') return;

  // Get all <script> elements
  const scripts = Array.from(document.querySelectorAll('script'));

  // Load blocking scripts first (those without async or defer)
  const blockingScripts = scripts.filter(
    (script) => !script.hasAttribute('async') && !script.hasAttribute('defer')
  );

  for (const script of blockingScripts) {
    if (script.src) {
      // External script
      await loadExternalScript(script.src);
    } else {
      // Inline script
      eval(script.innerHTML); // Be cautious with eval in production!
    }
  }

  // Load async scripts (those with the async attribute)
  const asyncScripts = scripts.filter((script) => script.hasAttribute('async'));
  for (const script of asyncScripts) {
    if (script.src) {
      // External script
      loadExternalScript(script.src);
    } else {
      // Inline script
      eval(script.innerHTML); // Be cautious with eval in production!
    }
  }

  // Load deferred scripts (those with the defer attribute)
  const deferredScripts = scripts.filter((script) => script.hasAttribute('defer'));
  for (const script of deferredScripts) {
    if (script.src) {
      // External script
      loadExternalScript(script.src);
    } else {
      // Inline script
      eval(script.innerHTML);
    }
  }
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('https://cart.sullivansupply-bc-v1.blz.onl/stock-show-u/?no-redirect=1');
  const html = await res.text();
  // Parse HTML and extract content inside <body>
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const bodyContent = dom.window.document.body.innerHTML;

  // Extract all external stylesheets
  const stylesheets: string[] = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map((link) => link.getAttribute('href') || '')
    .filter((href) => href !== '');

  // Extract all inline <style> tags
  const inlineStyles: string[] = Array.from(document.querySelectorAll('style')).map(
    (style) => style.innerHTML
  );

  // Extract all scripts
  const scripts = document.querySelectorAll('script');

  const externalScripts: string[] = [];
  const inlineScripts: string[] = [];

  scripts.forEach((script) => {
    if (script.src) {
      externalScripts.push(script.src);
    } else if (script.textContent) {
      inlineScripts.push(script.textContent);
    }
  });

  return {
    props: {
      content: DOMPurify.sanitize(bodyContent), // Prevent XSS attacks
      stylesheets,
      inlineStyles,
      externalScripts,
      inlineScripts,
      html,
    },
  };
};

const Home: NextPageWithLayout<PageProps> = ({
  content,
  stylesheets,
  inlineStyles,
  externalScripts,
  inlineScripts,
  html,
}) => {
  // useEffect(() => {
  //   const dom = new DOMParser().parseFromString(html, 'text/html');
  //   loadScripts(dom); // Mimic script loading when the component mounts
  // }, [html]);

  return (
    <>
      {/* Render external styles */}
      {/* {stylesheets.map((href, index) => (
        <link
          key={index}
          rel="stylesheet"
          href={href}
        />
      ))} */}

      {/* Render inline styles */}
      {/* {inlineStyles.map((style, index) => (
        <style
          key={index}
          dangerouslySetInnerHTML={{ __html: style }}
        />
      ))} */}
      {/* <div dangerouslySetInnerHTML={{ __html: html }} /> */}

      {/* Load external scripts dynamically */}
      {/* {externalScripts.map((src, index) => (
        <Script
          key={index}
          src={src}
          strategy="afterInteractive"
        />
      ))} */}
    </>
  );
};

Home.getLayout = defaultLayout;

export default Home;
